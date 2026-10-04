#include <task/sale_data_handle.hpp>
#include <iostream>
#include <fstream>
#include <filesystem>
#include <core/simple_log.hpp>

SaleDataHandle::SaleDataHandle()
{

}

SaleDataHandle::~SaleDataHandle()
{

}

void SaleDataHandle::task(nlohmann::json& json)
{
	int task_number = json["eat_type"].get<int>();
	LOG(DEBUG) << "任务码[" << task_number << "]:销售记录处理";

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
		LOG(FATAL) << "销售文件打开失败";
		assert(false);
		return;
	}

	std::string sale_data_str = json["eat_data"].get<std::string>();
	LOG(DEBUG) << "销售记录输出到销售文件中";

	sale_file << sale_data_str;
	sale_file.close();
}
