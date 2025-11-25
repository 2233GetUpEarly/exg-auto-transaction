#pragma once

#include <string>

#include "Common.h"

inline int roundOff(double number)
{
	return number - static_cast<int>(number) >= 0.5 ? number + 1 : number;
}

inline int getEXGIntCost(int integral)
{
	return roundOff(integral * IntegralChargeProportion);
}

inline int getEXGTraCost(int transactionCoins)
{
	return transactionCoins * transactionCoinsChargeProportion;
}

inline double getEXGAddCostProportion(int integral, int transactionCoins, int cost)
{
	return (1.0 * integral + cost) / transactionCoins;
}

inline double getEXGProportion(int integral, int transactionCoins)
{
	return (1.0 * integral) / transactionCoins;
}

inline std::string proportion_to_string(double proportion)
{
	return std::to_string(roundOff(proportion));
}

inline std::string sell_to_string(int argument1, int argument2, const char* str1, const char* str2, int cost, double proportion, double addCostProportion)
{
	std::string ans = std::to_string(argument1) + str1 + std::to_string(argument2) + str2;
	ans += std::to_string(cost) + " 积分 比例(1 : " + proportion_to_string(proportion) + ")";
	ans += " 成本比例(1 : " + proportion_to_string(addCostProportion) + ")";

	return std::move(ans);
}

inline std::string sellInt_to_string(int integral, int transactionCoins, int cost, double proportion, double addCostProportion)
{
	return sell_to_string(integral, transactionCoins, " 积分卖出获得 ", " 交易币，花费了 ", cost, proportion, addCostProportion);
}

inline std::string sellTra_to_string(int integral, int transactionCoins, int cost, double proportion, double addCostProportion)
{
	return sell_to_string(transactionCoins, integral, " 交易币卖出获得 ", " 积分，花费了 ", cost, proportion, addCostProportion);
}

inline int getSellSameTraDifferentInt(double proportion, int transactionCoins)
{
	return proportion * transactionCoins;
}

inline std::string sellStringAddProfit(const std::string& source, int profit, const char* separate)
{
	return std::string(source + separate + (profit >= 0 ? "+" : "") + std::to_string(profit));
}

inline std::pair<std::string, std::string> collationSellUnit(const std::string& sellIntString, const std::string& sellTraString, int profit, const char* separate)
{
	return { sellIntString, sellStringAddProfit(sellTraString, profit, separate) };
}


