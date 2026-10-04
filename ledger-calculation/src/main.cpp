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

#ifdef _DEBUG
	std::cout << argc << std::endl;
#endif

	MultiArg ma(argc, argv);

	return 0;
}
