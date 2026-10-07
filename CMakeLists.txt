cmake_minimum_required(VERSION 3.15)

set(CMAKE_MSVC_RUNTIME_LIBRARY "MultiThreaded$<$<CONFIG:Debug>:Debug>")

project(exgat LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

if(MSVC)
	add_compile_options($<$<CXX_COMPILER_ID:MSVC>:/utf-8>)
endif()

add_subdirectory(website-interaction)
add_subdirectory(ledger-calculation)
add_subdirectory(local-server)

set(CPACK_PACKAGE_NAME "exg-auto-transaction")
set(CPACK_PACKAGE_VERSION "0.3.0")
if(WIN32)
    set(CPACK_GENERATOR "TGZ;NSIS")
else()
    set(CPACK_GENERATOR "TGZ")
endif()

# 使用打包功能
include(CPack)
