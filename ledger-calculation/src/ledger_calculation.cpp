#include <ledger_calculation.hpp>
#include <base_function.hpp>
#include <iostream>
#include <algorithm>

std::pair<int, int> stringSolveAboutEXG_Format(std::string& str)
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

std::pair<int, int> LedgerCalculation::stringEXG_FormatSolve(std::istream& input, std::string& str)
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
		++setNoSolveCount();
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
		SpecialSolve(ans);
		return { -1, -1 };
	}

	return ans;
}

void LedgerCalculation::SpecialSolve(std::pair<int, int>& ans)
{
	LCSpecial temp;
	if (ans.first >= 5000)
	{
		temp = LCSpecial(LCUnit(ans.first, ans.second, SellType::SellInt).getCost());
	}
	else
	{
		temp = LCSpecial(LCUnit(ans.second, ans.first, SellType::SellTra).getCost());
	}
	this->_specials.push_back(std::move(temp));

	++setSolveCount();
}

std::pair<bool, LCSpecial> specialStringSolve(const std::string& str)
{
	if (str.size() < 1 || str[0] != '-')
	{
		return { false, LCSpecial()};
	}

	return { true, LCSpecial(-std::stoi(str)) };
}

void LedgerCalculation::input(std::istream& input)
{
	std::string str;
	while (std::getline(input, str))
	{
		std::pair<int, int> ans = stringEXG_FormatSolve(input, str);
		if (ans.first != -1 && ans.second != -1)
		{
			++setSolveCount();
			this->selectionSellType(ans.first, ans.second);
			continue;
		}

		ans = stringSolveAboutEXG_Format(str);
		if (ans.first != -1 && ans.second != -1)
		{
			++setSolveCount();
			this->selectionSellType(ans.first, ans.second);
			continue;
		}

		auto special = specialStringSolve(str);
		if (special.first == true)
		{
			++setSolveCount();
			this->_specials.push_back(std::move(special.second));
			continue;
		}
	}

	this->ledgerCalculation();
}

void LedgerCalculation::showSellUnitString(std::ostream& output)
{
	sort(_sellUnitStringInfo.begin(), _sellUnitStringInfo.end(),
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

	for (int i = 0; i < this->_sellUnitStringInfo.size(); ++i)
	{
		output << _sellUnitStringInfo[i].first << std::endl;
		output << _sellUnitStringInfo[i].second << std::endl;
		output << std::endl;
	}
}

void LedgerCalculation::showSpecialString(std::ostream& output)
{
	for (int i = 0; i < this->_specialStringInfo.size(); ++i)
	{
		output << _specialStringInfo[i] << std::endl << std::endl;;
	}
}

void LedgerCalculation::showOtherString(std::ostream& output)
{
	for (int i = 0; i < this->_excessStringInfo.size(); ++i)
	{
		output << _excessStringInfo[i] << std::endl << std::endl;
	}
}

void LedgerCalculation::output(std::ostream& output)
{
	showSellUnitString(output);
	showSpecialString(output);

	output << "总赚：" + std::to_string(_sum) + "积分" << std::endl;
	output << std::endl << "已处理交易次数：" << getSolveCount() << "次 未处理交易次数：" << getNoSolveCount() << "次 " << "剩余交易记录未匹配：" << std::endl << std::endl;

	showOtherString(output);
}

void LedgerCalculation::addSellIntegral(int integral, int transactionCoins)
{
	LCUnit temp(integral, transactionCoins, SellType::SellInt);
	this->_sellInts.emplace(roundOff(temp.getProportion()), std::move(temp));
}

void LedgerCalculation::addSellTransactionCoins(int integral, int transactionCoins)
{
	LCUnit temp(integral, transactionCoins, SellType::SellTra);
	this->_sellTras.emplace(roundOff(temp.getProportion()), std::move(temp));
}

void LedgerCalculation::selectionSellType(int argument1, int argument2)
{
	if (argument1 >= 5000)
	{
		this->addSellIntegral(argument1, argument2);
	}
	else
	{
		this->addSellTransactionCoins(argument2, argument1);
	}
}

static bool mergingSameProportion(std::multimap<int, LCUnit>& sellSame, SellType sellType)
{
	bool haveMerging = false;
	auto getOne = sellSame.begin();
	while (getOne != sellSame.end())
	{
		auto range = sellSame.equal_range(getOne->first);
		auto nextIt = range.first;
		if (range.first == range.second || ++nextIt == range.second)
		{
			++getOne;
			continue;
		}

		haveMerging = true;
		int intSum = 0;
		int traSum = 0;
		for (auto it = range.first; it != range.second; ++it)
		{
			intSum += it->second.getIntegral();
			traSum += it->second.getTransactionCoins();
		}

		int ratio = getOne->first;
		getOne = sellSame.erase(range.first, range.second);
		sellSame.emplace(ratio, LCUnit(intSum, traSum, sellType));
	}

	return haveMerging;
}

static bool mergingSameProportionOfSellInt(std::multimap<int, LCUnit>& sellInts)
{
	return mergingSameProportion(sellInts, SellType::SellInt);
}

static bool mergingSameProportionOfSellTra(std::multimap<int, LCUnit>& sellTras)
{
	return mergingSameProportion(sellTras, SellType::SellTra);
}

bool LedgerCalculation::mergingSameProportionSellType()
{
	bool sellIntMerging = mergingSameProportionOfSellInt(this->_sellInts);
	bool sellTraMerging = mergingSameProportionOfSellTra(this->_sellTras);
	return sellIntMerging || sellTraMerging;
}

bool LedgerCalculation::calIntProfit()
{
	bool calInt = false;

	auto getInt = _sellInts.begin();
	while (getInt != _sellInts.end())
	{
		auto getTra = _sellTras.begin();
		while (getTra != _sellTras.end() && getInt != _sellInts.end())
		{
			std::pair<bool, std::pair<LCUnit, int>> ans = LCUnit::calIntProfit(getInt->second, getTra->second);
			if (ans.first == false)
			{
				++getTra;
				continue;
			}

			calInt = true;
			LCUnit sellIntRemnant;
			LCUnit sellTraRemnant;

			LCUnit ansInfo = ans.second.first;
			if (ansInfo.getSellType() == Nothing)		// getTra 不用回到开始
			{
				sellIntRemnant = std::move(getInt->second);
				sellTraRemnant = std::move(getTra->second);

				getInt = _sellInts.erase(getInt);
				getTra = _sellTras.erase(getTra);
			}
			else if (ansInfo.getSellType() == SellInt)	// 说明 getInt 还有剩余
			{
				sellIntRemnant = std::move(ansInfo);
				sellTraRemnant = std::move(getTra->second);

				_sellTras.erase(getTra);
				getTra = _sellTras.begin();
			}
			else if (ansInfo.getSellType() == SellTra)	// 说明 getTra 还有剩余
			{
				sellIntRemnant = std::move(getInt->second);
				sellTraRemnant = std::move(ansInfo);

				_sellInts.erase(getInt);
				getInt = _sellInts.begin();
			}
			else
			{
				assert(false);
			}

			std::pair<std::string, std::string> sellUnit = collationSellUnit(
				sellIntRemnant.getStringInfo(),
				sellTraRemnant.getStringInfo(),
				ans.second.second,
				"                   ");

			this->_sellUnitStringInfo.emplace_back(std::move(sellUnit.first), std::move(sellUnit.second));

			this->_sum += ans.second.second;
		}

		if (getInt != _sellInts.end())
		{
			++getInt;
		}
	}

	return calInt;
}

void LedgerCalculation::calSpecial()
{
	auto it = _specials.begin();
	while (it != _specials.end())
	{
		this->_sum -= it->getCost();
		this->_specialStringInfo.push_back(std::move(const_cast<std::string&>(it->getStringInfo())));
		it = _specials.erase(it);
	}
}

void LedgerCalculation::ledgerCalculation()
{
	this->mergingSameProportionSellType();

	while (this->calIntProfit() == true)
	{
		this->mergingSameProportionSellType();
	}

	this->shiftExcessSellInfo();
	this->calSpecial();
}

static void shiftExcessSell(std::multimap<int, LCUnit>& sellInfo, std::vector<std::string>& arr)
{
	auto it = sellInfo.begin();
	while (it != sellInfo.end())
	{
		arr.push_back(std::move(const_cast<std::string&>(it->second.getStringInfo())));
		it = sellInfo.erase(it);
	}
}

void LedgerCalculation::shiftExcessSellInfo()
{
	shiftExcessSell(_sellInts, _excessStringInfo);
	shiftExcessSell(_sellTras, _excessStringInfo);
}
