#pragma once

#include <core/simple_log.hpp>

#include <memory>
#include <fstream>
#include <filesystem>

inline void create_path(const std::string& contain_file_of_path)
{
	std::filesystem::path filename(contain_file_of_path);
	if (std::filesystem::exists(filename.parent_path()) == false)
	{
		if (std::filesystem::create_directories(filename.parent_path()) == false)
		{
			LOG(ERRO) << "创建目录失败";
		}
	}
}

inline std::ofstream get_write_file(const std::string& contain_file_of_path)
{
	create_path(contain_file_of_path);
	std::ofstream file(contain_file_of_path);
	if (file.is_open() == false)
	{
		LOG(ERRO) << "创建可写文件失败";
	}
	return file;
}

inline std::ifstream get_read_file(const std::string& contain_file_of_path)
{
	create_path(contain_file_of_path);
	std::ifstream file(contain_file_of_path);
	if (file.is_open() == false)
	{
		LOG(ERRO) << "创建可读文件失败";
	}
	return file;
}

inline bool file_to_string(const std::string& contain_file_of_path, std::string& str)
{
	std::ifstream file = get_read_file(contain_file_of_path);
	if (file.is_open() == false)
	{
		return false;
	}
	auto size = std::filesystem::file_size(contain_file_of_path);

	str.resize(size, '\0');
	file.read(str.data(), size);
	return true;
}

