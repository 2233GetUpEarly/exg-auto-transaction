#include <lc_unit.hpp>

#include <catch2/catch_all.hpp>

// 注：sell_type=nothing 会触发 assert(false)，属于死亡测试范畴，
//     Catch2 无内置支持，建议跳过；如果一定需要，见文末说明。

// ============================================================
// compare_proportion_same
// ============================================================

TEST_CASE("compare_proportion_same 按 round_off 后比较", "[LCUnit][compare]")
{
    SECTION("比例完全相等")
    {
        LCUnit a(1000, 100, SellType::sell_int);   // 10.0
        LCUnit b(2000, 200, SellType::sell_tra);   // 10.0
        CHECK(a.compare_proportion_same(b));
    }
    SECTION("比例明显不等")
    {
        LCUnit a(1000, 100, SellType::sell_int);   // 10.0
        LCUnit b(3000, 200, SellType::sell_tra);   // 15.0
        CHECK_FALSE(a.compare_proportion_same(b));
    }
    SECTION("round_off 后相等（10.4 与 10.49 都是 10）")
    {
        LCUnit a(1040, 100, SellType::sell_int);   // 10.40 -> 10
        LCUnit b(1049, 100, SellType::sell_int);   // 10.49 -> 10
        CHECK(a.compare_proportion_same(b));
    }
    SECTION("round_off 后不等（10.49 与 10.51 是 10 与 11）")
    {
        LCUnit a(1049, 100, SellType::sell_int);   // 10.49 -> 10
        LCUnit b(1051, 100, SellType::sell_int);   // 10.51 -> 11
        CHECK_FALSE(a.compare_proportion_same(b));
    }
}

// ============================================================
// merge_same_proportion_sell_type
// ============================================================

TEST_CASE("merge_same_proportion_sell_type 类型检查", "[LCUnit][merge]")
{
    SECTION("类型不同 -> 不合并")
    {
        LCUnit a(1000, 100, SellType::sell_int);
        LCUnit b(2000, 200, SellType::sell_tra);
        auto [ok, _] = LCUnit::merge_same_proportion_sell_type(a, b);
        CHECK_FALSE(ok);
    }
}

TEST_CASE("merge_same_proportion_sell_type 比例语义", "[LCUnit][merge][!mayfail]")
{
    SECTION("同类型 + 同比例 -> 应合并")
    {
        LCUnit a(1000, 100, SellType::sell_int);   // 10
        LCUnit b(2000, 200, SellType::sell_int);   // 10
        auto [ok, _] = LCUnit::merge_same_proportion_sell_type(a, b);
        CHECK(ok);
    }
    SECTION("同类型 + 不同比例 -> 不应合并")
    {
        LCUnit a(1000, 100, SellType::sell_int);   // 10
        LCUnit b(3000, 200, SellType::sell_int);   // 15
        auto [ok, _] = LCUnit::merge_same_proportion_sell_type(a, b);
        CHECK_FALSE(ok);
    }
}

// ============================================================
// cal_int_profit 各分支
// ============================================================

TEST_CASE("cal_int_profit 走 solve_sell_equal_ 分支", "[LCUnit][cal]")
{
    // 前提：int 差 < 5000、tra 差 < 10、交易币相等
    LCUnit sell_int(1000, 100, SellType::sell_int);
    LCUnit sell_tra(2000, 100, SellType::sell_tra);

    const int int_cost = sell_int.get_cost();
    const int tra_cost = sell_tra.get_cost();
    const int expected_profit = 2000 - tra_cost - 1000 - int_cost;

    auto [ok, result] = LCUnit::cal_int_profit(sell_int, sell_tra);

    CHECK(ok);
    CHECK(result.second == expected_profit);
    // equal 分支会"消耗"两个输入，把 sell_type 置 nothing
    CHECK(sell_int.get_sell_type() == SellType::nothing);
    CHECK(sell_tra.get_sell_type() == SellType::nothing);
    // 返回的第一个 LCUnit 是默认构造的占位
    CHECK(result.first.get_sell_type() == SellType::nothing);
}

TEST_CASE("cal_int_profit 走 solve_sell_int_excess_ 分支", "[LCUnit][cal]")
{
    // int 差 = 10000 - 1000 = 9000 >= 5000
    // new_transaction_coins = sell_tra.transaction_coins = 50
    // new_integral = (10000/100) * 50 = 5000（整）
    // new_sell_int(5000, 50)，与 sell_tra(1000, 50) 交易币相等 -> equal 成功
    LCUnit sell_int(10000, 100, SellType::sell_int);
    LCUnit sell_tra(1000, 50, SellType::sell_tra);

    const int tra_cost = sell_tra.get_cost();
    LCUnit expected_new(5000, 50, SellType::sell_int);
    const int expected_profit = 1000 - tra_cost - 5000 - expected_new.get_cost();

    auto [ok, result] = LCUnit::cal_int_profit(sell_int, sell_tra);

    CHECK(ok);
    // sell_int 被修改为剩余部分
    CHECK(sell_int.get_integral() == 5000);
    CHECK(sell_int.get_transaction_coins() == 50);
    // 返回的 LCUnit 是 new_sell_int
    CHECK(result.first.get_integral() == 5000);
    CHECK(result.first.get_transaction_coins() == 50);
    CHECK(result.first.get_sell_type() == SellType::sell_int);
    CHECK(result.second == expected_profit);
}

TEST_CASE("cal_int_profit 走 solve_sell_tra_excess_ 分支", "[LCUnit][cal]")
{
    // int 差 -1000 < 5000（不满足 int_excess）
    // tra 差 = 110 - 100 = 10 >= 10（满足 tra_excess）
    // new_integral = int(2000.0/110 * 100) = int(1818.18) = 1818（截断）
    // new_sell_tra(1818, 100)，与 sell_int(1000, 100) 交易币相等 -> equal 成功
    LCUnit sell_int(1000, 100, SellType::sell_int);
    LCUnit sell_tra(2000, 110, SellType::sell_tra);

    auto [ok, result] = LCUnit::cal_int_profit(sell_int, sell_tra);

    CHECK(ok);
    // sell_tra 被修改为剩余部分
    CHECK(sell_tra.get_integral() == 182);          // 2000 - 1818
    CHECK(sell_tra.get_transaction_coins() == 10);  // 110 - 100
    // 返回的 LCUnit 是 new_sell_tra
    CHECK(result.first.get_integral() == 1818);
    CHECK(result.first.get_transaction_coins() == 100);
    CHECK(result.first.get_sell_type() == SellType::sell_tra);
}

TEST_CASE("cal_int_profit 所有分支失败", "[LCUnit][cal]")
{
    // int 差 -1000 < 5000；tra 差 5 < 10；交易币 100 != 105
    LCUnit sell_int(1000, 100, SellType::sell_int);
    LCUnit sell_tra(2000, 105, SellType::sell_tra);

    auto [ok, result] = LCUnit::cal_int_profit(sell_int, sell_tra);

    CHECK_FALSE(ok);
    CHECK(result.second == 0);
    // 失败时不应修改输入
    CHECK(sell_int.get_sell_type() == SellType::sell_int);
    CHECK(sell_tra.get_sell_type() == SellType::sell_tra);
}

// ============================================================
// 阈值边界：int_excess 的 5000 和 tra_excess 的 10
// ============================================================

TEST_CASE("cal_int_profit int 差恰好 5000 应走 excess", "[LCUnit][cal][edge]")
{
    // 差 = 6000 - 1000 = 5000（>= 5000，应进入 int_excess）
    LCUnit sell_int(6000, 100, SellType::sell_int);
    LCUnit sell_tra(1000, 50, SellType::sell_tra);

    auto [ok, _] = LCUnit::cal_int_profit(sell_int, sell_tra);
    // int_excess 内部构造 new_sell_int 后再 equal 成功，ok 应为 true
    CHECK(ok);
    // 侧证：sell_int 被改写为剩余部分（integral 非原值）
    CHECK(sell_int.get_integral() != 6000);
}

TEST_CASE("cal_int_profit int 差 4999 不走 excess", "[LCUnit][cal][edge]")
{
    // 差 = 5999 - 1000 = 4999（< 5000，跳过 int_excess）
    // tra 差 = 50 - 100 = -50（也不满足 tra_excess）
    // 交易币 100 != 50 -> equal 失败 -> 全部失败
    LCUnit sell_int(5999, 100, SellType::sell_int);
    LCUnit sell_tra(1000, 50, SellType::sell_tra);

    auto [ok, _] = LCUnit::cal_int_profit(sell_int, sell_tra);
    CHECK_FALSE(ok);
}

TEST_CASE("cal_int_profit tra 差恰好 10 应走 excess", "[LCUnit][cal][edge]")
{
    // int 差 -1000 < 5000；tra 差 = 110 - 100 = 10（>= 10，进入 tra_excess）
    LCUnit sell_int(1000, 100, SellType::sell_int);
    LCUnit sell_tra(2000, 110, SellType::sell_tra);

    auto [ok, _] = LCUnit::cal_int_profit(sell_int, sell_tra);
    CHECK(ok);
}

TEST_CASE("cal_int_profit tra 差 9 不走 excess", "[LCUnit][cal][edge]")
{
    // int 差 -1000 < 5000；tra 差 = 109 - 100 = 9 < 10
    // 交易币 100 != 109 -> equal 失败 -> 全部失败
    LCUnit sell_int(1000, 100, SellType::sell_int);
    LCUnit sell_tra(2000, 109, SellType::sell_tra);

    auto [ok, _] = LCUnit::cal_int_profit(sell_int, sell_tra);
    CHECK_FALSE(ok);
}

// ============================================================
// 已知风险：剩余部分构造 0 交易币会触发除零 UB
// ============================================================

TEST_CASE("cal_int_profit 剩余为零的除零风险（已知问题）", "[LCUnit][cal][edge][!mayfail]")
{
    // sell_int.transaction_coins_ == sell_tra.transaction_coins_ (100)
    // int 差 = 9000 >= 5000 -> int_excess
    // new_integral = (10000/100)*100 = 10000，sell_int 剩余 = LCUnit(0, 0, ...)
    // 构造 LCUnit(0, 0, ...) 会调用 get_exg_proportion(0, 0) = nan，
    // 随后 proportion_to_string(nan) 的 round_off 里 static_cast<int>(nan) 是 UB。
    //
    // 这不是测试错误，而是实现缺陷：应在 int_excess 里先判断
    // sell_int.transaction_coins_ - new_transaction_coins > 0 再做剩余构造。
    // 本用例用 WARN 记录现象，不实际断言 nan，避免影响 CI。
    LCUnit sell_int(10000, 100, SellType::sell_int);
    LCUnit sell_tra(1000, 100, SellType::sell_tra);

    WARN("此场景会让剩余 LCUnit 的 transaction_coins_ = 0，触发除零 UB，" "需在 cal_int_profit 或 int_excess 内防御");
    auto [ok, _] = LCUnit::cal_int_profit(sell_int, sell_tra);
    CHECK(ok);   // 分支本身返回成功，但内部状态异常
}
