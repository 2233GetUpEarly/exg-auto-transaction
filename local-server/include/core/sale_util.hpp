#pragma once

#include <string>
#include <filesystem>

std::string get_sale_latest_time(const std::string& str);

void remove_already_calculate_data(std::string& sale_data_str);

void save_sale_data_to_file(const std::string& sale_data_str);

void save_latest_time_attribute_to_file(const std::string& latest_time);

void execute_ledger_calculation();

struct SaleConfig
{
	std::filesystem::path data_dir = "../data/";
	std::filesystem::path ledger_exe;
#ifdef _WIN32
	SaleConfig() : ledger_exe(L".\\ledger_calculation.exe") {}
#else
	SaleConfig() : ledger_exe("../ledger-calculation/ledger_calculation") {}
#endif
};

class IProcessRunner
{
public:
	virtual ~IProcessRunner() = default;
	virtual int run(const std::filesystem::path& exe, const std::vector<std::string>& args) = 0;
};

class SaleUtil
{
public:

	SaleUtil(std::unique_ptr<SaleConfig> cfg, std::shared_ptr<IProcessRunner> runner);
	~SaleUtil();

	// 方便生产环境：默认配置 + 真 runner
	static SaleUtil& make_default();

	std::string get_sale_latest_time(const std::string& str);

	std::size_t find_truncate_position(const std::string& sale_data, const std::string& latest_time);

	void remove_already_calculate_data(std::string& sale_data_str);

	void save_sale_data_to_file(const std::string& sale_data_str);

	void save_latest_time_attribute_to_file(const std::string& latest_time);

	void execute_ledger_calculation();

private:

	// 文件 I/O 集中在这里，容易替换成 mock
	std::string read_file(const std::filesystem::path& p, bool& ok) const;
	bool write_file(const std::filesystem::path& p, const std::string& data) const;

	std::unique_ptr<SaleConfig> cfg_;
	std::shared_ptr<IProcessRunner> runner_;
};
