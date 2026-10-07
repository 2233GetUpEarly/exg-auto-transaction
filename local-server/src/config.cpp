#include <core/config.hpp>
#include <nlohmann/json.hpp>
#include <cassert>
#include <fstream>
#include <filesystem>
#include <iostream>

Config::Config(ConfigStruct& config_struct)
{
    const std::string root_path = "../";
    const std::string config_path = "config/";
    const std::string local_server_config_name = "local_server_config.json";
    const std::string local_server_config_file = root_path + config_path + local_server_config_name;
    std::ifstream config_file(local_server_config_file);
    if (config_file.is_open() == false)
    {
        std::cout << "文件打开失败" << std::endl;
        return;
    }

    auto size = std::filesystem::file_size(local_server_config_file);
    std::string config_str(size, '\0');
    config_file.read(config_str.data(), size);

    nlohmann::json json = nlohmann::json::parse(config_str);

    if (json.contains("port") == false)
    {
        std::cout << "配置文件 port 字段不存在" << std::endl;
        assert(false);
        return;
    }
    if (json.contains("host") == false)
    {
        std::cout << "配置文件 host 字段不存在" << std::endl;
        assert(false);
        return;
    }

    config_struct.port = json["port"].get<int>();
    config_struct.host = json["host"].get<std::string>();
}

Config::~Config()
{

}


