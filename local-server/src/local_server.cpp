#include <local_server.hpp>
#include <iostream>

LocalServer::LocalServer(int port, const std::string& host, std::shared_ptr<TaskHandler> task_handler)
    :server_(port, host)
{
    ix::initNetSystem();

    set_on_connection_callback(task_handler);
}

LocalServer::~LocalServer()
{
    ix::uninitNetSystem();
}

void LocalServer::start()
{
    server_.start();
    std::cout << "服务器已启动，监听端口 " << server_.getPort() << "..." << std::endl;
}

void LocalServer::wait()
{
    server_.wait();
}

void LocalServer::listen()
{
    auto res = server_.listen();
    if (!res.first)
    {
        std::cerr << "监听失败: " << res.second << std::endl;
        return;
    }
}

void LocalServer::set_on_connection_callback(std::shared_ptr<TaskHandler> task_handler)
{
    // 为每个新连接设置回调
    server_.setOnConnectionCallback(
        [this, task_handler](std::weak_ptr<ix::WebSocket> wsWeak,
            std::shared_ptr<ix::ConnectionState> state)
        {
            auto ws = wsWeak.lock();
            if (!ws) return;

            std::cout << "新客户端连接: " << state->getRemoteIp() << std::endl;

            ws->setOnMessageCallback(
                [wsWeak, task_handler](const ix::WebSocketMessagePtr& msg)
                {
                    auto ws = wsWeak.lock();
                    if (!ws) return;

                    switch (msg->type)
                    {
                    case ix::WebSocketMessageType::Message:
                    {
                        task_handler->task(msg->str);
                        break;
                    }
                    case ix::WebSocketMessageType::Close:
                    {
                        std::cout << "客户端断开连接" << std::endl;
                        break;
                    }
                    case ix::WebSocketMessageType::Error:
                    {
                        std::cout << "错误: " << msg->errorInfo.reason << std::endl;
                        break;
                    }
                    default:
                        break;
                    }
                });
        });
}

