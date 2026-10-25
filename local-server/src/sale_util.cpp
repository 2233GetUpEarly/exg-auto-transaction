#include <core/simple_log.hpp>
#include <core/util.hpp>
#include <core/sale_util.hpp>

#include <nlohmann/json.hpp>

#include <iostream>
#include <sstream>
#include <regex>

#ifdef _WIN32
#include <Windows.h>
#elif __linux__
#include <sys/types.h>
#include <sys/wait.h>
#include <unistd.h>
#include <cstring>
#include <cerrno>
#endif

// 真实实现：把原来 _WIN32 / __linux__ 的分支搬进来
class ProcessRunner : public IProcessRunner
{
public:

	int run(const std::filesystem::path& exe, const std::vector<std::string>& args) override
	{
#ifdef _WIN32
		std::wstring exe_w = exe.wstring();
		std::wstring cmd = L"\"" + exe_w + L"\"";
		for (const auto& a : args)
		{
			std::wstring wa = to_wide(a);
			cmd += L" ";
			cmd += (wa.find(L' ') != std::wstring::npos) ? (L"\"" + wa + L"\"") : wa;
		}

		STARTUPINFOW si = { sizeof(si) };
		PROCESS_INFORMATION pi = { 0 };
		BOOL ok = ::CreateProcessW(exe_w.c_str(), &cmd[0], nullptr, nullptr,
			FALSE, 0, nullptr, nullptr, &si, &pi);
		if (!ok) return -1;

		::WaitForSingleObject(pi.hProcess, INFINITE);
		DWORD ec = 0;
		::GetExitCodeProcess(pi.hProcess, &ec);
		::CloseHandle(pi.hProcess);
		::CloseHandle(pi.hThread);
		return static_cast<int>(ec);

#elif __linux__
		std::string exe_s = exe.string();
		pid_t pid = ::fork();
		if (pid < 0) return -1;
		if (pid == 0)
		{
			// 子进程
			std::vector<char*> argv;
			argv.reserve(args.size() + 2);
			argv.push_back(const_cast<char*>(exe_s.c_str()));
			for (const auto& a : args) argv.push_back(const_cast<char*>(a.c_str()));
			argv.push_back(nullptr);
			::execvp(exe_s.c_str(), argv.data());
			_exit(127);   // exec 失败
		}

		int status = 0;
		if (::waitpid(pid, &status, 0) < 0) return -1;
		if (WIFEXITED(status))   return WEXITSTATUS(status);
		if (WIFSIGNALED(status)) return 128 + WTERMSIG(status);
		return -1;
#else
		(void)exe; (void)args; return -1;
#endif
	}

#ifdef _WIN32
private:
	static std::wstring to_wide(const std::string& s)
	{
		if (s.empty())
		{
			return {};
		}

		int n = ::MultiByteToWideChar(CP_UTF8, 0, s.data(), static_cast<int>(s.size()), nullptr, 0);
		if (n <= 0)
		{
			return {};
		}
		std::wstring w(static_cast<std::size_t>(n), L'\0');
		::MultiByteToWideChar(CP_UTF8, 0, s.data(), static_cast<int>(s.size()), w.data(), n);
		return w;
	}
#endif
};

SaleUtil::SaleUtil(std::unique_ptr<SaleConfig> cfg, std::shared_ptr<IProcessRunner> runner)
	:cfg_(std::move(cfg))
	,runner_(runner)
{
	;
}

SaleUtil::~SaleUtil()
{
	;
}

SaleUtil& SaleUtil::make_default()
{
	static SaleUtil default_sale_util(std::make_unique<SaleConfig>(), std::make_shared<ProcessRunner>());
	return default_sale_util;
}

std::string SaleUtil::read_file(const std::filesystem::path& p, bool& ok) const
{
	std::ifstream ifs(p, std::ios::binary);
	if (!ifs.is_open())
	{
		ok = false;
		return {};
	}
	std::ostringstream ss;
	ss << ifs.rdbuf();
	ok = true;
	return ss.str();
}

bool SaleUtil::write_file(const std::filesystem::path& p, const std::string& data) const
{
	auto parent = p.parent_path();
	if (!parent.empty())
	{
		std::error_code ec;
		std::filesystem::create_directories(parent, ec);
		if (ec)
		{
			return false;
		}
	}

	std::ofstream ofs(p, std::ios::binary | std::ios::trunc);
	if (!ofs.is_open())
	{
		return false;
	}
	ofs << data;
	return ofs.good();
}

std::string SaleUtil::get_sale_latest_time(const std::string& str)
{
	// 匹配 ISO8601 时间：YYYY-MM-DDTHH:MM:SS
	std::regex re(R"(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})");

	std::string line;
	std::string latest_time;
	std::stringstream sin(str);

	while (std::getline(sin, line))
	{
		std::smatch m;
		if (std::regex_search(line, m, re))	 // 只匹配第一个也就是最新的时间
		{
			latest_time = m.str();
			break;
		}
	}

	return latest_time;
}

std::size_t SaleUtil::find_truncate_position(const std::string& sale_data, const std::string& latest_time)
{
	std::string line;
	std::stringstream sin(sale_data);

	std::vector<std::size_t> starts;
	std::size_t offset = 0;
	while (std::getline(sin, line))
	{
		starts.push_back(offset);
		if (line == latest_time)
		{
			return starts.size() >= 3 ? starts[starts.size() - 3] : 0;
		}
		offset += line.size();
		if (sin.peek() != EOF) offset += 1;
	}
	return sale_data.size();   // 未找到 → 不修改
}

void SaleUtil::remove_already_calculate_data(std::string& sale_data_str)
{
	bool ok = false;
	auto attr = read_file(cfg_->data_dir / "sale_attribute.json", ok);
	if (!ok)
	{
		LOG(ERRO) << "销售属性文件打开失败，取消去除已计算数据";
		return;
	}

	std::string latest;
	try
	{
		latest = nlohmann::json::parse(attr)["latest_time"].get<std::string>();
	}
	catch (const std::exception& e)
	{
		LOG(ERRO) << "解析 sale_attribute.json 失败: " << e.what();
		return;                    // 修正原实现"抛异常"的行为
	}

	LOG(DEBUG) << "获取上次计算过的销售信息时间: " << latest;
	auto n = find_truncate_position(sale_data_str, latest);
	if (n < sale_data_str.size())
	{
		sale_data_str.resize(n);
		LOG(DEBUG) << "销售记录移除已计算数据";
	}
}

void SaleUtil::save_sale_data_to_file(const std::string& sale_data_str)
{
	if (!write_file(cfg_->data_dir / "sale_data.txt", sale_data_str))
	{
		LOG(ERRO) << "销售文件打开失败";
		return;
	}
	LOG(DEBUG) << "销售记录输出到销售文件中";
}

void SaleUtil::save_latest_time_attribute_to_file(const std::string& latest_time)
{
	nlohmann::json j;
	j["latest_time"] = latest_time;

	if (!write_file(cfg_->data_dir / "sale_attribute.json", j.dump()))
	{
		LOG(ERRO) << "销售属性文件打开失败";
		return;
	}
	LOG(DEBUG) << "销售最新时间输出到销售属性文件中";
}

void SaleUtil::execute_ledger_calculation()
{
	bool ok = false;
	auto data = read_file(cfg_->data_dir / "sale_data.txt", ok);
	if (!ok)
	{
		LOG(ERRO) << "读取 sale_data.txt 失败";
		return;
	}

	if (!write_file(cfg_->data_dir / "input_data.txt", data))
	{
		LOG(ERRO) << "写 input_data.txt 失败";
		return;
	}

	int code = runner_->run(cfg_->ledger_exe, { "-f" });
	if (code == 0)
	{
		LOG(DEBUG) << "账本计算执行完毕";
	}
	else
	{
		LOG(ERRO) << "账本计算出错, exit_code=" << code;
	}
}

std::string get_sale_latest_time(const std::string& str)
{
	return SaleUtil::make_default().get_sale_latest_time(str);
}

void remove_already_calculate_data(std::string& sale_data_str)
{
	SaleUtil::make_default().remove_already_calculate_data(sale_data_str);
}

void save_sale_data_to_file(const std::string& sale_data_str)
{
	SaleUtil::make_default().save_sale_data_to_file(sale_data_str);
}

void save_latest_time_attribute_to_file(const std::string& latest_time)
{
	SaleUtil::make_default().save_latest_time_attribute_to_file(latest_time);
}

void execute_ledger_calculation()
{
	SaleUtil::make_default().execute_ledger_calculation();
}