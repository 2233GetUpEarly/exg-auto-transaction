
if(MSVC)
	add_compile_options($<$<CXX_COMPILER_ID:MSVC>:/utf-8>)
endif()

file(GLOB SRC_LIST "src/*.cpp")

add_library(ledger_calculation ${SRC_LIST})
target_include_directories(ledger_calculation
	PUBLIC "${CMAKE_CURRENT_SOURCE_DIR}/include/"
)

add_executable(base_test "tests/test.cpp")
target_link_libraries(base_test PRIVATE ledger_calculation)

