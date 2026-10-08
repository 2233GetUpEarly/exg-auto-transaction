#include <multi_arg.hpp>
#include <ledger_calculation.hpp>
#include <filesystem>
#include <fstream>
#include <cstring>

#ifdef _WIN32
#include <windows.h>
#endif

static void ledger_calculation_no_arg()
{
	LedgerCalculation lc;

	lc.input(std::cin);
	lc.ledger_calculation();
	lc.output(std::cout);

#ifdef _WIN32
	system("pause");
#endif
}

static void ledger_calculation_default_file()
{
	std::string data_path = "../data/";

	std::string new_trade = "input_data.txt";
	std::string overflow = "overflow.txt";
	std::string lc_record = "lc_record.txt";

	std::string new_trade_file_name = data_path + new_trade;
	std::string overflow_file_name = data_path + overflow;
	std::string lc_record_file_name = data_path + lc_record;

	std::ifstream new_trade_file;
	std::fstream overflow_file;
	std::fstream lc_record_file;

	if (std::filesystem::exists(data_path) == false)
	{
		std::filesystem::create_directories(data_path);
		std::cout << "创建 data/ 目录" << std::endl;
	}
	new_trade_file.open(new_trade_file_name);
	overflow_file.open(overflow_file_name, std::ios::in | std::ios::out);
	lc_record_file.open(lc_record_file_name, std::ios::in | std::ios::out);

	if (new_trade_file.is_open() == false)
	{
		std::cout << new_trade << " 打开失败" << std::endl;
		new_trade_file.open(new_trade_file_name, std::ios::in | std::ios::out | std::ios::trunc);
		std::cout << "创建 " << new_trade << " 文件" << std::endl;

		if (new_trade_file.is_open() == false)
		{
			std::cout << "创建文件失败" << std::endl;
			assert(false);
			exit(1);
		}
	}
	else
	{
		std::cout << new_trade << " 打开成功" << std::endl;
	}
	if (overflow_file.is_open() == false)
	{
		std::cout << overflow << " 打开失败" << std::endl;
		overflow_file.open(overflow_file_name, std::ios::in | std::ios::out | std::ios::trunc);
		std::cout << "创建 " << overflow << " 文件" << std::endl;
		if (overflow_file.is_open() == false)
		{
			std::cout << "创建文件失败" << std::endl;
			assert(false);
			exit(1);
		}
	}
	else
	{
		std::cout << overflow << " 打开成功" << std::endl;
	}
	if (lc_record_file.is_open() == false)
	{
		std::cout << lc_record << " 打开失败" << std::endl;
		lc_record_file.open(lc_record_file_name, std::ios::in | std::ios::out | std::ios::trunc);
		std::cout << "创建 " << lc_record << " 文件" << std::endl;
		if (lc_record_file.is_open() == false)
		{
			std::cout << "创建文件失败" << std::endl;
			assert(false);
			exit(1);
		}
	}
	else
	{
		std::cout << lc_record << " 打开成功" << std::endl;
	}

	LedgerCalculation lc;
	lc.input_overflow_record(overflow_file);
	overflow_file.clear();
	overflow_file.seekp(0, std::ios::beg);    // 定位到开头覆盖写
	lc.input(new_trade_file);
	lc.ledger_calculation();
	lc.output_lc_record(lc_record_file);
	lc.output_lc_record(std::cout);
	lc.output_lc_overflow(overflow_file);

#ifdef _WIN32
	system("pause");
#endif
}

MultiArg::MultiArg(int argc, char* argv[])
{
#ifdef _DEBUG
	for (int i = 0; i < argc; ++i)
	{
		std::cout << argv[i] << std::endl;
	}
#endif

	if (argc == 2 && strcmp(argv[1], "-f") == 0)
	{
		ledger_calculation_default_file();
	}
	else
	{
		ledger_calculation_no_arg();
	}
}

MultiArg::~MultiArg()
{
	;
}

