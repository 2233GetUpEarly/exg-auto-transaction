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

int main()
{
	test1();
	//test2();

	return 0;
}
