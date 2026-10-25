#include <core/simple_log.hpp>
#include <core/sale_util.hpp>
#include <task/sale_data_handle.hpp>

SaleDataHandle::SaleDataHandle()
{

}

SaleDataHandle::~SaleDataHandle()
{

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
	return true;
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
	remove_already_calculate_data(sale_data_str);
	save_sale_data_to_file(sale_data_str);
	std::string latest_time = get_sale_latest_time(sale_data_str);
	save_latest_time_attribute_to_file(latest_time);
	execute_ledger_calculation();
}
