
set(JS_FILES
    "${CMAKE_CURRENT_SOURCE_DIR}/tampermonkey-user-script.js"
    "${CMAKE_CURRENT_SOURCE_DIR}/verification-code/ddddocr-helper.js"
    "${CMAKE_CURRENT_SOURCE_DIR}/trigger.js"
    "${CMAKE_CURRENT_SOURCE_DIR}/util.js"
    "${CMAKE_CURRENT_SOURCE_DIR}/interactive-button.js"
    "${CMAKE_CURRENT_SOURCE_DIR}/initialization-step.js"
    "${CMAKE_CURRENT_SOURCE_DIR}/initialization-flow.js"
    "${CMAKE_CURRENT_SOURCE_DIR}/floating-window.js"
    "${CMAKE_CURRENT_SOURCE_DIR}/data-analysis.js"
    "${CMAKE_CURRENT_SOURCE_DIR}/main.js"
)
set(JS_OUTPUT_FILE "${CMAKE_CURRENT_BINARY_DIR}/website_interaction.js")

# 注册成构建目标：源文件变化时自动重新合并
add_custom_command(
    OUTPUT "${JS_OUTPUT_FILE}"
    COMMAND "${CMAKE_COMMAND}"
        "-DJS_FILES=${JS_FILES}"
        "-DJS_OUTPUT_FILE=${JS_OUTPUT_FILE}"
        "-DPROJECT_ROOT=${CMAKE_SOURCE_DIR}"
        -P "${CMAKE_SOURCE_DIR}/cmake/merge_js.cmake"
    DEPENDS ${JS_FILES} "${CMAKE_SOURCE_DIR}/cmake/merge_js.cmake"
    COMMENT "合并 JS 文件 -> website_interaction.js"
    VERBATIM
)

add_custom_target(merge_js ALL DEPENDS "${JS_OUTPUT_FILE}")