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
void test4();

int main()
{
#ifdef _WIN32
    SetConsoleOutputCP(65001);
    SetConsoleCP(65001);
#endif

    test2();
    //test3();
    //test4();

    return 0;
}

void test4()
{
    STARTUPINFOW si = { sizeof(si) };
    PROCESS_INFORMATION pi = { 0 };

    std::wstring exePath = L"D:\\code\\exg-auto-transaction\\build\\ledger-calculation\\ledger_calculation.exe";
    std::wstring cmdLine = L"\"" + exePath + L"\" -f";

    // 注意：lpCommandLine 必须可写，不能传字符串字面量
    BOOL ok = CreateProcessW(
        exePath.c_str(),      // 应用程序路径
        &cmdLine[0],          // 命令行（含参数）
        NULL, NULL,
        FALSE,
        0,                    // 创建标志，如 CREATE_NEW_CONSOLE
        NULL,                 // 环境变量
        NULL,                 // 工作目录，NULL 表示当前目录
        &si, &pi
    );

    if (!ok)
    {
        // 用 GetLastError() 查看错误
        return;
    }

    // 等待子进程结束（可选）
    WaitForSingleObject(pi.hProcess, INFINITE);
    DWORD exitCode;
    GetExitCodeProcess(pi.hProcess, &exitCode);

    CloseHandle(pi.hProcess);
    CloseHandle(pi.hThread);

    std::cout << exitCode << std::endl;
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
    std::vector<TaskHandler::ptr> arr = {
    std::make_shared<SaleDataHandle>()
    };

    std::shared_ptr<TaskHandler> task_handler = std::make_shared<TaskHandler>(arr);
    LocalServer server(54321, "127.0.0.1", task_handler);

    server.listen();

    server.start();

    server.wait();
}
