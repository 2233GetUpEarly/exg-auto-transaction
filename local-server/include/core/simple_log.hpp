#pragma once

#include <filesystem>
#include <iostream>
#include <fstream>
#include <sstream>
#include <string>
#include <memory>
#include <ctime>
#include <mutex>
#include <thread>

#ifdef __linux__
#include <unistd.h>
#else

#endif

// 采用 策略模式(C++多态) 将写入方式分开
// 1. 控制台写入
// 2. 文件写入

// 策略基类
class LogStrategy
{
public:

    LogStrategy() = default;
    ~LogStrategy() = default;

    virtual void SyncLog(const std::string& message) = 0;
};

// 控制台打印日志策略子类
class ConsoleLogStrategy : public LogStrategy
{
public:

    ConsoleLogStrategy() = default;
    ~ConsoleLogStrategy() = default;

    virtual void SyncLog(const std::string& message) override
    {
        std::unique_lock<std::mutex> lock(_mutex);
        std::cout << message << std::endl;
    }

private:

    std::mutex _mutex;
};

static const std::string defaultPath = ".";
static const std::string defaultName = "my.log";
static const std::string gsep = "\r\n";

// 文件打印日志策略子类
class FileLogStrategy : public LogStrategy
{
public:

    ~FileLogStrategy() = default;

    FileLogStrategy(const std::string& path = defaultPath, const std::string& name = defaultName)
        :_path(path)
        , _name(name)
    {
        if (std::filesystem::exists(_path))
        {
            return;
        }

        std::filesystem::create_directories(_path);
    }

    virtual void SyncLog(const std::string& message) override
    {
        std::unique_lock<std::mutex> lock(_mutex);
        std::string filename = _path + (_path.back() == '/' ? "" : "/") + _name;
        std::ofstream fout(filename, std::ios::app);
        if (fout.is_open() == false)
        {
            return;
        }

        fout << message << gsep;
        fout.close();
    }

private:

    std::mutex _mutex;
    std::string _path;
    std::string _name;
};

// 日志等级
enum LogLevel
{
    DEBUG,
    INFO,
    WARN,
    ERRO,
    FATAL,
};

// 枚举转字符串
static std::string LevelToStr(LogLevel level)
{
    switch (level)
    {
    case LogLevel::DEBUG:
        return "DEBUG";
    case LogLevel::INFO:
        return "INFO";
    case LogLevel::WARN:
        return "WARN";
    case LogLevel::ERRO:
        return "ERRO";
    case LogLevel::FATAL:
        return "FATAL";
    default:
        return "UNKNOW";
    }
}

// 得到当前时间
static std::string getCurrentTime()
{
    const time_t theTime = time(nullptr);
    struct tm timeData;

#ifdef __linux__
    localtime_r(&theTime, &timeData);
#elif _WIN32
    localtime_s(&timeData, &theTime);
#endif

    char timebuffer[128];
    snprintf(timebuffer, sizeof(timebuffer), "%04d-%02d-%02d %02d:%02d:%02d",
        timeData.tm_year + 1900,
        timeData.tm_mon + 1,
        timeData.tm_mday,
        timeData.tm_hour,
        timeData.tm_min,
        timeData.tm_sec
    );
    return timebuffer;
}

class Logger                // 日志管理
{
public:

    // 单个日志消息
    class LogMessage
    {
    public:

        LogMessage(LogLevel level, const std::string& file_name, int line, Logger& logger)
            :_cur_time(getCurrentTime())
            , _level(LevelToStr(level))
            , _pid(std::this_thread::get_id())
            , _file_name(file_name)
            , _line(line)
            , _logger(logger)
        {
            _messageSum << '[' << _cur_time << "] "
                << '[' << _level << "] "
                << '[' << _pid << "] "
                << '[' << _file_name << "] "
                << '[' << _line << "] ";
        }

        template<class Type>
        LogMessage& operator<<(const Type& message)                 // 输出流式的输出信息
        {
            _messageSum << message;
            return *this;
        }

        ~LogMessage()
        {
            if (_logger._log_strategy == nullptr)
            {
                return;
            }

            _logger._log_strategy->SyncLog(_messageSum.str());      // 消息打印
        }

    private:

        std::string _cur_time;          // 当前时间
        std::string _level;             // 日志消息级别
        std::thread::id _pid;           // PID
        std::string _file_name;         // 所在文件名
        int _line;                      // 所在行号

        std::stringstream _messageSum;  // 汇合信息(stringstream 会将 << 得到的信息转为字符串)
        Logger& _logger;
    };

public:

    Logger()
    {
        enableConsoleLogStrategy();
    }

    ~Logger() = default;

    void enableConsoleLogStrategy()
    {
        _log_strategy = std::make_unique<ConsoleLogStrategy>();
    }

    void enableFileLogStrategy()
    {
        _log_strategy = std::make_unique<FileLogStrategy>();
    }

    // 将信息返回到程序员代码层面，再在 LogMessage 里实现 << 重载，使用 << 来输入到指定日志里
    LogMessage operator()(LogLevel level, const std::string& file_name, int line)
    {
        return LogMessage(level, file_name, line, *this);
    }

private:

    std::unique_ptr<LogStrategy> _log_strategy;
};

// 饿汉单例模式
class LogSingleton
{
public:

    LogSingleton(const LogSingleton&) = delete;
    LogSingleton& operator=(const LogSingleton&) = delete;

    static Logger& getInstance()
    {
        static Logger instance;
        return instance;
    }

private:

    LogSingleton() = default;
};

#define __FILENAME__ (__FILE__ + SOURCE_PATH_SIZE)
#define LOG(level) LogSingleton::getInstance().operator()(level, __FILENAME__, __LINE__)
#define ENABLE_CONSOLE_LOG_STRATEGY() LogSingleton::getInstance().enableConsoleLogStrategy()
#define ENABLE_FILE_LOG_STRATEGY() LogSingleton::getInstance().enableFileLogStrategy()


