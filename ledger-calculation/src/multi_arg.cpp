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
	std::string new_trade = "input_data.txt";
	std::string overflow = "overflow.txt";
	std::string lc_record = "lc_record.txt";

	std::ifstream new_trade_file;
	std::fstream overflow_file(overflow, std::ios::in | std::ios::out);
	std::fstream lc_record_file(lc_record, std::ios::in | std::ios::out);

	if (std::filesystem::exists(new_trade) == false)
	{
		std::cout << new_trade << " 不存在" << std::endl;
	}
	new_trade_file.open(new_trade);

	if (new_trade_file.is_open() == false)
	{
		std::cout << new_trade << " 打开失败" << std::endl;
	}
	else
	{
		std::cout << new_trade << " 打开成功" << std::endl;
	}
	if (overflow_file.is_open() == false)
	{
		std::cout << overflow << " 打开失败" << std::endl;
	}
	else
	{
		std::cout << overflow << " 打开成功" << std::endl;
	}
	if (lc_record_file.is_open() == false)
	{
		std::cout << lc_record << " 打开失败" << std::endl;
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
	for (int i = 0; i < argc; ++i)
	{
		std::cout << argv[i] << std::endl;
	}

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

