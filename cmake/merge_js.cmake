
if(NOT DEFINED JS_FILES)
    message(FATAL_ERROR "未指定 JS_FILES")
endif()
if(NOT DEFINED JS_OUTPUT_FILE)
    message(FATAL_ERROR "未指定 JS_OUTPUT_FILE")
endif()

get_filename_component(OUTPUT_DIR "${JS_OUTPUT_FILE}" DIRECTORY)
if(OUTPUT_DIR AND NOT EXISTS "${OUTPUT_DIR}")
    file(MAKE_DIRECTORY "${OUTPUT_DIR}")
endif()

# 清空/创建输出文件
file(WRITE "${JS_OUTPUT_FILE}" "")

foreach(js_file IN LISTS JS_FILES)
    if(NOT EXISTS "${js_file}")
        message(FATAL_ERROR "找不到 JS 文件: ${js_file}")
    endif()

    # 转成相对于项目根目录的路径
    if(DEFINED PROJECT_ROOT)
        file(RELATIVE_PATH js_file_rel "${PROJECT_ROOT}" "${js_file}")
    elseif(DEFINED CMAKE_SOURCE_DIR)
        file(RELATIVE_PATH js_file_rel "${CMAKE_SOURCE_DIR}" "${js_file}")
    else()
        set(js_file_rel "${js_file}")
    endif()

    # 写入分隔注释
    file(APPEND "${JS_OUTPUT_FILE}" "/* ===== ${js_file_rel} ===== */\n")

    # 读出源文件内容
    file(READ "${js_file}" JS_CONTENT)

    # 追加到输出文件（内容必须加引号，防止分号被当作列表分隔符）
    file(APPEND "${JS_OUTPUT_FILE}" "${JS_CONTENT}")

    # 每个文件后补一个换行
    file(APPEND "${JS_OUTPUT_FILE}" "\n")
endforeach()

message(STATUS "已合并 ${JS_FILES} -> ${JS_OUTPUT_FILE}")
