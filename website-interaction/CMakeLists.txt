
set(JS_FILES
    "${CMAKE_CURRENT_SOURCE_DIR}/tampermonkey-user-script.js"

    "${CMAKE_CURRENT_SOURCE_DIR}/core/debug.js"
    "${CMAKE_CURRENT_SOURCE_DIR}/core/queue.js"
    "${CMAKE_CURRENT_SOURCE_DIR}/core/flow-trigger.js"
    "${CMAKE_CURRENT_SOURCE_DIR}/core/eatwi-websocket.js"
    "${CMAKE_CURRENT_SOURCE_DIR}/core/global.js"
    "${CMAKE_CURRENT_SOURCE_DIR}/core/util.js"

    "${CMAKE_CURRENT_SOURCE_DIR}/interaction/button.js"
    "${CMAKE_CURRENT_SOURCE_DIR}/interaction/step.js"
    "${CMAKE_CURRENT_SOURCE_DIR}/interaction/flow.js"

    "${CMAKE_CURRENT_SOURCE_DIR}/ui/ui-slot.js"
    "${CMAKE_CURRENT_SOURCE_DIR}/ui/ui-load.js"

    "${CMAKE_CURRENT_SOURCE_DIR}/ui/basic/style.js"
    "${CMAKE_CURRENT_SOURCE_DIR}/ui/basic/html.js"
    "${CMAKE_CURRENT_SOURCE_DIR}/ui/basic/load.js"

    "${CMAKE_CURRENT_SOURCE_DIR}/ui/basic/interaction/panel.js"
    "${CMAKE_CURRENT_SOURCE_DIR}/ui/basic/interaction/logger.js"
    "${CMAKE_CURRENT_SOURCE_DIR}/ui/basic/interaction/trading-coin.js"
    "${CMAKE_CURRENT_SOURCE_DIR}/ui/basic/interaction/points.js"
    "${CMAKE_CURRENT_SOURCE_DIR}/ui/basic/interaction/steps.js"
    "${CMAKE_CURRENT_SOURCE_DIR}/ui/basic/interaction/flow-select.js"
    "${CMAKE_CURRENT_SOURCE_DIR}/ui/basic/interaction/queue.js"

    "${CMAKE_CURRENT_SOURCE_DIR}/ui/communication/style.js"
    "${CMAKE_CURRENT_SOURCE_DIR}/ui/communication/html.js"
    "${CMAKE_CURRENT_SOURCE_DIR}/ui/communication/load.js"

    "${CMAKE_CURRENT_SOURCE_DIR}/ui/communication/interaction/logger.js"
    "${CMAKE_CURRENT_SOURCE_DIR}/ui/communication/interaction/websocket-event.js"
    "${CMAKE_CURRENT_SOURCE_DIR}/ui/communication/interaction/flow-select.js"
    "${CMAKE_CURRENT_SOURCE_DIR}/ui/communication/interaction/flow-execute.js"

    "${CMAKE_CURRENT_SOURCE_DIR}/verification-code/ddddocr-helper.js"

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

# 打包合成的 js 文件
install(FILES "${JS_OUTPUT_FILE}"
    DESTINATION .
)
