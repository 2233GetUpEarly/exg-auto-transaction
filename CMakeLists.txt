cmake_minimum_required(VERSION 3.15)

project(exgat)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

if(MSVC)
	add_compile_options($<$<CXX_COMPILER_ID:MSVC>:/utf-8>)
endif()

add_subdirectory(website-interaction)
add_subdirectory(ledger-calculation)
