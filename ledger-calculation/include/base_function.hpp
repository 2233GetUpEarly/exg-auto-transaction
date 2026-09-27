#pragma once

#include <string>

#include <common.hpp>

inline int round_off(double number)
{
	return number - static_cast<int>(number) >= 0.5 ? number + 1 : number;
}

inline int get_exg_int_cost(int integral)
{
	return round_off(integral * integral_charge_proportion);
}

inline int get_exg_tra_cost(int transaction_coins)
{
	return transaction_coins * transaction_coins_charge_proportion;
}

inline double get_exg_add_cost_proportion(int integral, int transaction_coins, int cost)
{
	return (1.0 * integral + cost) / transaction_coins;
}

inline double get_exg_proportion(int integral, int transaction_coins)
{
	return (1.0 * integral) / transaction_coins;
}

inline std::string proportion_to_string(double proportion)
{
	return std::to_string(round_off(proportion));
}

inline std::string sell_to_string(int argument1, int argument2, const char* str1, const char* str2, int cost, double proportion, double add_cost_proportion)
{
	std::string ans = std::to_string(argument1) + str1 + std::to_string(argument2) + str2;
	ans += std::to_string(cost) + " 积分 比例(1 : " + proportion_to_string(proportion) + ")";
	ans += " 成本比例(1 : " + proportion_to_string(add_cost_proportion) + ")";

	return std::move(ans);
}

inline std::string sell_int_to_string(int integral, int transaction_coins, int cost, double proportion, double add_cost_proportion)
{
	return sell_to_string(integral, transaction_coins, " 积分卖出获得 ", " 交易币，花费了 ", cost, proportion, add_cost_proportion);
}

inline std::string sell_tra_to_string(int integral, int transaction_coins, int cost, double proportion, double add_cost_proportion)
{
	return sell_to_string(transaction_coins, integral, " 交易币卖出获得 ", " 积分，花费了 ", cost, proportion, add_cost_proportion);
}

inline int get_sell_same_tra_different_int(double proportion, int transaction_coins)
{
	return proportion * transaction_coins;
}

inline std::string sell_string_add_profit(const std::string& source, int profit, const char* separate)
{
	return std::string(source + separate + (profit >= 0 ? "+" : "") + std::to_string(profit));
}

inline std::pair<std::string, std::string> collation_sell_unit(const std::string& sell_int_string, const std::string& sell_tra_string, int profit, const char* separate)
{
	return { sell_int_string, sell_string_add_profit(sell_tra_string, profit, separate) };
}


