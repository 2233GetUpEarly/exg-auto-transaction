#pragma once

#include <set>
#include <memory>
#include <string>
#include <ixwebsocket/IXWebSocketServer.h>

class LocalServer
{
public:

	LocalServer(int port, const std::string& host);

	~LocalServer();

	void listen();

	void start();

	void wait();

private:

	void set_on_connection_callback();

private:

	ix::WebSocketServer server_;
};
