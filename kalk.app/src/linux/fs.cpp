#include "fs.h"

#include <glib.h>
#include <glib/gstdio.h>
#include <json-glib/json-glib.h>
#include <sys/stat.h>
#include <unistd.h>

#include <cerrno>
#include <cstring>
#include <filesystem>
#include <string>
#include <system_error>

namespace fs = std::filesystem;

static JsonNode* node_null ()
{
    return json_node_new(JSON_NODE_NULL);
}

static JsonNode* node_string (const std::string& value)
{
    JsonNode* node = json_node_new(JSON_NODE_VALUE);
    json_node_set_string(node, value.c_str());
    return node;
}

static JsonNode* node_bool (bool value)
{
    JsonNode* node = json_node_new(JSON_NODE_VALUE);
    json_node_set_boolean(node, value);
    return node;
}

static JsonNode* node_int (gint64 value)
{
    JsonNode* node = json_node_new(JSON_NODE_VALUE);
    json_node_set_int(node, value);
    return node;
}

static JsonNode* node_double (double value)
{
    JsonNode* node = json_node_new(JSON_NODE_VALUE);
    json_node_set_double(node, value);
    return node;
}

static std::string expand_tilde (const char* path)
{
    if (!path)
    {
        return std::string();
    }
    if (path[0] == '~' && (path[1] == '\0' || path[1] == '/'))
    {
        return std::string(g_get_home_dir()) + (path + 1);
    }
    return std::string(path);
}

static const char* arg_string (JsonArray* args, guint index)
{
    if (!args || index >= json_array_get_length(args))
    {
        return nullptr;
    }
    JsonNode* node = json_array_get_element(args, index);
    if (!node || !JSON_NODE_HOLDS_VALUE(node) || json_node_get_value_type(node) != G_TYPE_STRING)
    {
        return nullptr;
    }
    return json_node_get_string(node);
}

static std::string arg_path (JsonArray* args, guint index)
{
    return expand_tilde(arg_string(args, index));
}

static bool path_exists (const fs::path& path)
{
    std::error_code ec;
    return fs::exists(path, ec);
}

static bool is_dir (const fs::path& path)
{
    std::error_code ec;
    return fs::is_directory(path, ec);
}

static bool is_file (const fs::path& path)
{
    std::error_code ec;
    return fs::is_regular_file(path, ec);
}

static bool copy_path (const fs::path& src, const fs::path& dest)
{
    std::error_code ec;
    if (path_exists(dest))
    {
        return false;
    }
    fs::copy(src, dest, fs::copy_options::recursive, ec);
    return !ec;
}

static JsonNode* route_info (const fs::path& path)
{
    struct stat st;
    if (::stat(path.c_str(), &st) != 0)
    {
        return node_null();
    }
    JsonObject* info = json_object_new();
    json_object_set_int_member(info, "size", st.st_size);
    json_object_set_double_member(info, "created", (double)st.st_ctim.tv_sec + st.st_ctim.tv_nsec / 1e9);
    json_object_set_int_member(info, "group", st.st_gid);
    json_object_set_int_member(info, "owner", st.st_uid);
    json_object_set_double_member(info, "modified", (double)st.st_mtim.tv_sec + st.st_mtim.tv_nsec / 1e9);
    json_object_set_int_member(info, "permission", st.st_mode);
    json_object_set_int_member(info, "inode", st.st_ino);
    json_object_set_string_member(info, "type", S_ISDIR(st.st_mode) ? "dir" : "file");
    JsonNode* node = json_node_new(JSON_NODE_OBJECT);
    json_node_take_object(node, info);
    return node;
}

static JsonNode* route_list (const fs::path& path)
{
    JsonArray* list = json_array_new();
    std::error_code ec;
    for (fs::directory_iterator it(path, ec), end; !ec && it != end; it.increment(ec))
    {
        const fs::directory_entry& entry = *it;
        JsonObject* item = json_object_new();
        json_object_set_string_member(item, "type", entry.is_directory() ? "dir" : "file");
        json_object_set_string_member(item, "file", entry.path().filename().c_str());
        json_object_set_string_member(item, "path", entry.path().c_str());
        JsonNode* node = json_node_new(JSON_NODE_OBJECT);
        json_node_take_object(node, item);
        json_array_add_element(list, node);
    }
    JsonNode* node = json_node_new(JSON_NODE_ARRAY);
    json_node_take_array(node, list);
    return node;
}

static JsonNode* find_parent (const fs::path& start, bool need_pkg, bool need_git)
{
    fs::path path = start;
    std::error_code ec;
    if (is_file(path))
    {
        path = path.parent_path();
    }
    while (!path.empty())
    {
        if ((need_pkg && is_file(path / "package.json")) ||
            (need_git && is_dir(path / ".git")) ||
            (need_pkg && is_dir(path / ".git")))
        {
            return node_string(path.c_str());
        }
        fs::path parent = path.parent_path();
        if (parent == path)
        {
            break;
        }
        path = parent;
    }
    return node_null();
}

static JsonNode* route_duplicate (const fs::path& path)
{
    fs::path parent = path.parent_path();
    std::string name = path.stem().string();
    std::string ext = path.extension().string();
    fs::path dest = parent / (name + " copy" + ext);
    if (!copy_path(path, dest))
    {
        return node_null();
    }
    return node_string(dest.c_str());
}

static bool move_path (const fs::path& src, const fs::path& dest)
{
    if (::rename(src.c_str(), dest.c_str()) == 0)
    {
        return true;
    }
    if (errno != EXDEV)
    {
        return false;
    }
    if (!copy_path(src, dest))
    {
        return false;
    }
    std::error_code ec;
    fs::remove_all(src, ec);
    return !ec;
}

static JsonNode* route_trash (const fs::path& path)
{
    char* quoted = g_shell_quote(path.c_str());
    char* command = g_strdup_printf("gio trash %s", quoted);
    gint status = 0;
    gboolean ok = g_spawn_command_line_sync(command, nullptr, nullptr, &status, nullptr);
    g_free(command);
    g_free(quoted);
    if (ok && status == 0)
    {
        return node_string(path.c_str());
    }
    return node_null();
}

JsonNode* fs_route (const std::string& req, JsonArray* args)
{
    std::string path = arg_path(args, 0);
    std::string first = path;

    if (req == "read")
    {
        gchar* contents = nullptr;
        if (first.empty() || !g_file_get_contents(first.c_str(), &contents, nullptr, nullptr))
        {
            return node_null();
        }
        JsonNode* node = node_string(contents);
        g_free(contents);
        return node;
    }

    if (req == "write")
    {
        const char* text = arg_string(args, 1);
        if (first.empty() || !text)
        {
            return node_null();
        }
        GError* error = nullptr;
        if (!g_file_set_contents(first.c_str(), text, -1, &error))
        {
            if (error) g_error_free(error);
            return node_null();
        }
        return node_string(first);
    }

    if (req == "exists")
    {
        return node_bool(!first.empty() && path_exists(first));
    }

    if (req == "fileExists")
    {
        return node_bool(!first.empty() && is_file(first));
    }

    if (req == "dirExists")
    {
        return node_bool(!first.empty() && is_dir(first));
    }

    if (req == "isWritable")
    {
        return node_bool(!first.empty() && g_access(first.c_str(), W_OK) == 0);
    }

    if (req == "isReadable")
    {
        return node_bool(!first.empty() && g_access(first.c_str(), R_OK) == 0);
    }

    if (req == "remove")
    {
        if (first.empty()) return node_null();
        std::error_code ec;
        fs::remove_all(first, ec);
        if (ec) return node_null();
        return node_string(first);
    }

    if (req == "trash")
    {
        if (first.empty()) return node_null();
        return route_trash(first);
    }

    if (req == "move")
    {
        std::string dest = arg_path(args, 1);
        if (first.empty() || dest.empty()) return node_null();
        if (!move_path(first, dest)) return node_null();
        return node_string(dest);
    }

    if (req == "copy")
    {
        std::string dest = arg_path(args, 1);
        if (first.empty() || dest.empty()) return node_null();
        if (!copy_path(first, dest)) return node_null();
        return node_string(dest);
    }

    if (req == "duplicate")
    {
        if (first.empty()) return node_null();
        return route_duplicate(first);
    }

    if (req == "mkdir")
    {
        if (first.empty()) return node_null();
        std::error_code ec;
        fs::create_directories(first, ec);
        if (ec) return node_null();
        return node_string(first);
    }

    if (req == "list")
    {
        if (first.empty()) return route_list(fs::path());
        return route_list(first);
    }

    if (req == "info")
    {
        if (first.empty()) return node_null();
        return route_info(first);
    }

    if (req == "pkg")
    {
        if (first.empty()) return node_null();
        return find_parent(first, true, false);
    }

    if (req == "git")
    {
        if (first.empty()) return node_null();
        return find_parent(first, false, true);
    }

    return node_null();
}
