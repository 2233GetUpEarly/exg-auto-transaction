#pragma once

#include <string>

struct ConfigStruct
{
	int port;
	std::string host;
};

class Config
{
public:

	Config(ConfigStruct&);

	~Config();
};
