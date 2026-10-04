#include <task_handler.hpp>
#include <nlohmann/json.hpp>
#include <core/simple_log.hpp>

#include <iostream>
#include <cassert>

using njson = nlohmann::json;

TaskHandler::TaskHandler(std::vector<TaskHandler::ptr>& task_arr)
	:task_handle_func_(task_arr)
{
	;
}

TaskHandler::TaskHandler()
{
	;
}

TaskHandler::~TaskHandler()
{
	;
}

void TaskHandler::task(const std::string& info)
{
	LOG(DEBUG) << "任务处理器执行任务";
	// 解析：把外层字符串转成内层 JSON 字符串
	nlohmann::json json = nlohmann::json::parse(info);      // outer 是一个 json
	int task_number = json["type"].get<int>();
	assert(task_number >= 0 && task_number < this->task_handle_func_.size());
	this->task_handle_func_[task_number]->task(json);
}
