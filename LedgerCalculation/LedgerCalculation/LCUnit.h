#pragma once

#include <string>
#include <cassert>
#include <iostream>

#include "BaseFunction.h"

enum SellType
{
	Nothing,
	SellInt,
	SellTra,
};

class LCUnit
{
private:

	void _sellIntegral(int integral, int transactionCoins)
	{
		_integral = integral;
		_transactionCoins = transactionCoins;
		_cost = getEXGIntCost(integral);
		_proportion = getEXGProportion(integral, transactionCoins);
		_addCostProportion = getEXGAddCostProportion(integral, transactionCoins, _cost);
		_stringInfo = sellInt_to_string(integral, transactionCoins, _cost, _proportion, _addCostProportion);
	}

	void _sellTransactionCoins(int integral, int transactionCoins)
	{
		_integral = integral;
		_transactionCoins = transactionCoins;
		_cost = getEXGTraCost(transactionCoins);
		_proportion = getEXGProportion(integral, transactionCoins);
		_addCostProportion = getEXGAddCostProportion(integral, transactionCoins, -_cost);
		_stringInfo = sellTra_to_string(integral, transactionCoins, _cost, _proportion, _addCostProportion);
	}

	static std::pair<bool, std::pair<LCUnit, int>> _solveSellTraExcess(LCUnit& sellInt, LCUnit& sellTra)
	{
		if (sellTra.getTransactionCoins() - sellInt.getTransactionCoins() < 10)		// 小于 10 交易币不执行
		{
			return { false, { LCUnit(), 0 } };
		}

		int newTransactionCoins = sellInt._transactionCoins;
		int newIntegral = getSellSameTraDifferentInt(sellTra._proportion, sellInt._transactionCoins);
		LCUnit newSellTra(newIntegral, newTransactionCoins, SellType::SellTra);

		std::pair<bool, int> info = _solveSellEqual(sellInt, newSellTra);
		newSellTra._sellType = SellType::SellTra;

		sellTra = LCUnit(sellTra._integral - newIntegral, sellTra._transactionCoins - newTransactionCoins, SellType::SellTra);

		return { info.first, { newSellTra, info.second } };
	}

	static std::pair<bool, std::pair<LCUnit, int>> _solveSellIntExcess(LCUnit& sellInt, LCUnit& sellTra)
	{
		if (sellInt._integral - sellTra._integral < 5000)		// 保持积分记录中的积分大于等于 5000
		{
			return { false, { LCUnit(), 0 } };
		}

		int newTransactionCoins = sellTra._transactionCoins;
		int newIntegral = getSellSameTraDifferentInt(sellInt._proportion, sellTra._transactionCoins);
		LCUnit newSellInt(newIntegral, newTransactionCoins, SellType::SellInt);

		std::pair<bool, int> info = _solveSellEqual(newSellInt, sellTra);
		newSellInt._sellType = SellType::SellInt;

		sellInt = LCUnit(sellInt._integral - newIntegral, sellInt._transactionCoins - newTransactionCoins, SellType::SellInt);

		return { info.first, { newSellInt, info.second } };
	}

	static std::pair<bool, int> _solveSellEqual(LCUnit& sellInt, LCUnit& sellTra)
	{
		if (sellInt._transactionCoins != sellTra._transactionCoins)
		{
			return { false, 0 };
		}

		// 获利 = 卖交易币得到的积分总数 - 卖交易币的手续费 - 卖的积分 - 卖积分成本
		int profit = sellTra._integral - sellTra._cost - sellInt._integral - sellInt._cost;

		sellInt._sellType = Nothing;
		sellTra._sellType = Nothing;

		return { true, profit };
	}

	LCUnit& operator+=(LCUnit& other)
	{
		return *this = LCUnit(_integral + other._integral, _transactionCoins + other._transactionCoins, _sellType);
	}

	LCUnit operator+(LCUnit& other)
	{
		return LCUnit(*this) += other;
	}

public:

	LCUnit() = default;

	LCUnit(int integral, int transactionCoins, SellType sellType)
		:_sellType(sellType)
	{
		if (_sellType == SellInt)
		{
			this->_sellIntegral(integral, transactionCoins);
		}
		else if (_sellType == SellTra)
		{
			this->_sellTransactionCoins(integral, transactionCoins);
		}
		else
		{
			std::cerr << "LCUnit failure" << std::endl;
			assert(false);
		}
	}

	static std::pair<bool, std::pair<LCUnit, int>> calIntProfit(LCUnit& sellInt, LCUnit& sellTra)
	{
		auto info1 = _solveSellIntExcess(sellInt, sellTra);
		if (info1.first == true)
		{
			return info1;
		}

		auto info2 = _solveSellTraExcess(sellInt, sellTra);
		if (info2.first == true)
		{
			return info2;
		}

		auto info3 = _solveSellEqual(sellInt, sellTra);
		if (info3.first == true)
		{
			return { info3.first, { LCUnit(), info3.second } };
		}

		return { false, { LCUnit(), 0 } };
	}

	static std::pair<bool, LCUnit> mergeSameProportionSellType(LCUnit& sell1, LCUnit& sell2)
	{
		if (sell1._sellType != sell2._sellType || sell1.compareProportionSame(sell2))
		{
			return { false, LCUnit() };
		}

		LCUnit temp = sell1 + sell2;
		sell1._sellType = Nothing;
		sell2._sellType = Nothing;

		return { true, temp };
	}

	bool compareProportionSame(LCUnit& other) const
	{
		return roundOff(_proportion) == roundOff(other._proportion);
	}

	SellType getSellType() const
	{
		return _sellType;
	}

	int getIntegral() const
	{
		return _integral;
	}

	int getTransactionCoins() const
	{
		return _transactionCoins;
	}

	const std::string& getStringInfo() const
	{
		return _stringInfo;
	}

	int getCost() const
	{
		return _cost;
	}

	double getProportion() const
	{
		return _proportion;
	}

	double getAddCostProportion() const
	{
		return _addCostProportion;
	}

private:

	SellType _sellType = Nothing;
	int _integral;				// 积分
	int _transactionCoins;		// 交易币
	std::string _stringInfo;	// 字符串信息
	int _cost;					// 花费的手续费积分
	double _proportion;			// 交易币 : 积分 的比例
	double _addCostProportion;	// 计入了成本的比例
};
