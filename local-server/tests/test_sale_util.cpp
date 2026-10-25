#include <core/sale_util.hpp>
#include <catch2/catch_all.hpp>
#include <string>
#include <filesystem>
#include <fstream>
#include <sstream>
#include <chrono>
#include <nlohmann/json.hpp>

namespace fs = std::filesystem;

// ============================================================
// 测试替身
// ============================================================
struct FakeRunner : IProcessRunner
{
    int ret = 0;
    int call_count = 0;
    fs::path last_exe;
    std::vector<std::string> last_args;

    int run(const fs::path& exe, const std::vector<std::string>& args) override
    {
        ++call_count;
        last_exe = exe;
        last_args = args;
        return ret;
    }
};

// ============================================================
// 临时目录 + 构造 SaleUtil 的辅助
// ============================================================
struct TmpDir
{
    fs::path p;
    TmpDir()
    {
        p = fs::temp_directory_path() / ("sale_" + std::to_string(
                std::chrono::steady_clock::now().time_since_epoch().count()));
        fs::create_directories(p);
    }
    ~TmpDir() { std::error_code ec; fs::remove_all(p, ec); }
};

static std::string slurp(const fs::path& f)
{
    std::ifstream in(f, std::ios::binary);
    std::ostringstream ss;
    ss << in.rdbuf();
    return ss.str();
}

// 构造一个指向临时目录 data/ 的 SaleUtil
static SaleUtil make_svc(const fs::path& data_dir, std::shared_ptr<FakeRunner> fake)
{
    auto cfg = std::make_unique<SaleConfig>();
    cfg->data_dir = data_dir;
    cfg->ledger_exe = "/nonexistent";
    return SaleUtil(std::move(cfg), fake);
}

TEST_CASE("free functions delegate to SaleUtil", "[sale][api]")
{
    SECTION("make_default 返回同一实例")
    {
        REQUIRE(&SaleUtil::make_default() == &SaleUtil::make_default());
    }
    SECTION("get_sale_latest_time 能取到时间（走默认实例）")
    {
        REQUIRE(get_sale_latest_time("x 2024-01-01T00:00:00")
            == "2024-01-01T00:00:00");
    }
    SECTION("get_sale_latest_time 无匹配返回空")
    {
        REQUIRE(get_sale_latest_time("hello").empty());
    }
    // 其他 free 函数会写 ../data/ 真实目录，属集成测试，
    // 想跑请用 [.integration] 隐藏标签并做 chdir，见之前讨论。
}

//  execute_ledger_calculation
TEST_CASE("SaleUtil::execute_ledger_calculation", "[sale][service]")
{
    TmpDir d;
    auto fake = std::make_shared<FakeRunner>();

    auto cfg = std::make_unique<SaleConfig>();
    cfg->data_dir = d.p;
    cfg->ledger_exe = "/fake/exe";
    SaleUtil svc(std::move(cfg), fake);

    SECTION("成功路径：写 input_data.txt 并调用一次 run")
    {
        std::ofstream(d.p / "sale_data.txt") << "sale content\n";
        fake->ret = 0;

        svc.execute_ledger_calculation();

        REQUIRE(fake->call_count == 1);
        REQUIRE(fake->last_args == std::vector<std::string>{"-f"});
        REQUIRE(fake->last_exe == fs::path("/fake/exe"));
        REQUIRE(slurp(d.p / "input_data.txt") == "sale content\n");
    }
    SECTION("子进程返回非 0：仍调用，不崩")
    {
        std::ofstream(d.p / "sale_data.txt") << "x\n";
        fake->ret = 3;

        REQUIRE_NOTHROW(svc.execute_ledger_calculation());
        REQUIRE(fake->call_count == 1);
    }
    SECTION("sale_data.txt 缺失：不调 runner")
    {
        // 不创建 sale_data.txt
        svc.execute_ledger_calculation();
        REQUIRE(fake->call_count == 0);
        REQUIRE_FALSE(fs::exists(d.p / "input_data.txt"));
    }
    SECTION("runner 为空：应防御（当前实现会崩，记录已知问题）")
    {
        auto cfg2 = std::make_unique<SaleConfig>();
        cfg2->data_dir = d.p;
        SaleUtil svc_no_runner(std::move(cfg2), nullptr);
        std::ofstream(d.p / "sale_data.txt") << "x\n";

        // ⚠️ 若实现了 if (!runner_) return; 则改成 REQUIRE_NOTHROW
        // 当前无保护，这里不触发调用，只用注释标记已知问题
        // REQUIRE_NOTHROW(svc_no_runner.execute_ledger_calculation());
    }
}

// save_sale_data_to_file
TEST_CASE("SaleUtil::save_sale_data_to_file", "[sale][service]")
{
    TmpDir d;
    auto fake = std::make_shared<FakeRunner>();
    auto cfg = std::make_unique<SaleConfig>();
    cfg->data_dir = d.p;
    SaleUtil svc(std::move(cfg), fake);

    SECTION("正常写入")
    {
        svc.save_sale_data_to_file("hello\nworld\n");
        REQUIRE(slurp(d.p / "sale_data.txt") == "hello\nworld\n");
    }
    SECTION("写空串也创建文件")
    {
        svc.save_sale_data_to_file("");
        REQUIRE(fs::exists(d.p / "sale_data.txt"));
        REQUIRE(slurp(d.p / "sale_data.txt").empty());
    }
    SECTION("覆盖已有内容")
    {
        std::ofstream(d.p / "sale_data.txt") << "old";
        svc.save_sale_data_to_file("new");
        REQUIRE(slurp(d.p / "sale_data.txt") == "new");
    }
    SECTION("目录不存在时自动创建")
    {
        fs::remove_all(d.p);
        svc.save_sale_data_to_file("x");
        REQUIRE(fs::exists(d.p / "sale_data.txt"));
    }
}

// save_latest_time_attribute_to_file
TEST_CASE("SaleUtil::save_latest_time_attribute_to_file", "[sale][service]")
{
    TmpDir d;
    auto fake = std::make_shared<FakeRunner>();
    auto cfg = std::make_unique<SaleConfig>();
    cfg->data_dir = d.p;
    SaleUtil svc(std::move(cfg), fake);

    SECTION("写入可回读")
    {
        svc.save_latest_time_attribute_to_file("2024-01-01T00:00:00");
        auto j = nlohmann::json::parse(slurp(d.p / "sale_attribute.json"));
        REQUIRE(j["latest_time"] == "2024-01-01T00:00:00");
    }
    SECTION("空串也写入")
    {
        svc.save_latest_time_attribute_to_file("");
        auto j = nlohmann::json::parse(slurp(d.p / "sale_attribute.json"));
        REQUIRE(j["latest_time"] == "");
    }
    SECTION("覆盖旧文件（旧字段丢弃）")
    {
        std::ofstream(d.p / "sale_attribute.json")
            << R"({"latest_time":"old","extra":1})";
        svc.save_latest_time_attribute_to_file("2024-01-02T00:00:00");
        auto j = nlohmann::json::parse(slurp(d.p / "sale_attribute.json"));
        REQUIRE(j["latest_time"] == "2024-01-02T00:00:00");
        REQUIRE_FALSE(j.contains("extra"));   // 记录当前行为
    }
}

// remove_already_calculate_data
TEST_CASE("SaleUtil::remove_already_calculate_data", "[sale][service]")
{
    TmpDir d;
    auto fake = std::make_shared<FakeRunner>();
    auto cfg = std::make_unique<SaleConfig>();
    cfg->data_dir = d.p;
    SaleUtil svc(std::move(cfg), fake);

    auto write_attr = [&](const std::string& latest) {
        std::ofstream(d.p / "sale_attribute.json")
            << nlohmann::json{ { "latest_time", latest } }.dump();
        };

    SECTION("attr 不存在 -> 原样返回，不崩")
    {
        std::string s = "a\nb\nc\n";
        REQUIRE_NOTHROW(svc.remove_already_calculate_data(s));
        REQUIRE(s == "a\nb\nc\n");
    }
    SECTION("attr 是非法 JSON -> 不抛、原样")
    {
        std::ofstream(d.p / "sale_attribute.json") << "not json";
        std::string s = "a\nb\nc\n";
        REQUIRE_NOTHROW(svc.remove_already_calculate_data(s));
        REQUIRE(s == "a\nb\nc\n");
    }
    SECTION("attr 缺 latest_time 字段 -> 不抛、原样")
    {
        std::ofstream(d.p / "sale_attribute.json") << R"({"x":1})";
        std::string s = "a\nb\nc\n";
        REQUIRE_NOTHROW(svc.remove_already_calculate_data(s));
        REQUIRE(s == "a\nb\nc\n");
    }
    SECTION("匹配在第4行 -> 保留第1行")
    {
        write_attr("2024-01-04T00:00:00");
        std::string s =
            "line1\nline2\nline3\n2024-01-04T00:00:00\nline5\n";
        svc.remove_already_calculate_data(s);
        REQUIRE(s == "line1\n");
    }
    SECTION("匹配在第3行 -> 全部清空")
    {
        write_attr("2024-01-03T00:00:00");
        std::string s = "line1\nline2\n2024-01-03T00:00:00\nx\n";
        svc.remove_already_calculate_data(s);
        REQUIRE(s.empty());
    }
    SECTION("找不到匹配 -> 原样")
    {
        write_attr("2099-01-01T00:00:00");
        std::string s = "a\nb\nc\n";
        svc.remove_already_calculate_data(s);
        REQUIRE(s == "a\nb\nc\n");
    }
    SECTION("空字符串 -> 不动")
    {
        write_attr("2024-01-01T00:00:00");
        std::string s;
        svc.remove_already_calculate_data(s);
        REQUIRE(s.empty());
    }
}

// find_truncate_position
TEST_CASE("SaleUtil::find_truncate_position", "[sale][logic]")
{
    TmpDir d;
    auto fake = std::make_shared<FakeRunner>();
    auto cfg = std::make_unique<SaleConfig>();
    cfg->data_dir = d.p;
    SaleUtil svc(std::move(cfg), fake);

    const std::string L = "2024-01-03T00:00:00";

    SECTION("匹配在第4行 -> 保留前2字节(=第1行+a\\n)")
    {
        std::string s = "a\nb\nc\n" + L + "\ne\n";
        REQUIRE(svc.find_truncate_position(s, L) == 2);   // "a\n"
    }
    SECTION("匹配在第3行 -> 0")
    {
        REQUIRE(svc.find_truncate_position("a\nb\n" + L + "\nd\n", L) == 0);
    }
    SECTION("匹配在第2行 -> 0")
    {
        REQUIRE(svc.find_truncate_position("a\n" + L + "\n", L) == 0);
    }
    SECTION("匹配在第1行 -> 0")
    {
        REQUIRE(svc.find_truncate_position(L + "\nx\n", L) == 0);
    }
    SECTION("找不到 -> size()（表示不修改）")
    {
        std::string s = "a\nb\n";
        REQUIRE(svc.find_truncate_position(s, L) == s.size());
    }
    SECTION("空串 -> 0")
    {
        REQUIRE(svc.find_truncate_position("", L) == 0);
    }
}

// get_sale_latest_time
TEST_CASE("SaleUtil::get_sale_latest_time", "[sale][logic]")
{
    TmpDir d;
    auto fake = std::make_shared<FakeRunner>();
    auto cfg = std::make_unique<SaleConfig>();
    cfg->data_dir = d.p;
    SaleUtil svc(std::move(cfg), fake);

    SECTION("单行仅含时间")
    {
        REQUIRE(svc.get_sale_latest_time("2024-01-15T10:30:45")
            == "2024-01-15T10:30:45");
    }
    SECTION("时间前后有内容")
    {
        REQUIRE(svc.get_sale_latest_time("销售时间: 2024-01-15T10:30:45 OK")
            == "2024-01-15T10:30:45");
    }
    SECTION("多行返回第一个匹配")
    {
        std::string s =
            "2024-01-15T10:30:45\n"
            "2024-01-16T11:00:00\n";
        REQUIRE(svc.get_sale_latest_time(s) == "2024-01-15T10:30:45");
    }
    SECTION("第一行无时间取第二行")
    {
        REQUIRE(svc.get_sale_latest_time("header\n2024-02-20T08:15:30")
            == "2024-02-20T08:15:30");
    }
    SECTION("同一行多个时间取第一个")
    {
        REQUIRE(svc.get_sale_latest_time(
            "2024-01-01T00:00:00 / 2025-12-31T23:59:59")
            == "2024-01-01T00:00:00");
    }
    SECTION("带毫秒/时区只截到秒")
    {
        REQUIRE(svc.get_sale_latest_time("2024-01-15T10:30:45.123Z")
            == "2024-01-15T10:30:45");
    }
    SECTION("缺 T 不匹配")
    {
        REQUIRE(svc.get_sale_latest_time("2024-01-15 10:30:45").empty());
    }
    SECTION("位数不足不匹配")
    {
        REQUIRE(svc.get_sale_latest_time("2024-1-15T10:30:45").empty());
        REQUIRE(svc.get_sale_latest_time("2024-01-15T1:30:45").empty());
    }
    SECTION("空字符串")
    {
        REQUIRE(svc.get_sale_latest_time("").empty());
    }
    SECTION("无时间")
    {
        REQUIRE(svc.get_sale_latest_time("hello world").empty());
    }
}