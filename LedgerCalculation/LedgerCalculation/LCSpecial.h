#pragma once

#include <string>

class LCSpecial
{
private:

	void createStringInfo()
	{
		_stringInfo = "-" + std::to_string(_cost) + " »ý·Ö";
	}

public:

	LCSpecial() = default;

	LCSpecial(int cost)
		:_cost(cost)
	{
		createStringInfo();
	}

	int getCost() const
	{
		return _cost;
	}

	const std::string& getStringInfo() const
	{
		return _stringInfo;
	}

private:

	int _cost;
	std::string _stringInfo;
};
