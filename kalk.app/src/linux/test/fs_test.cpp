#include "../fs.h"

#include <glib.h>
#include <json-glib/json-glib.h>
#include <unistd.h>

#include <filesystem>
#include <string>

namespace fs = std::filesystem;

static int failures = 0;

#define CHECK(condition) do { if (!(condition)) { g_printerr("FAIL %s:%d %s\n", __FILE__, __LINE__, #condition); failures++; } } while (0)

static JsonNode* str_node (const std::string& value)
{
    JsonNode* node = json_node_new(JSON_NODE_VALUE);
    json_node_set_string(node, value.c_str());
    return node;
}

static JsonArray* args1 (const std::string& a)
{
    JsonArray* args = json_array_new();
    json_array_add_element(args, str_node(a));
    return args;
}

static JsonArray* args2 (const std::string& a, const std::string& b)
{
    JsonArray* args = json_array_new();
    json_array_add_element(args, str_node(a));
    json_array_add_element(args, str_node(b));
    return args;
}

static JsonNode* call (const std::string& req, JsonArray* args)
{
    JsonNode* node = fs_route(req, args);
    json_array_unref(args);
    return node;
}

static void write_file (const fs::path& path, const std::string& text)
{
    g_file_set_contents(path.c_str(), text.c_str(), -1, nullptr);
}

int main ()
{
    fs::path root = fs::path(g_get_tmp_dir()) / ("kalk-fs-test-" + std::to_string(getpid()));
    fs::remove_all(root);

    JsonNode* node = call("mkdir", args1(root.string()));
    CHECK(JSON_NODE_HOLDS_VALUE(node) && json_node_get_string(node) == root.string());
    json_node_unref(node);

    fs::path file = root / "a.txt";
    fs::path copy = root / "copy.txt";
    fs::path moved = root / "moved.txt";

    node = call("write", args2(file.string(), "hello"));
    CHECK(JSON_NODE_HOLDS_VALUE(node) && json_node_get_string(node) == file.string());
    json_node_unref(node);

    node = call("read", args1(file.string()));
    CHECK(JSON_NODE_HOLDS_VALUE(node) && std::string(json_node_get_string(node)) == "hello");
    json_node_unref(node);

    node = call("exists", args1(file.string()));
    CHECK(json_node_get_boolean(node));
    json_node_unref(node);

    node = call("fileExists", args1(file.string()));
    CHECK(json_node_get_boolean(node));
    json_node_unref(node);

    node = call("dirExists", args1(root.string()));
    CHECK(json_node_get_boolean(node));
    json_node_unref(node);

    node = call("list", args1(root.string()));
    CHECK(JSON_NODE_HOLDS_ARRAY(node));
    CHECK(json_array_get_length(json_node_get_array(node)) == 1);
    json_node_unref(node);

    node = call("copy", args2(file.string(), copy.string()));
    CHECK(JSON_NODE_HOLDS_VALUE(node) && json_node_get_string(node) == copy.string());
    json_node_unref(node);

    node = call("move", args2(copy.string(), moved.string()));
    CHECK(JSON_NODE_HOLDS_VALUE(node) && json_node_get_string(node) == moved.string());
    json_node_unref(node);
    CHECK(!fs::exists(copy));
    CHECK(fs::exists(moved));

    node = call("duplicate", args1(file.string()));
    CHECK(JSON_NODE_HOLDS_VALUE(node) && std::string(json_node_get_string(node)) == (root / "a copy.txt").string());
    json_node_unref(node);

    node = call("info", args1(file.string()));
    CHECK(JSON_NODE_HOLDS_OBJECT(node));
    CHECK(std::string(json_object_get_string_member(json_node_get_object(node), "type")) == "file");
    json_node_unref(node);

    fs::path project = root / "project";
    fs::path nested = project / "a" / "b";
    fs::create_directories(nested);
    write_file(project / "package.json", "{}");

    node = call("pkg", args1(nested.string()));
    CHECK(JSON_NODE_HOLDS_VALUE(node) && json_node_get_string(node) == project.string());
    json_node_unref(node);

    fs::path repo = root / "repo";
    fs::create_directories(repo / ".git");
    node = call("git", args1(repo.string()));
    CHECK(JSON_NODE_HOLDS_VALUE(node) && json_node_get_string(node) == repo.string());
    json_node_unref(node);

    node = call("remove", args1(moved.string()));
    CHECK(JSON_NODE_HOLDS_VALUE(node) && json_node_get_string(node) == moved.string());
    json_node_unref(node);
    CHECK(!fs::exists(moved));

    fs::remove_all(root);
    if (failures)
    {
        g_printerr("%d failure(s)\n", failures);
        return 1;
    }
    g_print("all fs routes ok\n");
    return 0;
}
