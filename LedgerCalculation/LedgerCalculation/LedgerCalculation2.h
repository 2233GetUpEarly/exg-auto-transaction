#pragma once

#include "Common.h"
#include "LCUnit.h"
#include "LCSpecial.h"

#include <vector>
#include <string>
#include <map>

class LedgerCalculation2
{
private:

	void addSellIntegral(int integral, int transactionCoins);

	void addSellTransactionCoins(int integral, int transactionCoins);

	void selectionSellType(int argument1, int argument2);

	bool mergingSameProportionSellType();

	bool calIntProfit();

	void calSpecial();

	void ledgerCalculation();

	void shiftExcessSellInfo();

	size_t& setSolveCount()
	{
		return _solveCount;
	}

	size_t& setNoSolveCount()
	{
		return _noSolveCount;
	}

	size_t getSolveCount() const
	{
		return _solveCount;
	}
	
	size_t getNoSolveCount() const
	{
		return _noSolveCount;
	}

	void showSellUnitString(std::ostream&);

	void showSpecialString(std::ostream&);
	
	void showOtherString(std::ostream&);

	std::pair<int, int> stringEXG_FormatSolve(std::istream&, std::string&);

	void SpecialSolve(std::pair<int, int>&);

public:

	void input(std::istream& input);

	void output(std::ostream& output);

private:

	std::multimap<int, LCUnit> _sellInts;
	std::multimap<int, LCUnit> _sellTras;

	std::vector<LCSpecial> _specials;

	std::vector<std::pair<std::string, std::string>> _sellUnitStringInfo;
	std::vector<std::string> _specialStringInfo;
	std::vector<std::string> _excessStringInfo;

	size_t _solveCount = 0;
	size_t _noSolveCount = 0;
	int _sum = 0;
};
