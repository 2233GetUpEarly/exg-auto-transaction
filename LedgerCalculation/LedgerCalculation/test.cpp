#include "LedgerCalculation.h"

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

int main()
{
	//test3();
	test1();
	//test2();

	return 0;
}
