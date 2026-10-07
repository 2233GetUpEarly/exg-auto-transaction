#pragma once

#include <string>

struct ConfigStruct
{
	int port;
	std::string host;
	std::string server_cert_file_name;
	std::string server_key_file_name;
	std::string server_cert_path;
	std::string server_key_path;
	bool open_wss_mode = false;
};

class Config
{
public:

	Config(ConfigStruct&);

	~Config();
};
