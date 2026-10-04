
find_package(nlohmann_json CONFIG REQUIRED)
find_package(ixwebsocket REQUIRED)
find_package(OpenSSL REQUIRED)
find_package(ZLIB CONFIG REQUIRED)
# 查找 mbedtls（vcpkg 提供的包名）
find_package(MbedTLS CONFIG REQUIRED)

find_path(IXWEBSOCKET_INCLUDE_DIR ixwebsocket/IXWebSocket.h)
find_library(IXWEBSOCKET_LIBRARY NAMES ixwebsocket)

if(NOT IXWEBSOCKET_LIBRARY)
    message(FATAL_ERROR "找不到 ixwebsocket.lib，请检查 vcpkg 安装路径")
endif()

# 计算当前项目根目录路径长度（注意末尾的 / 或 \），并设置预处理宏 SOURCE_PATH_SIZE 用于日志打印截断文件路径
string(LENGTH "${CMAKE_CURRENT_SOURCE_DIR}/" SOURCE_PATH_SIZE)
add_definitions("-DSOURCE_PATH_SIZE=${SOURCE_PATH_SIZE}")

file(GLOB LS_SRC_LIST "${CMAKE_CURRENT_SOURCE_DIR}/src/*.cpp")

add_library(local_server_lib STATIC ${LS_SRC_LIST})
target_include_directories(local_server_lib
    PUBLIC
        ${IXWEBSOCKET_INCLUDE_DIR}
        ${CMAKE_CURRENT_SOURCE_DIR}/include
)
target_link_libraries(local_server_lib
    PRIVATE
        ${IXWEBSOCKET_LIBRARY}
        Ws2_32
        crypt32
        ZLIB::ZLIB
        MbedTLS::mbedtls
)

add_executable(local_server "tests/test.cpp")
target_link_libraries(local_server PRIVATE local_server_lib)


