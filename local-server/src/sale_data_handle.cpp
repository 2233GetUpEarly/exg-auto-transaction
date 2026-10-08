#include <task/sale_data_handle.hpp>
#include <core/simple_log.hpp>
#include <iostream>
#include <sstream>
#include <fstream>
#include <filesystem>
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

SaleDataHandle::SaleDataHandle()
{

}

SaleDataHandle::~SaleDataHandle()
{

}

static std::string get_sale_latest_time(const std::string& str)
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

	if (!latest_time.empty())
	{
		LOG(DEBUG) << "获取最新销售信息时间: " << latest_time;
	}
	else
	{
		LOG(ERRO) << "没有找到最新销售时间";
	}

	return latest_time;
}

static void remove_already_calculate_data(std::string& sale_data_str)
{
	std::string data_path = "../data/";
	std::string data_file = "sale_attribute.json";

	if (std::filesystem::exists(data_path) == false)
	{
		std::filesystem::create_directories(data_path);
	}

	std::string filename = data_path + data_file;
	std::ifstream sale_attribute_file(filename);
	if (sale_attribute_file.is_open() == false)
	{
		LOG(ERRO) << "销售属性文件打开失败，取消去除已计算数据";
		return;
	}

	auto size = std::filesystem::file_size(filename);
	std::string sale_attribute_str(size, '\0');
	sale_attribute_file.read(sale_attribute_str.data(), size);

	nlohmann::json json = nlohmann::json::parse(sale_attribute_str);
	std::string already_calculate_time = json["latest_time"].get<std::string>();

	LOG(DEBUG) << "获取上次计算过的销售信息时间: " << already_calculate_time;

	std::string line;
	std::stringstream sin(sale_data_str);

	std::vector<size_t> starts;   // 每行起始偏移
	size_t offset = 0;
	bool find_time = false;
	size_t cut_pos = 0;

	while (std::getline(sin, line))
	{
		starts.push_back(offset);          // 记录本行起始

		if (line == already_calculate_time)
		{
			find_time = true;
			// 删匹配行及其前两行 => 起点是倒数第3个起始位置
			if (starts.size() >= 3)
			{
				cut_pos = starts[starts.size() - 3];
			}
			else
			{
				cut_pos = 0;
			}
			break;
		}

		offset += line.size();
		if (sin.peek() != EOF)
		{
			offset += 1;  // 补上被 getline 吃掉的 '\n'
		}
	}

	if (find_time)
	{
		sale_data_str.resize(cut_pos);
	}

	LOG(DEBUG) << "销售记录移除已计算数据";
	sale_attribute_file.close();
}

static void save_sale_data_to_file(const std::string& sale_data_str)
{
	std::string data_path = "../data/";
	std::string data_file = "sale_data.txt";

	if (std::filesystem::exists(data_path) == false)
	{
		std::filesystem::create_directories(data_path);
	}

	std::string filename = data_path + data_file;
	std::ofstream sale_file(filename);
	if (sale_file.is_open() == false)
	{
		LOG(ERRO) << "销售文件打开失败";
		assert(false);
		return;
	}

	sale_file << sale_data_str;
	LOG(DEBUG) << "销售记录输出到销售文件中";

	sale_file.close();
}

static bool check_json_key(nlohmann::json& json)
{
	if (json.contains("eat_type") == false)
	{
		LOG(ERRO) << "未找到 key 类型: eat_type";
		return false;
	}
	if (json.contains("eat_data") == false)
	{
		LOG(ERRO) << "未找到 key 类型: eat_data";
		return false;
	}
	return true;
}

static void save_latest_time_attribute_to_file(const std::string& latest_time)
{
	std::string data_path = "../data/";
	std::string data_file = "sale_attribute.json";

	if (std::filesystem::exists(data_path) == false)
	{
		std::filesystem::create_directories(data_path);
	}

	std::string filename = data_path + data_file;
	std::ofstream sale_attribute_file(filename);
	if (sale_attribute_file.is_open() == false)
	{
		LOG(ERRO) << "销售属性文件打开失败";
		assert(false);
		return;
	}

	nlohmann::json json;
	json["latest_time"] = latest_time;
	sale_attribute_file << json;
	LOG(DEBUG) << "销售最新时间输出到销售属性文件中";
	
	sale_attribute_file.close();
}

static void execute_ledger_calculation()
{
	std::string data_path = "../data/";
	std::string data_file = "sale_data.txt";

	if (std::filesystem::exists(data_path) == false)
	{
		std::filesystem::create_directories(data_path);
	}

	std::string filename = data_path + data_file;
	std::ifstream sale_file(filename);
	if (sale_file.is_open() == false)
	{
		LOG(ERRO) << "销售文件打开失败";
		assert(false);
		return;
	}

	std::string input_data_file = data_path + "input_data.txt";
	std::ofstream input_file(input_data_file);
	auto size = std::filesystem::file_size(filename);

	std::string sale_data_str(size, '\0');
	sale_file.read(sale_data_str.data(), size);

	input_file << sale_data_str;

	LOG(DEBUG) << "销售文件输出到 input_data.txt 中";
	sale_file.close();
	input_file.close();

#ifdef _WIN32
	STARTUPINFOW si = { sizeof(si) };
	PROCESS_INFORMATION pi = { 0 };

	std::wstring exe_path = L".\\ledger_calculation.exe";
	std::wstring cmd_line = L"\"" + exe_path + L"\" -f";

	// 注意：lpCommandLine 必须可写，不能传字符串字面量
	BOOL ok = CreateProcessW(
		exe_path.c_str(),      // 应用程序路径
		&cmd_line[0],          // 命令行（含参数）
		NULL, NULL,
		FALSE,
		0,                    // 创建标志，如 CREATE_NEW_CONSOLE
		NULL,                 // 环境变量
		NULL,                 // 工作目录，NULL 表示当前目录
		&si, &pi
	);

	if (!ok)
	{
		// 用 GetLastError() 查看错误
		return;
	}

	// 等待子进程结束（可选）
	WaitForSingleObject(pi.hProcess, INFINITE);
	DWORD exit_code;
	GetExitCodeProcess(pi.hProcess, &exit_code);

	CloseHandle(pi.hProcess);
	CloseHandle(pi.hThread);

	if (exit_code == 0)
	{
		LOG(DEBUG) << "账本计算执行完毕";
	}
	else
	{
		LOG(ERRO) << "账本计算出错";
	}

#elif __linux__
    std::string exe_path = "../ledger-calculation/ledger_calculation";

    pid_t pid = fork();
    if (pid < 0)
    {
        LOG(ERRO) << "fork 失败: " << std::strerror(errno);
        return;
    }
    else if (pid == 0)
    {
        // 子进程
        // argv[0] 是程序名，argv[1] 是 "-f"，最后以 nullptr 结尾
        const char* argv[] = { exe_path.c_str(), "-f", nullptr };
        execvp(exe_path.c_str(), const_cast<char* const*>(argv));

        // 只有 exec 失败才会执行到这里
        std::cerr << "execvp 失败: " << std::strerror(errno) << std::endl;
        _exit(127);
    }
    else
    {
        // 父进程：等待子进程结束
        int status = 0;
        if (waitpid(pid, &status, 0) < 0)
        {
            LOG(ERRO) << "waitpid 失败: " << std::strerror(errno);
            return;
        }

        int exit_code = -1;
        if (WIFEXITED(status))
        {
            exit_code = WEXITSTATUS(status);
        }
        else if (WIFSIGNALED(status))
        {
            exit_code = 128 + WTERMSIG(status);
        }

        std::cout << exit_code << std::endl;
    }
#endif
}

void SaleDataHandle::task(nlohmann::json& json)
{
	if (check_json_key(json) == false)
	{
		LOG(ERRO) << "json 中未找到需要的 key";
		return;
	}

	int task_number = json["eat_type"].get<int>();
	LOG(DEBUG) << "任务码[" << task_number << "]:销售记录处理";

	std::string sale_data_str = json["eat_data"].get<std::string>();
	remove_already_calculate_data(sale_data_str);
	save_sale_data_to_file(sale_data_str);
	std::string latest_time = get_sale_latest_time(sale_data_str);
	save_latest_time_attribute_to_file(latest_time);
	execute_ledger_calculation();
}
