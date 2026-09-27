#include <multi_arg.hpp>
#include <windows.h>
#include <iostream>

using namespace std;

int main(int argc, char* argv[])
{
	SetConsoleOutputCP(65001);
	SetConsoleCP(65001);

	std::cout << argc << std::endl;
	MultiArg ma(argc, argv);

	return 0;
}
