#include <local_server.hpp>
#include <iostream>
#include <string>
#include <memory>
#include <set>
#include <fstream>
#include <filesystem>
#include <nlohmann/json.hpp>
#include <task_handle_set.hpp>

#ifdef _WIN32
#include <Windows.h>
#endif

void test2();
void test3();

int main()
{
#ifdef _WIN32
    SetConsoleOutputCP(65001);
    SetConsoleCP(65001);
#endif

    //test2();
    test3();

    return 0;
}

void test3()
{
    std::string filename = "D:\\test\\test_data.txt";

    std::vector<TaskHandler::ptr> arr = {
        std::make_shared<SaleDataHandle>()
    };

    std::shared_ptr<TaskHandler> task_handler = std::make_shared<TaskHandler>(arr);
    std::ifstream file(filename);
    auto size = std::filesystem::file_size(filename);
    if (file.is_open() == false)
    {
        std::cout << "文件打开失败" << std::endl;
        return;
    }

    std::string str(size, '\0');
    file.read(str.data(), size);

    task_handler->task(str);

    //std::cout << str << std::endl;
}

void test2()
{
    std::shared_ptr<TaskHandler> task_handler = std::make_shared<TaskHandler>();
    LocalServer server(54321, "127.0.0.1", task_handler);

    server.listen();

    server.start();

    server.wait();
}
