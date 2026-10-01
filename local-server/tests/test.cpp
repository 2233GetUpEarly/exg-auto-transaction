#include <local_server.hpp>
#include <iostream>
#include <string>
#include <memory>
#include <set>

#ifdef _WIN32
#include <Windows.h>
#endif

void test2();

int main()
{
#ifdef _WIN32
    SetConsoleOutputCP(65001);
    SetConsoleCP(65001);
#endif

    test2();

    return 0;
}

void test2()
{
    LocalServer server(54321, "127.0.0.1");

    server.listen();

    server.start();

    server.wait();
}
