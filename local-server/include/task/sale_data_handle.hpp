#pragma once

#include <task/task_handle_interface.hpp>

class SaleDataHandle : public TaskHandleInterface
{
public:

	SaleDataHandle();

	void task(nlohmann::json& json) override;

	~SaleDataHandle();
};