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

static std::pair<int, int> consoleStringEXG_FormatSolve(std::string& str)
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

	ans.first = std::stoi(str.substr(index + 1));

	std::getline(std::cin, str);
	index = 0;

	while (str[index] < '0' || str[index] > '9')
	{
		++index;
	}

	ans.second = std::stoi(str.substr(index));

	return ans;
}

static std::pair<int, int> consoleStringSolveAboutEXG_Format(std::string& str)
{
	std::pair<int, int> ans;

	size_t index = 0;

	if ('0' <= str[index] && str[index] <= '9')
	{
		ans.first = std::stoi(str.substr(index));
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

void LedgerCalculation::consoleComprehensiveFormatMatching()
{
	LedgerCalculation cal;
	std::string str;
	std::cout << "请输入 EXG 网页字符串格式或者" << std::endl;
	std::cout << "输入字符串且保证格式:> \"数字 ... 数字 ... (只读取前两个数字)\"" << std::endl;
	while (std::getline(std::cin, str))
	{
		std::pair<int, int> ans = consoleStringEXG_FormatSolve(str);
		if (ans.first != -1 && ans.second != -1)
		{
			cal.getInfo(ans.first, ans.second);
			continue;
		}

		ans = consoleStringSolveAboutEXG_Format(str);
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

void LedgerCalculation::consoleStringInputForEXG_Format()
{
	LedgerCalculation cal;
	std::string str;
	std::cout << "请输入 EXG 网页字符串格式：" << std::endl;
	while (std::getline(std::cin, str))
	{
		std::pair<int, int> ans = consoleStringEXG_FormatSolve(str);
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

	//ans += std::to_string(proportion);
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
	int sum = 0;

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
		sum += profit;

		_sell_ans.push_back(sell_tra);
	}

	_sell_ans.push_back("总赚：" + std::to_string(sum) + "积分");

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
