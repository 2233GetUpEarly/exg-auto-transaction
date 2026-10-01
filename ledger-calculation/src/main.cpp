#include <multi_arg.hpp>
#include <iostream>

#ifdef _WIN32
#include <Windows.h>
#endif

using namespace std;

int main(int argc, char* argv[])
{
#ifdef _WIN32
	SetConsoleOutputCP(65001);
	SetConsoleCP(65001);
#endif

	std::cout << argc << std::endl;
	MultiArg ma(argc, argv);

	return 0;
}
