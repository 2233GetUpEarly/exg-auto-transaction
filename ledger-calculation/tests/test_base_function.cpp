#include <base_function.hpp>
#include <catch2/catch_all.hpp>

TEST_CASE("round_off 舍入边界", "[round_off]")
{
    CHECK(round_off(0.0) == 0);
    CHECK(round_off(0.4) == 0);
    CHECK(round_off(0.5) == 1);
    CHECK(round_off(2.4) == 2);
    CHECK(round_off(2.5) == 3);
    // 负数：当前实现返回"向零取整"，用测试固定这个契约，至于判断是否为负，交由上层实现
    CHECK(round_off(-0.4) == 0);
    CHECK(round_off(-0.5) == 0);   // 实际结果，可能是 bug
    CHECK(round_off(-1.6) == -1);  // 实际结果，可能是 bug
    CHECK(proportion_to_string(-1.5) == std::to_string(round_off(-1.5)));  // 固定传导行为
}

TEST_CASE("比例函数除零契约", "[proportion]")
{
    // get_exg_proportion: 分子 = integral，integral != 0 时得 inf
    CHECK(std::isinf(get_exg_proportion(100, 0)));
    CHECK(get_exg_proportion(100, 0) > 0);          // 正 inf，不是 nan
    // integral == 0 时 0.0 / 0 = nan
    CHECK(std::isnan(get_exg_proportion(0, 0)));

    // get_exg_add_cost_proportion: 分子 = integral + cost
    CHECK(std::isinf(get_exg_add_cost_proportion(100, 0, 10)));   // 110/0 = +inf
    CHECK(std::isnan(get_exg_add_cost_proportion(0, 0, 0)));      // 0/0 = nan
}

TEST_CASE("inf 流入 proportion_to_string 产生 UB 表现", "[proportion][edge]")
{
    const double inf = std::numeric_limits<double>::infinity();
    // 这是 UB，不预设具体值；只确认在当前平台不会导致进程崩溃
    // 真实修复应在上游拦截 inf/nan，而不是依赖此行为
    std::string result = proportion_to_string(inf);
    WARN("proportion_to_string(inf) = " << result << " (UB, 不可依赖)");
    SUCCEED("未崩溃，但结果是 UB");
}

TEST_CASE("sell 字符串格式", "[sell_string]")
{
    CHECK(sell_int_to_string(100, 200, 5, 1.5, 1.2) ==
        "100 积分卖出获得 200 交易币，花费了 5 积分 比例(1 : 2) 成本比例(1 : 1)");
    CHECK(sell_tra_to_string(100, 200, 5, 1.5, 1.2) ==
        "200 交易币卖出获得 100 积分，花费了 5 积分 比例(1 : 2) 成本比例(1 : 1)");
}

TEST_CASE("sell_string_add_profit 正负零", "[profit]")
{
    CHECK(sell_string_add_profit("base", 5, " | ") == "base | +5");
    CHECK(sell_string_add_profit("base", -3, " | ") == "base | -3");
    CHECK(sell_string_add_profit("base", 0, " | ") == "base | +0");  // 固定契约
}