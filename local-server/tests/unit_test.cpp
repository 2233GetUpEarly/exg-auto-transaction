#include <task/sale_data_handle.hpp>
#include <thread>
#include <fstream>
#include <filesystem>

#include <catch2/catch_all.hpp>
#include <catch2/matchers/catch_matchers_string.hpp>

#ifdef _WIN32
#include <Windows.h>
#endif

namespace fs = std::filesystem;
using Catch::Matchers::ContainsSubstring;

// RAII：把进程工作目录切到 <tmp>/work，使 ../data/ 指向 <tmp>/data
class TempWorkDir
{
public:

	TempWorkDir()
	{
		old_cwd_ = fs::current_path();
		root_ = fs::temp_directory_path() /
			("sale_test_" + std::to_string(::getpid()) + "_" +
				std::to_string(counter_++));

		fs::create_directories(root_ / "work");
		fs::create_directories(root_ / "data");
		fs::current_path(root_ / "work");
	}

	~TempWorkDir()
	{
		std::error_code ec;
		fs::current_path(old_cwd_, ec);
		fs::remove_all(root_, ec);
	}

	fs::path data_dir() const
	{
		return root_ / "data";
	}

private:

	fs::path old_cwd_;
	fs::path root_;
	static inline int counter_ = 0;
};

static std::string read_file(const fs::path& p)
{
	std::ifstream f(p);
	if (!f) return {};
	return std::string((std::istreambuf_iterator<char>(f)),
		std::istreambuf_iterator<char>());
}

static void write_file(const fs::path& p, const std::string& content)
{
	std::ofstream f(p);
	f << content;
}

TEST_CASE("task 缺少必需 key 时提前返回", "[SaleDataHandle][task]")
{
    TempWorkDir env;
    SaleDataHandle h;

    SECTION("缺 eat_type")
	{
        nlohmann::json j = { {"eat_data", "some data\n"} };
        REQUIRE_NOTHROW(h.task(j));
        REQUIRE_FALSE(fs::exists(env.data_dir() / "sale_data.txt"));
        REQUIRE_FALSE(fs::exists(env.data_dir() / "sale_attribute.json"));
    }
    SECTION("缺 eat_data")
	{
        nlohmann::json j = { {"eat_type", 1} };
        REQUIRE_NOTHROW(h.task(j));
        REQUIRE_FALSE(fs::exists(env.data_dir() / "sale_data.txt"));
    }
    SECTION("两个 key 都缺")
	{
        nlohmann::json j = nlohmann::json::object();
        REQUIRE_NOTHROW(h.task(j));
        REQUIRE_FALSE(fs::exists(env.data_dir() / "sale_data.txt"));
    }
}

TEST_CASE("task 无时间格式时 attribute 为空", "[SaleDataHandle][task]")
{
	TempWorkDir env;
	SaleDataHandle h;

	nlohmann::json j = { {"eat_type", 1}, {"eat_data", "no timestamp here\n"} };
	REQUIRE_NOTHROW(h.task(j));

	REQUIRE_THAT(read_file(env.data_dir() / "sale_attribute.json"),
		ContainsSubstring(R"("latest_time":"")"));
}

TEST_CASE("task 无匹配行时不裁剪", "[SaleDataHandle][task]")
{
	TempWorkDir env;
	SaleDataHandle h;

	write_file(env.data_dir() / "sale_attribute.json",
		R"({"latest_time":"2026-01-01T00:00:00"})");

	std::string sale_data = "alpha\nbeta\n2026-10-16T11:00:00\n";
	nlohmann::json j = { {"eat_type", 1}, {"eat_data", sale_data} };
	REQUIRE_NOTHROW(h.task(j));

	REQUIRE(read_file(env.data_dir() / "sale_data.txt") == sale_data);
}

int main(int argc, char* argv[])
{
#ifdef _WIN32
	SetConsoleOutputCP(65001);
	SetConsoleCP(65001);
#endif

	return Catch::Session().run(argc, argv);
}
