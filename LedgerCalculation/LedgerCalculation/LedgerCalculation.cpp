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

	_qsell_int.push({ integral + cost, transactionCoins, ans});
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

	_qsell_tra.push({ integral - cost, transactionCoins, ans });
	//_sell_tra.push(ans);
}

void LedgerCalculation::calculate()
{
	while (_qsell_int.size() && _qsell_tra.size())				// 交易币匹配计算
	{
		//std::pair<int, int> sellMore = _qsell_tra.front();
		LCpair sell_tra_info = _qsell_tra.top();
		_qsell_tra.pop();
		//std::pair<int, int> sellLess = _qsell_int.front();
		LCpair sell_int_info = _qsell_int.top();
		_qsell_int.pop();
		if (sell_tra_info.second != sell_int_info.second)
		{
			//std::cout << "错误，交易币数量不匹配" << std::endl;

			_leftover.push_back(sell_int_info.third);
			//_sell_int.pop();

			_leftover.push_back(sell_tra_info.third);
			//_sell_tra.pop();
			
			continue;
		}

		int profit = sell_tra_info.first - sell_int_info.first;


		//_sell_ans.push_back(_sell_int.front());
		//_sell_int.pop();
		_sell_ans.push_back(sell_int_info.third);

		//std::string sell_tra = _sell_tra.front();
		//_sell_tra.pop();
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

	//_sell_ans.push_back("总赚：" + std::to_string(_sum) + "积分");

	while (_qsell_int.size() || _qsell_tra.size())			// 剩余未匹配记录
	{
		std::string other;

		if (_qsell_int.size())
		{
			//other = _qsell_int.front();
			//_sell_int.pop();

			other = _qsell_int.top().third;
			_qsell_int.pop();
		}
		else
		{
			//other = _qsell_tra.front();
			//_sell_tra.pop();

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

	return { integral, transactionCoins, ans };
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

	return { integral, transactionCoins, ans };
}

void LedgerCalculation::calculationAndMerging()
{
	std::multimap<int, LCpair> qsell_int;
	std::multimap<int, LCpair> qsell_tra;

	while (this->_qsell_int.size())
	{
		LCpair temp = _qsell_int.top();
		_qsell_int.pop();
		qsell_int.insert({temp.second, temp});
	}

	while (this->_qsell_tra.size())
	{
		LCpair temp = _qsell_tra.top();
		_qsell_tra.pop();
		qsell_tra.insert({ temp.second, temp });
	}

	int minTra = qsell_int.begin()->first;

	int maxTra = qsell_int.rbegin()->first;

	for (int find = minTra; find <= maxTra; ++find)		// 匹配相等
	{
		auto temp1 = qsell_int.find(find);
		if (temp1 == qsell_int.end())
		{
			continue;
		}

		auto temp2 = qsell_tra.find(find);
		if (temp2 == qsell_tra.end())
		{
			continue;
		}

		LCpair qint = temp1->second;
		LCpair qtra = temp2->second;

		int profit = qtra.first - qint.first;

		_sell_ans.push_back(qint.third);

		std::string sell_tra = qtra.third;

		sell_tra += "           ";
		sell_tra += (profit >= 0 ? "+" : "");
		sell_tra += std::to_string(profit);
		_sum += profit;

		_sell_ans.push_back(sell_tra);

		qsell_int.erase(temp1);
		qsell_tra.erase(temp2);

		--find;
	}

	//int minInt1 = qsell_int.begin()->first;
	//int maxInt1 = qsell_int.rbegin()->first;
	//for (int sum = minInt1; sum <= maxInt1; ++sum)
	//{
	//	auto range = qsell_int.equal_range(sum);
	//	if (range.first == range.second)
	//	{
	//		continue;
	//	}

	//	int intSum = 0;
	//	int traSum = 0;
	//	for (auto it = range.first; it != range.second; ++it)
	//	{
	//		intSum += it->second.first;
	//		traSum += it->second.second;
	//	}

	//	qsell_int.erase(range.first, range.second);
	//	qsell_int.insert({ traSum, sell_int_to_LCpair(intSum, traSum) });
	//}

	std::vector<std::string> leftover;
	while (qsell_int.size() || qsell_tra.size())			// 剩余未匹配记录
	{
		std::string other;

		if (qsell_int.size())
		{
			other = qsell_int.begin()->second.third;
			qsell_int.erase(qsell_int.begin());
		}
		else
		{
			other = qsell_tra.begin()->second.third;
			qsell_tra.erase(qsell_tra.begin());
		}

		leftover.push_back(other);
	}

	_leftover = std::move(leftover);

	//....
}
