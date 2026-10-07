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

    config_struct.server_cert_path = root_path + config_path;
    config_struct.server_key_path = root_path + config_path;

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
    if (json.contains("open_wss_mode") == false)
    {
        std::cout << "配置文件 open_wss_mode 字段不存在" << std::endl;
        assert(false);
        return;
    }

    config_struct.port = json["port"].get<int>();
    config_struct.host = json["host"].get<std::string>();
    config_struct.open_wss_mode = static_cast<bool>(json["open_wss_mode"].get<int>());

    if (config_struct.open_wss_mode == false)
    {
        return;
    }

    if (config_struct.open_wss_mode == true && json.contains("server_cert") == false)
    {
        std::cout << "服务器证书 server_cert 字段未设置" << std::endl;
        assert(false);
        return;
    }
    if (config_struct.open_wss_mode == true && json.contains("server_key") == false)
    {
        std::cout << "服务器秘钥 server_key 字段未设置" << std::endl;
        assert(false);
        return;
    }
    config_struct.server_cert_file_name = json["server_cert"].get<std::string>();
    config_struct.server_key_file_name = json["server_key"].get<std::string>();
}

Config::~Config()
{

}


