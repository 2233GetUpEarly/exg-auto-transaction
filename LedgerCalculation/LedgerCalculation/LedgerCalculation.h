#pragma once

#include <iostream>
#include <string>
#include <vector>
#include <queue>
#include <cassert>

template<class T1, class T2, class T3>
class three_pair
{
public:

	T1 first;		// 积分
	T2 second;		// 交易币
	T3 third;		// 字符串信息
};

using LCpair = three_pair<int, int, std::string>;

struct firstFront
{
	bool operator()(const LCpair& e1, const LCpair& e2)
	{
		if (e1.second < e2.second)
		{
			return false;
		}
		else if (e1.second == e2.second && e1.first >= e2.first)
		{
			return false;
		}
		else
		{
			return true;
		}
	}
};

struct secondFront
{
	bool operator()(const LCpair& e1, const LCpair& e2)
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

	std::priority_queue<LCpair, std::vector<LCpair>, firstFront> _qsell_int;
	//std::priority_queue<LCpair, std::vector<LCpair>, secondFront> _qsell_int;
	std::priority_queue<LCpair, std::vector<LCpair>, secondFront> _qsell_tra;

	//std::queue<std::pair<int, int>> _qsell_int;
	//std::queue<std::pair<int, int>> _qsell_tra;

	//std::queue<std::string> _sell_int;
	//std::queue<std::string> _sell_tra;

	std::vector<std::string> _sell_ans;
	std::vector<std::string> _leftover;
};
