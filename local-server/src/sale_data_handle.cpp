#include <task/sale_data_handle.hpp>
#include <iostream>
#include <fstream>
#include <filesystem>

SaleDataHandle::SaleDataHandle()
{

}

SaleDataHandle::~SaleDataHandle()
{

}

void SaleDataHandle::task(nlohmann::json& json)
{
	int task_number = json["type"].get<int>();
	std::cout << "任务码[" << task_number << "]:销售记录处理" << std::endl;

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
		std::cerr << "销售文件打开失败" << std::endl;
		assert(false);
		return;
	}

	std::string sale_data_str = json["data"].get<std::string>();
	std::cout << "销售记录保存到文件" << std::endl;

	sale_file << sale_data_str;
	sale_file.close();
}
