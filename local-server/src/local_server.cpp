#include <local_server.hpp>
#include <iostream>
#include <core/simple_log.hpp>
#include <core/config.hpp>

static void open_wss_mode(ix::WebSocketServer& server, const ConfigStruct& config_struct)
{
    ix::SocketTLSOptions tlsOptions;

    // 指定服务器证书和私钥路径
    tlsOptions.certFile = config_struct.server_cert_path + config_struct.server_cert_file_name;
    tlsOptions.keyFile = config_struct.server_key_path + config_struct.server_key_file_name;

    // 服务器模式必须显式设置为 true
    tlsOptions.tls = true;

    // 关于 CA 文件的配置
    // - 生产环境：使用默认 "SYSTEM" 或指定具体 CA
    // - 自签名测试：可设为 "NONE" 以跳过对客户端的证书验证
    // - 或者指定包含自签名证书的 CA 文件路径
    tlsOptions.caFile = "NONE"; // 仅用于本地测试

    // 将 TLS 配置应用到服务器
    server.setTLSOptions(tlsOptions);
}

LocalServer::LocalServer(const ConfigStruct& config_struct, std::shared_ptr<TaskHandler> task_handler)
    :server_(config_struct.port, config_struct.host)
{
    ix::initNetSystem();

    if (config_struct.open_wss_mode == true)
    {
        open_wss_mode(server_, config_struct);
    }

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

