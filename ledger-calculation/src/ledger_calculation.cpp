#include <ledger_calculation.hpp>
#include <base_function.hpp>
#include <iostream>
#include <algorithm>

std::pair<int, int> string_solve_about_exg_format(std::string& str)
{
	std::pair<int, int> ans;

	size_t index = 0;

	if ('0' <= str[index] && str[index] <= '9')
	{
		ans.first = std::stoi(str.substr(index++));
	}
	else
	{
		return { -1, -1 };
	}

	while (index < str.size() && '0' <= str[index] && str[index] <= '9' && str[index] != '-')
	{
		++index;
	}

	if (index == str.size() || str[index] == '-')
	{
		//std::cout << "有字符串输入格式错误" << std::endl;
		ans.first = ans.second = -1;
		return ans;
	}

	while (index < str.size())
	{
		if ('0' <= str[index] && str[index] <= '9')
		{
			ans.second = std::stoi(str.substr(index));
			break;
		}

		++index;
	}

	return ans;
}

std::pair<int, int> LedgerCalculation::string_exg_format_solve(std::istream& input, std::string& str)
{
	if (str[0] != '[')
	{
		return { -1, -1 };
	}

	std::pair<int, int> ans;

	size_t index = 1;
	while (str[index] != ' ')
	{
		++index;
	}

	if (str[index + 1] < '0' || str[index + 1] > '9')		// 物品交易不处理
	{
		++set_no_solve_count();
		return { -1, -1 };
	}

	ans.first = std::stoi(str.substr(index + 1));

	std::getline(input, str);
	index = 0;

	while (str[index] < '0' || str[index] > '9')
	{
		++index;
	}

	ans.second = std::stoi(str.substr(index));

	std::getline(input, str);							// 处理回收的交易记录

	int num = str[str.size() - 1];

	if (num < '0' || num > '9')
	{
		special_solve(ans);
		return { -1, -1 };
	}

	return ans;
}

void LedgerCalculation::special_solve(std::pair<int, int>& ans)
{
	LCSpecial temp;
	if (ans.first >= 5000)
	{
		temp = LCSpecial(LCUnit(ans.first, ans.second, SellType::sell_int).get_cost());
	}
	else
	{
		temp = LCSpecial(LCUnit(ans.second, ans.first, SellType::sell_tra).get_cost());
	}
	this->specials_.push_back(std::move(temp));

	++set_solve_count();
}

std::pair<bool, LCSpecial> special_string_solve(const std::string& str)
{
	if (str.size() < 1 || str[0] != '-')
	{
		return { false, LCSpecial() };
	}

	return { true, LCSpecial(-std::stoi(str)) };
}

void LedgerCalculation::input(std::istream& input)
{
	std::string str;
	while (std::getline(input, str))
	{
		std::pair<int, int> ans = string_exg_format_solve(input, str);
		if (ans.first != -1 && ans.second != -1)
		{
			++set_solve_count();
			this->selection_sell_type(ans.first, ans.second);
			continue;
		}

		ans = string_solve_about_exg_format(str);
		if (ans.first != -1 && ans.second != -1)
		{
			++set_solve_count();
			this->selection_sell_type(ans.first, ans.second);
			continue;
		}

		auto special = special_string_solve(str);
		if (special.first == true)
		{
			++set_solve_count();
			this->specials_.push_back(std::move(special.second));
			continue;
		}
	}
}

void LedgerCalculation::show_sell_unit_string(std::ostream& output)
{
	sort(sell_unit_string_info_.begin(), sell_unit_string_info_.end(),
		[](std::pair<std::string, std::string>& e1, std::pair<std::string, std::string>& e2)
		{
			if (e1.second.size() < e2.second.size())
			{
				return true;
			}
			else
			{
				return false;
			}
		});

	for (int i = 0; i < this->sell_unit_string_info_.size(); ++i)
	{
		output << sell_unit_string_info_[i].first << std::endl;
		output << sell_unit_string_info_[i].second << std::endl;
		output << std::endl;
	}
}

void LedgerCalculation::show_special_string(std::ostream& output)
{
	for (int i = 0; i < this->special_string_info_.size(); ++i)
	{
		output << special_string_info_[i] << std::endl << std::endl;;
	}
}

void LedgerCalculation::show_other_string(std::ostream& output)
{
	for (int i = 0; i < this->excess_string_info_.size(); ++i)
	{
		output << excess_string_info_[i] << std::endl << std::endl;
	}
}

void LedgerCalculation::output(std::ostream& output)
{
	show_sell_unit_string(output);
	show_special_string(output);

	output << "总赚：" + std::to_string(sum_) + "积分" << std::endl;
	output << std::endl << "已处理交易次数：" << get_solve_count() << "次 未处理交易次数：" << get_no_solve_count() << "次 剩余交易记录未匹配：" << std::endl << std::endl;

	show_other_string(output);
}

void LedgerCalculation::output_lc_record(std::ostream& output_record)
{
	output_record << "已处理交易次数：" << get_solve_count()
		<< "次 未处理交易次数：" << get_no_solve_count()
		<< "次 剩余交易记录未匹配次数：" << excess_string_info_.size() << "\n\n";

	output_record << "总赚：" + std::to_string(sum_) + "积分\n\n";

	show_sell_unit_string(output_record);
	show_special_string(output_record);
}

void LedgerCalculation::output_lc_overflow(std::ostream& output_overflow)
{
	show_other_string(output_overflow);
}

void LedgerCalculation::input_overflow_record(std::istream& input_overflow)
{
	std::string str;
	while (std::getline(input_overflow, str))
	{
		std::pair<int, int> ans = string_exg_format_solve(input_overflow, str);
		if (ans.first != -1 && ans.second != -1)
		{
			++set_solve_count();
			this->selection_sell_type(ans.first, ans.second);
			continue;
		}

		ans = string_solve_about_exg_format(str);
		if (ans.first != -1 && ans.second != -1)
		{
			++set_solve_count();
			this->selection_sell_type(ans.first, ans.second);
			continue;
		}

		auto special = special_string_solve(str);
		if (special.first == true)
		{
			++set_solve_count();
			this->specials_.push_back(std::move(special.second));
			continue;
		}
	}
}

void LedgerCalculation::ledger_calculation()
{
	this->ledger_calculation_();
}

void LedgerCalculation::add_sell_integral(int integral, int transaction_coins)
{
	LCUnit temp(integral, transaction_coins, SellType::sell_int);
	this->sell_ints_.emplace(round_off(temp.get_proportion()), std::move(temp));
}

void LedgerCalculation::add_sell_transaction_coins(int integral, int transaction_coins)
{
	LCUnit temp(integral, transaction_coins, SellType::sell_tra);
	this->sell_tras_.emplace(round_off(temp.get_proportion()), std::move(temp));
}

void LedgerCalculation::selection_sell_type(int argument1, int argument2)
{
	if (argument1 >= 5000)
	{
		this->add_sell_integral(argument1, argument2);
	}
	else
	{
		this->add_sell_transaction_coins(argument2, argument1);
	}
}

static bool merging_same_proportion(std::multimap<int, LCUnit>& sell_same, SellType sell_type)
{
	bool have_merging = false;
	auto get_one = sell_same.begin();
	while (get_one != sell_same.end())
	{
		auto range = sell_same.equal_range(get_one->first);
		auto next_it = range.first;
		if (range.first == range.second || ++next_it == range.second)
		{
			++get_one;
			continue;
		}

		have_merging = true;
		int int_sum = 0;
		int tra_sum = 0;
		for (auto it = range.first; it != range.second; ++it)
		{
			int_sum += it->second.get_integral();
			tra_sum += it->second.get_transaction_coins();
		}

		int ratio = get_one->first;
		get_one = sell_same.erase(range.first, range.second);
		sell_same.emplace(ratio, LCUnit(int_sum, tra_sum, sell_type));
	}

	return have_merging;
}

static bool merging_same_proportion_of_sell_int(std::multimap<int, LCUnit>& sell_ints)
{
	return merging_same_proportion(sell_ints, SellType::sell_int);
}

static bool merging_same_proportion_of_sell_tra(std::multimap<int, LCUnit>& sell_tras)
{
	return merging_same_proportion(sell_tras, SellType::sell_tra);
}

bool LedgerCalculation::merging_same_proportion_sell_type()
{
	bool sell_int_merging = merging_same_proportion_of_sell_int(this->sell_ints_);
	bool sell_tra_merging = merging_same_proportion_of_sell_tra(this->sell_tras_);
	return sell_int_merging || sell_tra_merging;
}

bool LedgerCalculation::cal_int_profit()
{
	bool cal_int = false;

	auto get_int = sell_ints_.begin();
	while (get_int != sell_ints_.end())
	{
		auto get_tra = sell_tras_.begin();
		while (get_tra != sell_tras_.end() && get_int != sell_ints_.end())
		{
			std::pair<bool, std::pair<LCUnit, int>> ans = LCUnit::cal_int_profit(get_int->second, get_tra->second);
			if (ans.first == false)
			{
				++get_tra;
				continue;
			}

			cal_int = true;
			LCUnit sell_int_remnant;
			LCUnit sell_tra_remnant;

			LCUnit ans_info = ans.second.first;
			if (ans_info.get_sell_type() == nothing)		// get_tra 不用回到开始
			{
				sell_int_remnant = std::move(get_int->second);
				sell_tra_remnant = std::move(get_tra->second);

				get_int = sell_ints_.erase(get_int);
				get_tra = sell_tras_.erase(get_tra);
			}
			else if (ans_info.get_sell_type() == sell_int)	// 说明 get_int 还有剩余
			{
				sell_int_remnant = std::move(ans_info);
				sell_tra_remnant = std::move(get_tra->second);

				sell_tras_.erase(get_tra);
				get_tra = sell_tras_.begin();
			}
			else if (ans_info.get_sell_type() == sell_tra)	// 说明 get_tra 还有剩余
			{
				sell_int_remnant = std::move(get_int->second);
				sell_tra_remnant = std::move(ans_info);

				sell_ints_.erase(get_int);
				get_int = sell_ints_.begin();
			}
			else
			{
				assert(false);
			}

			std::pair<std::string, std::string> sell_unit = collation_sell_unit(
				sell_int_remnant.get_string_info(),
				sell_tra_remnant.get_string_info(),
				ans.second.second,
				"                   ");

			this->sell_unit_string_info_.emplace_back(std::move(sell_unit.first), std::move(sell_unit.second));

			this->sum_ += ans.second.second;
		}

		if (get_int != sell_ints_.end())
		{
			++get_int;
		}
	}

	return cal_int;
}

void LedgerCalculation::cal_special()
{
	auto it = specials_.begin();
	while (it != specials_.end())
	{
		this->sum_ -= it->get_cost();
		this->special_string_info_.push_back(std::move(const_cast<std::string&>(it->get_string_info())));
		it = specials_.erase(it);
	}
}

void LedgerCalculation::ledger_calculation_()
{
	this->merging_same_proportion_sell_type();

	while (this->cal_int_profit() == true)
	{
		this->merging_same_proportion_sell_type();
	}

	this->shift_excess_sell_info();
	this->cal_special();
}

static void shift_excess_sell(std::multimap<int, LCUnit>& sell_info, std::vector<std::string>& arr)
{
	auto it = sell_info.begin();
	while (it != sell_info.end())
	{
		arr.push_back(std::move(const_cast<std::string&>(it->second.get_string_info())));
		it = sell_info.erase(it);
	}
}

void LedgerCalculation::shift_excess_sell_info()
{
	shift_excess_sell(sell_ints_, excess_string_info_);
	shift_excess_sell(sell_tras_, excess_string_info_);
}
