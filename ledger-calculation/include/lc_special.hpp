#pragma once

#include <string>

class LCSpecial
{
private:

	void create_string_info()
	{
		string_info_ = "-" + std::to_string(cost_) + " 积分";
	}

public:

	LCSpecial() = default;

	LCSpecial(int cost)
		:cost_(cost)
	{
		create_string_info();
	}

	int get_cost() const
	{
		return cost_;
	}

	const std::string& get_string_info() const
	{
		return string_info_;
	}

private:

	int cost_;
	std::string string_info_;
};
