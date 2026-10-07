#pragma once

#include <task_handler.hpp>

#include <set>
#include <memory>
#include <string>
#include <ixwebsocket/IXWebSocketServer.h>

struct ConfigStruct;
class TaskHandler;

class LocalServer
{
public:

	LocalServer(const ConfigStruct&, std::shared_ptr<TaskHandler> task_handler);

	~LocalServer();

	void listen();

	void start();

	void wait();

private:

	void set_on_connection_callback(std::shared_ptr<TaskHandler> task_handler);

private:

	ix::WebSocketServer server_;
};
