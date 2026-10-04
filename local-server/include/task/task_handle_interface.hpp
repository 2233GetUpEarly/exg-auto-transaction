#pragma once

#include <nlohmann/json.hpp>

class TaskHandleInterface
{
public:

	TaskHandleInterface() = default;
	virtual ~TaskHandleInterface() = default;

	virtual void task(nlohmann::json& json) = 0;
};