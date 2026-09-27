#pragma once

#include <string>
#include <cassert>
#include <iostream>

#include <base_function.hpp>

enum SellType
{
	nothing,
	sell_int,
	sell_tra,
};

class LCUnit
{
private:

	void sell_integral_(int integral, int transaction_coins)
	{
		integral_ = integral;
		transaction_coins_ = transaction_coins;
		cost_ = get_exg_int_cost(integral);
		proportion_ = get_exg_proportion(integral, transaction_coins);
		add_cost_proportion_ = get_exg_add_cost_proportion(integral, transaction_coins, cost_);
		string_info_ = sell_int_to_string(integral, transaction_coins, cost_, proportion_, add_cost_proportion_);
	}

	void sell_transaction_coins_(int integral, int transaction_coins)
	{
		integral_ = integral;
		transaction_coins_ = transaction_coins;
		cost_ = get_exg_tra_cost(transaction_coins);
		proportion_ = get_exg_proportion(integral, transaction_coins);
		add_cost_proportion_ = get_exg_add_cost_proportion(integral, transaction_coins, -cost_);
		string_info_ = sell_tra_to_string(integral, transaction_coins, cost_, proportion_, add_cost_proportion_);
	}

	static std::pair<bool, std::pair<LCUnit, int>> solve_sell_tra_excess_(LCUnit& sell_int, LCUnit& sell_tra)
	{
		if (sell_tra.get_transaction_coins() - sell_int.get_transaction_coins() < 10)		// 小于 10 交易币不执行
		{
			return { false, { LCUnit(), 0 } };
		}

		int new_transaction_coins = sell_int.transaction_coins_;
		int new_integral = get_sell_same_tra_different_int(sell_tra.proportion_, sell_int.transaction_coins_);
		LCUnit new_sell_tra(new_integral, new_transaction_coins, SellType::sell_tra);

		std::pair<bool, int> info = solve_sell_equal_(sell_int, new_sell_tra);
		new_sell_tra.sell_type_ = SellType::sell_tra;

		sell_tra = LCUnit(sell_tra.integral_ - new_integral, sell_tra.transaction_coins_ - new_transaction_coins, SellType::sell_tra);

		return { info.first, { new_sell_tra, info.second } };
	}

	static std::pair<bool, std::pair<LCUnit, int>> solve_sell_int_excess_(LCUnit& sell_int, LCUnit& sell_tra)
	{
		if (sell_int.integral_ - sell_tra.integral_ < 5000)		// 保持积分记录中的积分大于等于 5000
		{
			return { false, { LCUnit(), 0 } };
		}

		int new_transaction_coins = sell_tra.transaction_coins_;
		int new_integral = get_sell_same_tra_different_int(sell_int.proportion_, sell_tra.transaction_coins_);
		LCUnit new_sell_int(new_integral, new_transaction_coins, SellType::sell_int);

		std::pair<bool, int> info = solve_sell_equal_(new_sell_int, sell_tra);
		new_sell_int.sell_type_ = SellType::sell_int;

		sell_int = LCUnit(sell_int.integral_ - new_integral, sell_int.transaction_coins_ - new_transaction_coins, SellType::sell_int);

		return { info.first, { new_sell_int, info.second } };
	}

	static std::pair<bool, int> solve_sell_equal_(LCUnit& sell_int, LCUnit& sell_tra)
	{
		if (sell_int.transaction_coins_ != sell_tra.transaction_coins_)
		{
			return { false, 0 };
		}

		// 获利 = 卖交易币得到的积分总数 - 卖交易币的手续费 - 卖的积分 - 卖积分成本
		int profit = sell_tra.integral_ - sell_tra.cost_ - sell_int.integral_ - sell_int.cost_;

		sell_int.sell_type_ = nothing;
		sell_tra.sell_type_ = nothing;

		return { true, profit };
	}

	LCUnit& operator+=(LCUnit& other)
	{
		return *this = LCUnit(integral_ + other.integral_, transaction_coins_ + other.transaction_coins_, sell_type_);
	}

	LCUnit operator+(LCUnit& other)
	{
		return LCUnit(*this) += other;
	}

public:

	LCUnit() = default;

	LCUnit(int integral, int transaction_coins, SellType sell_type)
		:sell_type_(sell_type)
	{
		if (sell_type_ == sell_int)
		{
			this->sell_integral_(integral, transaction_coins);
		}
		else if (sell_type_ == sell_tra)
		{
			this->sell_transaction_coins_(integral, transaction_coins);
		}
		else
		{
			std::cerr << "LCUnit failure" << std::endl;
			assert(false);
		}
	}

	static std::pair<bool, std::pair<LCUnit, int>> cal_int_profit(LCUnit& sell_int, LCUnit& sell_tra)
	{
		auto info1 = solve_sell_int_excess_(sell_int, sell_tra);
		if (info1.first == true)
		{
			return info1;
		}

		auto info2 = solve_sell_tra_excess_(sell_int, sell_tra);
		if (info2.first == true)
		{
			return info2;
		}

		auto info3 = solve_sell_equal_(sell_int, sell_tra);
		if (info3.first == true)
		{
			return { info3.first, { LCUnit(), info3.second } };
		}

		return { false, { LCUnit(), 0 } };
	}

	static std::pair<bool, LCUnit> merge_same_proportion_sell_type(LCUnit& sell1, LCUnit& sell2)
	{
		if (sell1.sell_type_ != sell2.sell_type_ || sell1.compare_proportion_same(sell2))
		{
			return { false, LCUnit() };
		}

		LCUnit temp = sell1 + sell2;
		sell1.sell_type_ = nothing;
		sell2.sell_type_ = nothing;

		return { true, temp };
	}

	bool compare_proportion_same(LCUnit& other) const
	{
		return round_off(proportion_) == round_off(other.proportion_);
	}

	SellType get_sell_type() const
	{
		return sell_type_;
	}

	int get_integral() const
	{
		return integral_;
	}

	int get_transaction_coins() const
	{
		return transaction_coins_;
	}

	const std::string& get_string_info() const
	{
		return string_info_;
	}

	int get_cost() const
	{
		return cost_;
	}

	double get_proportion() const
	{
		return proportion_;
	}

	double get_add_cost_proportion() const
	{
		return add_cost_proportion_;
	}

private:

	SellType sell_type_ = nothing;
	int integral_;				// 积分
	int transaction_coins_;		// 交易币
	std::string string_info_;	// 字符串信息
	int cost_;					// 花费的手续费积分
	double proportion_;			// 交易币 : 积分 的比例
	double add_cost_proportion_;	// 计入了成本的比例
};
