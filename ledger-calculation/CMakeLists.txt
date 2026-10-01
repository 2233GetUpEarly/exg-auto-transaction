

add_library(ledger_calculation_lib
	src/common.cpp
	src/ledger_calculation.cpp
	src/multi_arg.cpp
)
target_include_directories(ledger_calculation_lib
	PUBLIC "${CMAKE_CURRENT_SOURCE_DIR}/include/"
)

add_executable(ledger_calculation "src/main.cpp")
target_link_libraries(ledger_calculation PRIVATE ledger_calculation_lib)

add_executable(base_test "tests/test.cpp")
target_link_libraries(base_test PRIVATE ledger_calculation_lib)

