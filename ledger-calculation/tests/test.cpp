#include <ledger_calculation.hpp>
#include <base_function.hpp>
#include <queue>
#include <fstream>

using namespace std;

void test1();

int main()
{
	test1();

	return 0;
}

void test1()
{
	LedgerCalculation testget;

	std::fstream file;

	testget.input(std::cin);
	testget.output(std::cout);

	system("pause");
}
