#pragma once

#include <task_handler.hpp>

#include <set>
#include <memory>
#include <string>
#include <ixwebsocket/IXWebSocketServer.h>

class TaskHandler;

class LocalServer
{
public:

	LocalServer(int port, const std::string& host, std::shared_ptr<TaskHandler> task_handler);

	~LocalServer();

	void listen();

	void start();

	void wait();

private:

	void set_on_connection_callback(std::shared_ptr<TaskHandler> task_handler);

private:

	ix::WebSocketServer server_;
};
