#pragma once

#include <common.hpp>
#include <lc_unit.hpp>
#include <lc_special.hpp>

#include <vector>
#include <string>
#include <map>

class LedgerCalculation
{
private:

	void add_sell_integral(int integral, int transaction_coins);

	void add_sell_transaction_coins(int integral, int transaction_coins);

	void selection_sell_type(int argument1, int argument2);

	bool merging_same_proportion_sell_type();

	bool cal_int_profit();

	void cal_special();

	void ledger_calculation_();

	void shift_excess_sell_info();

	size_t& set_solve_count()
	{
		return solve_count_;
	}

	size_t& set_no_solve_count()
	{
		return no_solve_count_;
	}

	size_t get_solve_count() const
	{
		return solve_count_;
	}
	
	size_t get_no_solve_count() const
	{
		return no_solve_count_;
	}

	void show_sell_unit_string(std::ostream&);

	void show_special_string(std::ostream&);
	
	void show_other_string(std::ostream&);

	std::pair<int, int> string_exg_format_solve(std::istream&, std::string&);

	void special_solve(std::pair<int, int>&);

public:

	void input(std::istream& input);

	void output(std::ostream& output);

	void output_lc_record(std::ostream& output_record);

	void output_lc_overflow(std::ostream& output_overflow);

	void input_overflow_record(std::istream& input_overflow);

	void ledger_calculation();

private:

	std::multimap<int, LCUnit> sell_ints_;
	std::multimap<int, LCUnit> sell_tras_;

	std::vector<LCSpecial> specials_;

	std::vector<std::pair<std::string, std::string>> sell_unit_string_info_;
	std::vector<std::string> special_string_info_;
	std::vector<std::string> excess_string_info_;

	size_t solve_count_ = 0;
	size_t no_solve_count_ = 0;
	int sum_ = 0;
};
