#include <local_server.hpp>
#include <iostream>
#include <core/simple_log.hpp>

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
    LOG(DEBUG) << "服务器已启动，监听端口 " << server_.getPort() << "...";
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
        LOG(DEBUG) << "监听失败: " << res.second;
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

            LOG(DEBUG) << "客户端建立连接: " << state->getRemoteIp() << ":" << state->getRemotePort();

            ws->setOnMessageCallback(
                [wsWeak, task_handler, state](const ix::WebSocketMessagePtr& msg)
                {
                    auto ws = wsWeak.lock();
                    if (!ws) return;

                    switch (msg->type)
                    {
                    case ix::WebSocketMessageType::Message:
                    {
                        if (msg->binary)
                        {
                            LOG(DEBUG) << "收到二进制数据并丢弃，长度: " << msg->str.size();
                        }
                        else
                        {
                            task_handler->task(msg->str);
                        }
                        break;
                    }
                    case ix::WebSocketMessageType::Close:
                    {
                        LOG(DEBUG) << "客户端断开连接: " << state->getRemoteIp() << ":" << state->getRemotePort();
                        break;
                    }
                    case ix::WebSocketMessageType::Error:
                    {
                        LOG(ERRO) << "错误: " << msg->errorInfo.reason;
                        break;
                    }
                    default:
                        break;
                    }
                });
        });
}

