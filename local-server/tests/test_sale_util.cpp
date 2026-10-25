#include <core/sale_util.hpp>
#include <catch2/catch_all.hpp>
#include <string>
#include <filesystem>
#include <fstream>
#include <sstream>
#include <chrono>
#include <nlohmann/json.hpp>

namespace fs = std::filesystem;

// ---------- 文件辅助 ----------
static std::string read_file(const fs::path& p)
{
    std::ifstream f(p, std::ios::binary);
    std::ostringstream ss;
    ss << f.rdbuf();
    return ss.str();
}
static void write_file(const fs::path& p, const std::string& s)
{
    std::ofstream f(p, std::ios::binary);
    f << s;
}

// ---------- 临时项目目录（RAII）----------
// 目录布局：
//   <root>/work/                 <- 测试进程 cwd
//   <root>/data/                 <- 被测代码里的 "../data/"
//   <root>/ledger-calculation/   <- 假 exe 放这里
struct ScopedProjectDir
{
    fs::path root;
    fs::path prev_cwd;

    ScopedProjectDir()
    {
        auto uniq = std::to_string(
            std::chrono::steady_clock::now().time_since_epoch().count());
        root = fs::temp_directory_path() / ("sale_test_" + uniq);
        fs::create_directories(root / "data");
        fs::create_directories(root / "work");
        prev_cwd = fs::current_path();
        fs::current_path(root / "work");
    }
    ~ScopedProjectDir()
    {
        std::error_code ec;
        fs::current_path(prev_cwd, ec);
        fs::remove_all(root, ec);   // 析构不能抛
    }
    fs::path data() const { return root / "data"; }
};

//  execute_ledger_calculation

#if defined(__linux__)
TEST_CASE("execute_ledger_calculation - 假 exe 成功路径", "[sale][integration]")
{
    ScopedProjectDir env;
    write_file(env.data() / "sale_data.txt", "sale content\n");

    // 造一个返回 0 的假 exe： ../ledger-calculation/ledger_calculation
    auto exe = env.root / "ledger-calculation" / "ledger_calculation";
    fs::create_directories(exe.parent_path());
    write_file(exe, "#!/bin/sh\nexit 0\n");
    fs::permissions(exe,
        fs::perms::owner_all | fs::perms::group_exec | fs::perms::others_exec);

    execute_ledger_calculation();

    // 核心断言：sale_data.txt -> input_data.txt 的搬运是对的
    REQUIRE(fs::exists(env.data() / "input_data.txt"));
    REQUIRE(read_file(env.data() / "input_data.txt") == "sale content\n");
}

TEST_CASE("execute_ledger_calculation - 假 exe 返回非 0", "[sale][integration]")
{
    ScopedProjectDir env;
    write_file(env.data() / "sale_data.txt", "x\n");

    auto exe = env.root / "ledger-calculation" / "ledger_calculation";
    fs::create_directories(exe.parent_path());
    write_file(exe, "#!/bin/sh\nexit 3\n");
    fs::permissions(exe,
        fs::perms::owner_all | fs::perms::group_exec | fs::perms::others_exec);

    // 函数本身无返回值，只能断言"不崩"；想断言 exit_code 需要重构（见问题 6）
    REQUIRE_NOTHROW(execute_ledger_calculation());
}

TEST_CASE("execute_ledger_calculation - exe 不存在", "[sale][integration]")
{
    ScopedProjectDir env;
    write_file(env.data() / "sale_data.txt", "x\n");
    // 不创建 ../ledger-calculation/
    REQUIRE_NOTHROW(execute_ledger_calculation());
    // input_data.txt 应该还是被写出来了（搬运发生在 fork 之前）
    REQUIRE(fs::exists(env.data() / "input_data.txt"));
}
#endif

// save_latest_time_attribute_to_file

TEST_CASE("save_latest_time_attribute_to_file", "[sale]")
{
    ScopedProjectDir env;

    SECTION("写入合法 JSON，能被回读")
    {
        save_latest_time_attribute_to_file("2024-01-01T00:00:00");
        auto j = nlohmann::json::parse(
            read_file(env.data() / "sale_attribute.json"));
        REQUIRE(j["latest_time"] == "2024-01-01T00:00:00");
    }

    SECTION("空字符串也能写入")
    {
        save_latest_time_attribute_to_file("");
        auto j = nlohmann::json::parse(
            read_file(env.data() / "sale_attribute.json"));
        REQUIRE(j["latest_time"] == "");
    }

    SECTION("覆盖旧值")
    {
        write_file(env.data() / "sale_attribute.json",
            R"({"latest_time":"old","extra":1})");
        save_latest_time_attribute_to_file("2024-01-02T00:00:00");
        auto j = nlohmann::json::parse(
            read_file(env.data() / "sale_attribute.json"));
        REQUIRE(j["latest_time"] == "2024-01-02T00:00:00");
        // 注意：这里会丢弃 extra 字段（函数每次重写整个文件）
    }
}


// save_sale_data_to_file

TEST_CASE("save_sale_data_to_file", "[sale]")
{
    ScopedProjectDir env;

    SECTION("正常写入，内容一致")
    {
        save_sale_data_to_file("hello\nworld\n");
        REQUIRE(read_file(env.data() / "sale_data.txt") == "hello\nworld\n");
    }

    SECTION("写空字符串也会创建文件")
    {
        save_sale_data_to_file("");
        REQUIRE(fs::exists(env.data() / "sale_data.txt"));
        REQUIRE(read_file(env.data() / "sale_data.txt").empty());
    }

    SECTION("覆盖已有文件")
    {
        write_file(env.data() / "sale_data.txt", "old content");
        save_sale_data_to_file("new content");
        REQUIRE(read_file(env.data() / "sale_data.txt") == "new content");
    }
}


// remove_already_calculate_data

TEST_CASE("remove_already_calculate_data", "[sale]")
{
    ScopedProjectDir env;

    auto setup_attr = [&](const std::string& latest) {
        write_file(env.data() / "sale_attribute.json",
            nlohmann::json{ { "latest_time", latest } }.dump());
        };

    SECTION("匹配在第4行 -> 保留第1行")
    {
        setup_attr("2024-01-04T00:00:00");
        std::string s =
            "line1\n"
            "line2\n"
            "line3\n"
            "2024-01-04T00:00:00\n"
            "line5\n";
        remove_already_calculate_data(s);
        REQUIRE(s == "line1\n");
    }

    SECTION("匹配在第3行 -> 全清空")
    {
        setup_attr("2024-01-03T00:00:00");
        std::string s =
            "line1\n"
            "line2\n"
            "2024-01-03T00:00:00\n"
            "line4\n";
        remove_already_calculate_data(s);
        REQUIRE(s.empty());
    }

    SECTION("匹配在第1行 -> 全清空")
    {
        setup_attr("2024-01-01T00:00:00");
        std::string s = "2024-01-01T00:00:00\nx\ny\n";
        remove_already_calculate_data(s);
        REQUIRE(s.empty());
    }

    SECTION("匹配在第2行 -> 全清空")
    {
        setup_attr("2024-01-02T00:00:00");
        std::string s = "line1\n2024-01-02T00:00:00\nrest\n";
        remove_already_calculate_data(s);
        REQUIRE(s.empty());
    }

    SECTION("找不到匹配 -> 原样返回")
    {
        setup_attr("2099-01-01T00:00:00");
        std::string s = "a\nb\nc\n";
        remove_already_calculate_data(s);
        REQUIRE(s == "a\nb\nc\n");
    }

    SECTION("空字符串 -> 不动")
    {
        setup_attr("2024-01-01T00:00:00");
        std::string s;
        remove_already_calculate_data(s);
        REQUIRE(s.empty());
    }

    SECTION("sale_attribute.json 不存在 -> 原样返回（只 LOG，不崩）")
    {
        std::string s = "a\nb\nc\n";
        remove_already_calculate_data(s);
        REQUIRE(s == "a\nb\nc\n");
    }

    SECTION("sale_attribute.json 非法 JSON -> 当前实现会抛异常")
    {
        write_file(env.data() / "sale_attribute.json", "not json");
        std::string s = "a\nb\nc\n";
        // 这是"记录当前行为"的测试；建议实现里加 try/catch 后改成 REQUIRE_NOTHROW
        REQUIRE_THROWS(remove_already_calculate_data(s));
    }

    SECTION("JSON 缺 latest_time 字段 -> 当前实现会抛异常")
    {
        write_file(env.data() / "sale_attribute.json", R"({"other":"x"})");
        std::string s = "a\nb\nc\n";
        REQUIRE_THROWS(remove_already_calculate_data(s));
    }
}

// CRLF 输入 —— 当前实现有 bug（getline 会把 '\r' 留在行尾）
TEST_CASE("remove_already_calculate_data - CRLF", "[sale][!shouldfail]")
{
    ScopedProjectDir env;
    write_file(env.data() / "sale_attribute.json",
        nlohmann::json{ { "latest_time", "2024-01-03T00:00:00" } }.dump());

    std::string s =
        "line1\r\n"
        "line2\r\n"
        "line3\r\n"
        "2024-01-03T00:00:00\r\n"
        "line5\r\n";

    remove_already_calculate_data(s);

    // 期望删匹配行及前两行 -> "line1\r\n"
    // 实际：line == already_calculate_time 因 '\r' 失败，s 不变
    REQUIRE(s == "line1\r\n");
}

// get_sale_latest_time

// ---------------------------------------------------------------------------
// 1. 正常路径
// ---------------------------------------------------------------------------
TEST_CASE("get_sale_latest_time - normal cases", "[sale_time]")
{
    SECTION("单行仅含时间")
    {
        REQUIRE(get_sale_latest_time("2024-01-15T10:30:45")
            == "2024-01-15T10:30:45");
    }

    SECTION("时间前后有其他内容")
    {
        REQUIRE(get_sale_latest_time("销售时间: 2024-01-15T10:30:45 状态: OK")
            == "2024-01-15T10:30:45");
    }

    SECTION("多行，返回第一行的时间（即“最新”）")
    {
        std::string s =
            "2024-01-15T10:30:45\n"
            "2024-01-16T11:00:00\n"
            "2024-01-17T12:00:00";
        REQUIRE(get_sale_latest_time(s) == "2024-01-15T10:30:45");
    }

    SECTION("第一行无时间，取第二行")
    {
        std::string s =
            "header line\n"
            "2024-02-20T08:15:30 tail";
        REQUIRE(get_sale_latest_time(s) == "2024-02-20T08:15:30");
    }

    SECTION("同一行出现多个时间，返回第一个匹配")
    {
        REQUIRE(get_sale_latest_time("2024-01-01T00:00:00 / 2025-12-31T23:59:59")
            == "2024-01-01T00:00:00");
    }

    SECTION("CRLF 换行")
    {
        std::string s = "2024-05-01T08:00:00\r\n2024-06-01T09:00:00\r\n";
        REQUIRE(get_sale_latest_time(s) == "2024-05-01T08:00:00");
    }
}

// ---------------------------------------------------------------------------
// 2. 空 / 无匹配
// ---------------------------------------------------------------------------
TEST_CASE("get_sale_latest_time - empty and no match", "[sale_time]")
{
    SECTION("空字符串")
    {
        REQUIRE(get_sale_latest_time("").empty());
    }

    SECTION("只有换行")
    {
        REQUIRE(get_sale_latest_time("\n\n\n").empty());
    }

    SECTION("没有时间格式的内容")
    {
        REQUIRE(get_sale_latest_time("hello world, no time here").empty());
    }

    SECTION("只有日期没有时间")
    {
        REQUIRE(get_sale_latest_time("2024-01-15").empty());
    }

    SECTION("只有时间没有日期")
    {
        REQUIRE(get_sale_latest_time("10:30:45").empty());
    }

    SECTION("缺少 T 分隔符（用空格分隔）")
    {
        REQUIRE(get_sale_latest_time("2024-01-15 10:30:45").empty());
    }
}

// ---------------------------------------------------------------------------
// 3. 格式边界 —— 位数不对不应匹配
// ---------------------------------------------------------------------------
TEST_CASE("get_sale_latest_time - format boundaries", "[sale_time]")
{
    SECTION("月份位数不足")
    {
        REQUIRE(get_sale_latest_time("2024-1-15T10:30:45").empty());
    }

    SECTION("小时位数不足")
    {
        REQUIRE(get_sale_latest_time("2024-01-15T1:30:45").empty());
    }

    SECTION("秒位数不足")
    {
        REQUIRE(get_sale_latest_time("2024-01-15T10:30:5").empty());
    }

    SECTION("分隔符错误")
    {
        REQUIRE(get_sale_latest_time("2024/01/15T10:30:45").empty());
        REQUIRE(get_sale_latest_time("2024-01-15T10-30-45").empty());
    }
}

// ---------------------------------------------------------------------------
// 4. 正则的“宽松”行为：只校验位数，不校验范围
// ---------------------------------------------------------------------------
TEST_CASE("get_sale_latest_time - regex does not validate ranges",
    "[sale_time][documenting]")
{
    // 当前正则 \d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2} 只看位数，
    // 非法月/日/时也会被匹配；这是现有实现的已知行为。
    SECTION("非法数值也会被匹配")
    {
        REQUIRE(get_sale_latest_time("9999-99-99T99:99:99") == "9999-99-99T99:99:99");
    }
}

// ---------------------------------------------------------------------------
// 5. 时间格式周边扩展
// ---------------------------------------------------------------------------
TEST_CASE("get_sale_latest_time - surrounding format variants", "[sale_time]")
{
    SECTION("带毫秒只截取到秒")
    {
        REQUIRE(get_sale_latest_time("2024-01-15T10:30:45.123")
            == "2024-01-15T10:30:45");
    }

    SECTION("带 Z 时区")
    {
        REQUIRE(get_sale_latest_time("2024-01-15T10:30:45Z")
            == "2024-01-15T10:30:45");
    }

    SECTION("带 +08:00 时区")
    {
        REQUIRE(get_sale_latest_time("2024-01-15T10:30:45+08:00")
            == "2024-01-15T10:30:45");
    }

    SECTION("中文前缀 / 后缀")
    {
        REQUIRE(get_sale_latest_time("最新销售时间：2024-03-01T09:00:00，")
            == "2024-03-01T09:00:00");
    }
}

// ---------------------------------------------------------------------------
// 6. 跨行不会匹配（因为逐行 regex_search）
// ---------------------------------------------------------------------------
TEST_CASE("get_sale_latest_time - cross line not matched", "[sale_time]")
{
    SECTION("时间被换行拆开")
    {
        REQUIRE(get_sale_latest_time("2024-01-15T10:30\n:45").empty());
    }

    SECTION("日期与时间分属两行")
    {
        REQUIRE(get_sale_latest_time("2024-01-15\nT10:30:45").empty());
    }
}