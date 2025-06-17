#pragma once

#include <iostream>
#include <string>
#include <vector>
#include <queue>
#include <cassert>

struct secondFront
{
	bool operator()(const std::pair<int, int>& e1, const std::pair<int, int>& e2)
	{
		if (e1.second < e2.second)
		{
			return false;
		}
		else if (e1.second == e2.second && e1.first <= e2.first)
		{
			return false;
		}
		else
		{
			return true;
		}
	}
};

class LedgerCalculation
{
public:

	bool getInfo(int one, int two);

	void sellIntegral(int integral, int transactionCoins);

	void sellTransactionCoins(int integral, int transactionCoins);

	void calculate();

	void showCalculateResult();

	void showOtherResult();

	static void consoleNumberInput();

	static void consoleStringInput();

	static void consoleStringInputForEXG_Format();
	
	static void consoleComprehensiveFormatMatching();

private:

	//std::priority_queue<std::pair<int, int>, std::vector<std::pair<int, int>>, secondFront> _qsell_int;
	//std::priority_queue<std::pair<int, int>, std::vector<std::pair<int, int>>, secondFront> _qsell_tra;

	std::queue<std::pair<int, int>> _qsell_int;
	std::queue<std::pair<int, int>> _qsell_tra;

	std::queue<std::string> _sell_int;
	std::queue<std::string> _sell_tra;

	std::vector<std::string> _sell_ans;
	std::vector<std::string> _leftover;
};
