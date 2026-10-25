#pragma once

#include <string>

std::string get_sale_latest_time(const std::string& str);

void remove_already_calculate_data(std::string& sale_data_str);

void save_sale_data_to_file(const std::string& sale_data_str);

void save_latest_time_attribute_to_file(const std::string& latest_time);

void execute_ledger_calculation();