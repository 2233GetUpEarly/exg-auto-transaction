#include "LedgerCalculation.h"
#include "LedgerCalculation2.h"
#include "BaseFunction.h"
#include <fstream>

using namespace std;

void test1()
{
	LedgerCalculation::consoleComprehensiveFormatMatching();

	//LedgerCalculation::consoleStringInputForEXG_Format();

	//LedgerCalculation::consoleStringInput();

	//LedgerCalculation::consoleNumberInput();
	system("pause");
}

void test2()
{
	//std::priority_queue<std::pair<int, int>, std::vector<std::pair<int, int>>, secondFront> _qsell_int;
	std::priority_queue<LCpair, std::vector<LCpair>, firstFront> _qsell_int;

	_qsell_int.push({ 8000, 10, "haha"});
	_qsell_int.push({ 9000, 10, "haha" });
	_qsell_int.push({ 8000, 20, "haha" });
	_qsell_int.push({ 7000, 10, "haha" });
	_qsell_int.push({ 7001, 20, "haha" });
	_qsell_int.push({ 7001, 10, "haha" });
	_qsell_int.push({ 7000, 20, "haha" });

	while (_qsell_int.size())
	{
		std::cout << _qsell_int.top().first << " " << _qsell_int.top().second << " " << _qsell_int.top().third << endl;
		_qsell_int.pop();
	}
}

void test3()
{
	multimap<int, int> t1 = { { 1, 1 }, {2, 2}, {3, 3} };

	//auto it = t1.rbegin();
	auto it = t1.rend();
	while (it != t1.rend())
	{
		bool is_back = false;

		std::cout << it->first << " " << it->second << std::endl;
		int key = it->first;
		if (it == t1.rbegin())
		{
			is_back = true;
		}
		else
		{
			++it;
		}
		t1.erase(t1.find(key));
		if (is_back == true)
		{
			it = t1.rbegin();
		}
	}
	std::cout << (t1.rbegin() == t1.rend()) << std::endl;
}

void test4()
{
	LCUnit one(24000, 30, SellType::SellInt);
	LCUnit two(45000, 50, SellType::SellTra);

	std::cout << one.getStringInfo() << std::endl;
	std::cout << two.getStringInfo() << std::endl;
	std::cout << std::endl;

	auto info = LCUnit::calIntProfit(one, two);

	std::cout << info.first << std::endl;
	std::cout << info.second.first.getStringInfo() << std::endl;
	std::cout << info.second.second << std::endl;
	std::cout << std::endl;

	std::cout << one.getStringInfo() << std::endl;
	std::cout << std::endl;

	std::cout << two.getStringInfo() << std::endl;
	std::cout << std::endl;

	std::cout << "-------------" << std::endl;
	std::cout << std::endl;

	auto ans = collationSellUnit(one.getStringInfo(), info.second.first.getStringInfo() , info.second.second, "            ");
	std::cout << ans.first << std::endl;
	std::cout << ans.second << std::endl;
	std::cout << std::endl;
	std::cout << std::endl;

	LCUnit a1(40001, 50, SellType::SellInt);
	LCUnit a2(24000, 30, SellType::SellInt);

	auto ans2 = LCUnit::mergeSameProportionSellType(a1, a2);
	std::cout << ans2.first << std::endl;
	std::cout << ans2.second.getStringInfo() << std::endl;
}

void test5()
{
	LedgerCalculation2 testget;

	std::fstream file;
	//file.open("C:\\Users\\33049\\Desktop\\ÕË±¾.txt", std::ios::in);
	file.open("test.txt", std::ios::in);

	//testget.input(file);
	testget.input(std::cin);
	testget.output(std::cout);

	file.close();
}

int main()
{
	//test3();
	//test1();
	//test2();
	//test4();
	test5();

	return 0;
}
