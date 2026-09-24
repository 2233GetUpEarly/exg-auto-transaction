cmake_minimum_required(VERSION 3.15)

project(exgat)

if(MSVC)
	add_compile_options($<$<CXX_COMPILER_ID:MSVC>:/utf-8>)
endif()

add_subdirectory(website-interaction)
add_subdirectory(ledger-calculation)
