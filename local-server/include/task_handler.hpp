#pragma once

#include <task/task_handle_interface.hpp>

#include <memory>
#include <string>

class TaskHandler
{
public:

	using ptr = std::shared_ptr<TaskHandleInterface>;

public:

	TaskHandler(std::vector<ptr>&);

	TaskHandler();

	~TaskHandler();

	void task(const std::string& info);

private:

	std::vector<ptr> task_handle_func_;
};
