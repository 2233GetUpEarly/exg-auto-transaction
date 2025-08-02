#include "LedgerCalculation.h"

static std::pair<int, int> consoleStringSolve(std::string& str)
{
	std::pair<int, int> ans;

	size_t index = 0;
	while (index < str.size())
	{
		if ('0' <= str[index] && str[index] <= '9')
		{
			ans.first = std::stoi(str.substr(index));
			break;
		}

		++index;
	}

	while (index < str.size() && '0' <= str[index] && str[index] <= '9')
	{
		++index;
	}

	if (index == str.size())
	{
		std::cout << "有字符串输入格式错误" << std::endl;
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

std::pair<int, int> LedgerCalculation::consoleStringEXG_FormatSolve(std::string& str)
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
		++getNoSolveCount();
		return { -1, -1 };
	}

	ans.first = std::stoi(str.substr(index + 1));

	std::getline(std::cin, str);
	index = 0;

	while (str[index] < '0' || str[index] > '9')
	{
		++index;
	}

	ans.second = std::stoi(str.substr(index));

	std::getline(std::cin, str);							// 处理回收的交易记录

	int num = str[str.size() - 1];

	if (num < '0' || num > '9')
	{
		reclaimSolve(ans);
		return { -1, -1 };
	}

	return ans;
}

static std::pair<int, int> consoleStringSolveAboutEXG_Format(std::string& str)
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

size_t& LedgerCalculation::getSolveCount()
{
	return _solveCount;
}

size_t& LedgerCalculation::getNoSolveCount()
{
	return _noSolveCount;
}

void LedgerCalculation::reclaimSolve(std::pair<int, int>& ans)
{
	int cost = 0;
	if (ans.first >= 5000)
	{
		cost = ans.first / 20;
		_qspecial_int.push(-cost);
	}
	else
	{
		cost = ans.first * 10;
		_qspecial_int.push(-cost);
	}

	std::string word = std::to_string(-cost);
	word += " 积分";
	_special_int.push(word);
	++getSolveCount();
}

bool LedgerCalculation::specialStringSolve(const std::string& str)
{
	if (str.size() < 1 || str[0] != '-')
	{
		return false;
	}

	int ans = std::stoi(str);
	_qspecial_int.push(ans);

	std::string word = std::to_string(ans);
	word += " 积分";
	_special_int.push(word);

	++getSolveCount();
	
	return true;
}

void LedgerCalculation::consoleComprehensiveFormatMatching()
{
	LedgerCalculation cal;
	std::string str;
	std::cout << "请输入 EXG 网页字符串格式或者" << std::endl;
	std::cout << "输入字符串且保证格式:> \"数字 ... 数字 ... (只读取前两个数字)\"" << std::endl;
	while (std::getline(std::cin, str))
	{
		std::pair<int, int> ans = cal.consoleStringEXG_FormatSolve(str);
		if (ans.first != -1 && ans.second != -1)
		{
			cal.getInfo(ans.first, ans.second);
			++cal.getSolveCount();
			continue;
		}

		ans = consoleStringSolveAboutEXG_Format(str);
		if (ans.first != -1 && ans.second != -1)
		{
			cal.getInfo(ans.first, ans.second);
			++cal.getSolveCount();
			continue;
		}

		if (cal.specialStringSolve(str) == true)
		{
			continue;
		}
	}
	cal.calculate();
	cal.checkAns();
	cal.showCalculateResult();
	cal.showSpecialResult();
	std::cout << std::endl << "已处理交易次数：" << cal.getSolveCount() << "次 未处理交易次数：" << cal.getNoSolveCount() << "次 " << "剩余交易记录未匹配：" << std::endl << std::endl;
	cal.showOtherResult();
}

void LedgerCalculation::consoleStringInputForEXG_Format()
{
	LedgerCalculation cal;
	std::string str;
	std::cout << "请输入 EXG 网页字符串格式：" << std::endl;
	while (std::getline(std::cin, str))
	{
		std::pair<int, int> ans = cal.consoleStringEXG_FormatSolve(str);
		if (ans.first == ans.second && ans.first == -1)
		{
			continue;
		}
		cal.getInfo(ans.first, ans.second);
	}
	cal.calculate();
	cal.showCalculateResult();
	std::cout << std::endl << "剩余交易记录未匹配：" << std::endl << std::endl;
	cal.showOtherResult();
}

void LedgerCalculation::consoleStringInput()
{
	LedgerCalculation cal;
	std::string str;
	std::cout << "请输入字符串且保证格式:> \"数字 ... 数字 ... (只读取前两个数字)\"" << std::endl;
	while (std::getline(std::cin, str))
	{
		std::pair<int, int> ans = consoleStringSolve(str);
		if (ans.first == ans.second && ans.first == -1)
		{
			continue;
		}
		cal.getInfo(ans.first, ans.second);
	}
	cal.calculate();
	cal.showCalculateResult();
	std::cout << std::endl << "剩余交易记录未匹配：" << std::endl << std::endl;
	cal.showOtherResult();
}

void LedgerCalculation::consoleNumberInput()
{
	LedgerCalculation cal;
	int one = 0;
	int two = 0;
	std::cout << "请输入价格: 数字 数字" << std::endl;
	while (std::cin >> one >> two)
	{
		cal.getInfo(one, two);
	}
	cal.calculate();
	cal.showCalculateResult();
	std::cout << std::endl << "剩余交易记录未匹配：" << std::endl << std::endl;
	cal.showOtherResult();
}

bool LedgerCalculation::getInfo(int one, int two)
{
	if (one >= 5000)
	{
		this->sellIntegral(one, two);
	}
	else
	{
		this->sellTransactionCoins(two, one);
	}
	return true;
}

void LedgerCalculation::sellIntegral(int integral, int transactionCoins)
{
	// 8201 买10交易币花费 410 比例(1 : 861.1)
	int cost = integral / 20;
	double proportion = (integral + cost * 1.0) / transactionCoins;

	std::string ans = std::to_string(integral);

	ans += " 积分卖出获得 ";
	ans += std::to_string(transactionCoins);
	ans += " 交易币，花费了 ";
	ans += std::to_string(cost);
	ans += " 积分 比例(1 : ";

	std::string proportionStr = std::to_string(proportion);
	size_t index = proportionStr.find('.');
	ans += proportionStr.substr(0, index + 2);

	ans += ")";

	_qsell_int.push({ integral, transactionCoins, ans, cost});
	//_sell_int.push(ans);
}

void LedgerCalculation::sellTransactionCoins(int integral, int transactionCoins)
{
	// 10 交易币买 8899 花费 100 比例(1 : 879.9)
	int cost = transactionCoins * 10;
	double proportion = (integral - cost * 1.0) / transactionCoins;

	std::string ans = std::to_string(transactionCoins);

	ans += " 交易币卖出获得 ";
	ans += std::to_string(integral);
	ans += " 积分，花费了 ";
	ans += std::to_string(cost);
	ans += " 积分 比例(1 : ";

	//ans += std::to_string(proportion);
	std::string proportionStr = std::to_string(proportion);
	size_t index = proportionStr.find('.');
	ans += proportionStr.substr(0, index + 2);

	ans += ")";

	_qsell_tra.push({ integral, transactionCoins, ans, -cost });
	//_sell_tra.push(ans);
}

void LedgerCalculation::calculate()
{
	while (_qsell_int.size() && _qsell_tra.size())				// 交易币匹配计算
	{
		LCpair sell_tra_info = _qsell_tra.top();
		_qsell_tra.pop();

		LCpair sell_int_info = _qsell_int.top();
		_qsell_int.pop();
		if (sell_tra_info.second != sell_int_info.second)
		{
			_leftover.push_back(sell_int_info.third);

			_leftover.push_back(sell_tra_info.third);
			
			continue;
		}

		int profit = (sell_tra_info.first + sell_tra_info.four) - (sell_int_info.first + sell_int_info.four);


		_sell_ans.push_back(sell_int_info.third);

		std::string sell_tra = sell_tra_info.third;

		sell_tra += "           ";
		sell_tra += (profit >= 0 ? "+" : "");
		sell_tra += std::to_string(profit);
		_sum += profit;

		_sell_ans.push_back(sell_tra);
	}

	// 处理扣积分的特殊场景
	while (_qspecial_int.size())
	{
		_sum += _qspecial_int.front();
		_qspecial_int.pop();

		_special_ans.push_back(_special_int.front());
		_special_int.pop();
	}

	while (_qsell_int.size() || _qsell_tra.size())			// 剩余未匹配记录
	{
		std::string other;

		if (_qsell_int.size())
		{
			other = _qsell_int.top().third;
			_qsell_int.pop();
		}
		else
		{
			other = _qsell_tra.top().third;
			_qsell_tra.pop();
		}

		_leftover.push_back(other);
	}
}

void LedgerCalculation::showSpecialResult()
{
	for (int i = 0; i < _special_ans.size(); ++i)
	{
		std::cout << _special_ans[i] << std::endl;
		if (i != _special_ans.size() - 1)
		{
			std::cout << std::endl;
		}
	}
	std::cout << std::endl << "总赚：" + std::to_string(_sum) + "积分" << std::endl;
}

void LedgerCalculation::showCalculateResult()
{
	for (int i = 0; i < _sell_ans.size(); ++i)
	{
		std::cout << _sell_ans[i] << std::endl;
		if (i % 2 == 1)
		{
			std::cout << std::endl;
		}
	}
}

void LedgerCalculation::showOtherResult()
{
	for (int i = 0; i < _leftover.size(); ++i)
	{
		std::cout << _leftover[i] << std::endl << std::endl;
	}
}

void LedgerCalculation::checkAns()
{
	std::string str;
	for (auto& str : _leftover)
	{
		std::pair<int, int> ans = consoleStringSolve(str);
		if (ans.first == ans.second && ans.first == -1)
		{
			continue;
		}
		this->getInfo(ans.first, ans.second);
	}
	calculationAndMerging();
}

LCpair sell_int_to_LCpair(int integral, int transactionCoins)
{
	int cost = integral / 20;
	double proportion = (integral + cost * 1.0) / transactionCoins;

	std::string ans = std::to_string(integral);

	ans += " 积分卖出获得 ";
	ans += std::to_string(transactionCoins);
	ans += " 交易币，花费了 ";
	ans += std::to_string(cost);
	ans += " 积分 比例(1 : ";

	//ans += std::to_string(proportion);
	std::string proportionStr = std::to_string(proportion);
	size_t index = proportionStr.find('.');
	ans += proportionStr.substr(0, index + 2);

	ans += ")";

	return { integral, transactionCoins, ans, cost };
}

LCpair sell_tra_to_LCpair(int integral, int transactionCoins)
{
	int cost = transactionCoins * 10;
	double proportion = (integral - cost * 1.0) / transactionCoins;

	std::string ans = std::to_string(transactionCoins);

	ans += " 交易币卖出获得 ";
	ans += std::to_string(integral);
	ans += " 积分，花费了 ";
	ans += std::to_string(cost);
	ans += " 积分 比例(1 : ";

	//ans += std::to_string(proportion);
	std::string proportionStr = std::to_string(proportion);
	size_t index = proportionStr.find('.');
	ans += proportionStr.substr(0, index + 2);

	ans += ")";

	return { integral, transactionCoins, ans, -cost };
}

class LCpair_compare_tra
{
public:
	bool operator()(const std::pair<int, int>& e1, const std::pair<int, int>& e2) const
	{
		if (e1.first < e2.first)
		{
			return true;
		}
		else
		{
			return false;
		}
	}
};

class LCpair_compare_ratio
{
public:
	bool operator()(const std::pair<int, int>& e1, const std::pair<int, int>& e2) const
	{
		if (e1.first < e2.first)
		{
			return true;
		}
		else if (e1.first == e2.first && e1.second < e2.second)
		{
			return true;
		}
		else
		{
			return false;
		}
	}
};

void LedgerCalculation::calculationAndMerging()
{
	std::multimap<std::pair<int, int>, LCpair, LCpair_compare_tra> qsell_int1;	// pair<int, int> 指的是 <交易币, 积分>
	std::multimap<std::pair<int, int>, LCpair, LCpair_compare_tra> qsell_tra1;	// 让相同交易币记录可以连续访问

	while (this->_qsell_int.size())
	{
		LCpair temp = _qsell_int.top();
		_qsell_int.pop();
		qsell_int1.insert({ { temp.second, temp.first }, temp });
	}

	while (this->_qsell_tra.size())
	{
		LCpair temp = _qsell_tra.top();
		_qsell_tra.pop();
		qsell_tra1.insert({ { temp.second, temp.first }, temp });
	}

	auto minTra = qsell_int1.begin();
	while (minTra != qsell_int1.end())						// 匹配相等
	{
		auto temp1 = qsell_int1.find(minTra->first);
		if (temp1 == qsell_int1.end())
		{
			++minTra;
			continue;
		}

		auto temp2 = qsell_tra1.find(minTra->first);
		if (temp2 == qsell_tra1.end())
		{
			++minTra;
			continue;
		}

		LCpair qint = temp1->second;
		LCpair qtra = temp2->second;

		int profit = (qtra.first + qtra.four) - (qint.first + qint.four);

		_sell_ans.push_back(qint.third);

		std::string sell_tra = qtra.third;

		sell_tra += "           ";
		sell_tra += (profit >= 0 ? "+" : "");
		sell_tra += std::to_string(profit);
		_sum += profit;

		_sell_ans.push_back(sell_tra);

		minTra = qsell_int1.erase(temp1);
		qsell_tra1.erase(temp2);
	}

	// 将积分交易币比例相同的交易合成

	std::multimap<int, LCpair, std::greater<int>> qsell_int2;
	for (auto& e : qsell_int1)
	{
		qsell_int2.insert({ (e.second.first + e.second.four) / e.second.second, e.second });
	}
	// int 指的是 " 积分/交易币 " 的比例
	// 让相同比例记录可以连续访问

	auto getInt1 = qsell_int2.begin();
	while (getInt1 != qsell_int2.end())
	{
		auto range = qsell_int2.equal_range(getInt1->first);
		auto nextIt = range.first;
		if (range.first == range.second || ++nextIt == range.second)
		{
			++getInt1;
			continue;
		}

		int intSum = 0;
		int traSum = 0;
		for (auto it = range.first; it != range.second; ++it)
		{
			intSum += it->second.first;
			traSum += it->second.second;
		}

		int ratio = getInt1->first;
		getInt1 = qsell_int2.erase(range.first, range.second);
		LCpair temp = sell_int_to_LCpair(intSum, traSum);
		qsell_int2.insert({ ratio, temp } );
	}

	std::multimap<int, LCpair> qsell_tra2;
	for (auto& e : qsell_tra1)
	{
		qsell_tra2.insert({ (e.second.first + e.second.four) / e.second.second, e.second });
	}
	// int 指的是 " 积分/交易币 " 的比例
	// 让相同比例记录可以连续访问

	auto getTra1 = qsell_tra2.begin();
	while (getTra1 != qsell_tra2.end())
	{
		auto range = qsell_tra2.equal_range(getTra1->first);
		auto nextIt = range.first;
		if (range.first == range.second || ++nextIt == range.second)
		{
			++getTra1;
			continue;
		}

		int intSum = 0;
		int traSum = 0;
		for (auto it = range.first; it != range.second; ++it)
		{
			intSum += it->second.first;
			traSum += it->second.second;
		}

		int ratio = getTra1->first;
		getTra1 = qsell_tra2.erase(range.first, range.second);
		LCpair temp = sell_tra_to_LCpair(intSum, traSum);
		qsell_tra2.insert({ ratio, temp });
	}

	//....
	merging(qsell_int2, qsell_tra2);						// 将合并的记录再次计算

	std::vector<std::string> leftover;
	while (qsell_int2.size() || qsell_tra2.size())			// 剩余未匹配记录
	{
		std::string other;

		if (qsell_int2.size())
		{
			other = qsell_int2.begin()->second.third;
			qsell_int2.erase(qsell_int2.begin());
		}
		else
		{
			other = qsell_tra2.begin()->second.third;
			qsell_tra2.erase(qsell_tra2.begin());
		}

		leftover.push_back(other);
	}

	_leftover = std::move(leftover);

}

template<class T1, class T2>
bool LedgerCalculation::solveTraExcess(T1& intMax, T2& traMin, std::multimap<int, LCpair, std::greater<int>>& qsell_int)
{
	if (traMin->second.second - intMax->second.second < 10)			// 保持交易币记录中的交易币大于等于 10
	{
		return false;
	}

	// 获利 = 卖交易币的一个交易币与积分比 * 卖积分的交易币个数 - 卖积分的成本
	int profit = (traMin->first * intMax->second.second) - (intMax->second.first + intMax->second.four);

	this->_sell_ans.push_back(intMax->second.third);

	//std::string sell_tra = traMin->second.third;		// BUG 需要重新更改字符串买卖信息
	std::string sell_tra = sell_tra_to_LCpair(traMin->first * intMax->second.second + intMax->second.second * 10, intMax->second.second).third;

	sell_tra += "[合成算法]        ";
	sell_tra += (profit >= 0 ? "+" : "");
	sell_tra += std::to_string(profit);
	this->_sum += profit;

	this->_sell_ans.push_back(sell_tra);

	//traMin->second.first -= traMin->first * intMax->second.second;
	traMin->second.first -= traMin->first * intMax->second.second + intMax->second.second * 10;
	traMin->second.second -= intMax->second.second;
	traMin->second = sell_tra_to_LCpair(traMin->second.first, traMin->second.second);

	int ratio = intMax->first;
	auto tempIt = qsell_int.find(ratio);
	qsell_int.erase(tempIt);

	return true;
}

template<class T1, class T2>
bool LedgerCalculation::solveIntExcess(T1& intMax, T2& traMin, std::multimap<int, LCpair>& qsell_tra)
{
	if (intMax->second.first - traMin->second.first < 5000)			// 保持积分记录中的积分大于等于 5000
	{
		return false;
	}

	//// 获利 = 卖交易币的积分总数 - 卖积分对齐卖交易币个数的积分成本
	int profit = traMin->second.first - (intMax->first * traMin->second.second);

	this->_sell_ans.push_back(sell_int_to_LCpair(intMax->second.first / intMax->second.second * traMin->second.second, traMin->second.second).third);

	std::string sell_tra = traMin->second.third;
	sell_tra += "[合成算法]        ";
	sell_tra += (profit >= 0 ? "+" : "");
	sell_tra += std::to_string(profit);
	this->_sum += profit;

	this->_sell_ans.push_back(sell_tra);

	intMax->second.first -= intMax->second.first / intMax->second.second * traMin->second.second;
	intMax->second.second -= traMin->second.second;
	intMax->second = sell_int_to_LCpair(intMax->second.first, intMax->second.second);

	int ratio = traMin->first;
	auto tempIt = qsell_tra.find(ratio);
	qsell_tra.erase(tempIt);

	return true;
}

void LedgerCalculation::merging(std::multimap<int, LCpair, std::greater<int>>& qsell_int, std::multimap<int, LCpair>& qsell_tra)
{
	auto intMax = qsell_int.begin();
	while (intMax != qsell_int.end())
	{
		auto traMin = qsell_tra.begin();
		while (traMin != qsell_tra.end() && intMax != qsell_int.end())
		{
			auto tempNextTra = traMin;
			++tempNextTra;
			if (solveIntExcess(intMax, traMin, qsell_tra) == true)
			{
				traMin = tempNextTra;
				continue;
			}
			auto tempNextInt = intMax;
			++tempNextInt;
			if (solveTraExcess(intMax, traMin, qsell_int) == true)
			{
				intMax = tempNextInt;
				traMin = qsell_tra.begin();
			}
			else
			{
				++traMin;
			}
		}

		if (intMax != qsell_int.end())
		{
			++intMax;
		}
	}
	int a = 10;
}

