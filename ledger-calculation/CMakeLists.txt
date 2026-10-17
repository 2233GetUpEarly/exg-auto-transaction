
find_package(catch2 CONFIG REQUIRED)

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
set_target_properties(ledger_calculation PROPERTIES
	RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/bin
	ARCHIVE_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/lib
	LIBRARY_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/lib
)

add_executable(base_test "tests/test.cpp")
target_link_libraries(base_test PRIVATE ledger_calculation_lib)
set_target_properties(base_test PROPERTIES
	RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/bin
	ARCHIVE_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/lib
	LIBRARY_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/lib
)

include(CTest)
if(BUILD_TESTING)
	add_executable(ledger_calculation_unit_test
		"tests/unit_test.cpp"
		"tests/test_base_function.cpp"
		"tests/test_lc_unit.cpp"
	)
	target_link_libraries(ledger_calculation_unit_test PRIVATE ledger_calculation_lib Catch2::Catch2)
	set_target_properties(ledger_calculation_unit_test PROPERTIES
		RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/bin
		ARCHIVE_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/lib
		LIBRARY_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/lib
	)
    include(Catch)
    catch_discover_tests(ledger_calculation_unit_test)
endif()

# 安装账本计算程序
install(TARGETS ledger_calculation)
