#include <task/sale_data_handle.hpp>
#include <core/simple_log.hpp>
#include <iostream>
#include <sstream>
#include <fstream>
#include <filesystem>
#include <regex>

SaleDataHandle::SaleDataHandle()
{

}

SaleDataHandle::~SaleDataHandle()
{

}

static std::string get_sale_latest_time(const std::string& str)
{
	// 匹配 ISO8601 时间：YYYY-MM-DDTHH:MM:SS
	std::regex re(R"(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})");

	std::string line;
	std::string latest_time;
	std::stringstream sin(str);

	while (std::getline(sin, line))
	{
		std::smatch m;
		if (std::regex_search(line, m, re))	 // 只匹配第一个也就是最新的时间
		{
			latest_time = m.str();  
			break;                 
		}
	}

	if (!latest_time.empty())
	{
		LOG(DEBUG) << "获取最新销售信息时间: " << latest_time;
	}
	else
	{
		LOG(ERRO) << "没有找到最新销售时间";
	}

	return latest_time;
}

static void save_sale_data_to_file(const std::string& sale_data_str)
{
	std::string data_path = "./temp/";
	std::string data_file = "sale_data.txt";

	if (std::filesystem::exists(data_path) == false)
	{
		std::filesystem::create_directories(data_path);
	}

	std::string filename = data_path + data_file;
	std::ofstream sale_file(filename);
	if (sale_file.is_open() == false)
	{
		LOG(ERRO) << "销售文件打开失败";
		assert(false);
		return;
	}

	sale_file << sale_data_str;
	LOG(DEBUG) << "销售记录输出到销售文件中";

	sale_file.close();
}

static bool check_json_key(nlohmann::json& json)
{
	if (json.contains("eat_type") == false)
	{
		LOG(ERRO) << "未找到 key 类型: eat_type";
		return false;
	}
	if (json.contains("eat_data") == false)
	{
		LOG(ERRO) << "未找到 key 类型: eat_data";
		return false;
	}
}

static void save_latest_time_attribute_to_file(const std::string& latest_time)
{
	std::string data_path = "./temp/";
	std::string data_file = "sale_attribute.json";

	if (std::filesystem::exists(data_path) == false)
	{
		std::filesystem::create_directories(data_path);
	}

	std::string filename = data_path + data_file;
	std::ofstream sale_attribute_file(filename);
	if (sale_attribute_file.is_open() == false)
	{
		LOG(ERRO) << "销售属性文件打开失败";
		assert(false);
		return;
	}

	nlohmann::json json;
	json["latest_time"] = latest_time;
	sale_attribute_file << json;
	LOG(DEBUG) << "销售最新时间输出到销售属性文件中";
	
	sale_attribute_file.close();
}

void SaleDataHandle::task(nlohmann::json& json)
{
	if (check_json_key(json) == false)
	{
		LOG(ERRO) << "json 中未找到需要的 key";
		return;
	}

	int task_number = json["eat_type"].get<int>();
	LOG(DEBUG) << "任务码[" << task_number << "]:销售记录处理";

	std::string sale_data_str = json["eat_data"].get<std::string>();
	save_sale_data_to_file(sale_data_str);
	std::string latest_time = get_sale_latest_time(sale_data_str);
	save_latest_time_attribute_to_file(latest_time);
}
