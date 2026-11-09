#include <gtk/gtk.h>
#include <webkit2/webkit2.h>
#include <jsc/jsc.h>
#include <json-glib/json-glib.h>
#include <glib.h>
#include <glib/gstdio.h>
#include <unistd.h>

#include <algorithm>
#include <cmath>
#include <cstring>
#include <filesystem>
#include <map>
#include <string>
#include <vector>

#include "fs.h"

namespace fs = std::filesystem;

struct Win
{
    GtkWidget* window = nullptr;
    GtkWidget* view = nullptr;
    int id = 0;
    std::string init_script;
    bool close_sent = false;
    bool reload_pending = false;
    bool ready = false;
    bool pending_frame = false;
    bool zoomed = false;
    int requested_w = 0;
    int requested_h = 0;
    int restore_x = 0;
    int restore_y = 0;
    int restore_w = 0;
    int restore_h = 0;
    int min_w = 0;
    int min_h = 0;
    int max_w = G_MAXINT;
    int max_h = G_MAXINT;
    guint frame_timer = 0;
    guint close_timer = 0;
};

static std::string g_bundle;
static std::map<int, Win*> g_windows;
static int g_next_id = 0;
static bool g_quitting = false;
static double g_ui_scale = 2.0;
static double g_scale = 1.0;
static int g_gdk_scale = 1;

static int gtk_size (double css)
{
    return (int)std::lround(css * g_scale);
}

static int gtk_limit (int css)
{
    if (css >= 1000000)
    {
        return G_MAXINT;
    }
    return gtk_size(css);
}

static void on_kakao_received (WebKitUserContentManager* manager, WebKitJavascriptResult* result, gpointer data);
static gboolean on_kakao_request (WebKitUserContentManager* manager, JSCValue* value, WebKitScriptMessageReply* reply, gpointer data);
static void on_load_changed (WebKitWebView* view, WebKitLoadEvent event, gpointer data);

static std::string expand_tilde (const std::string& path)
{
    if (path == "~")
    {
        return g_get_home_dir();
    }
    if (path.rfind("~/", 0) == 0)
    {
        return std::string(g_get_home_dir()) + path.substr(1);
    }
    return path;
}

static bool ends_with (const std::string& value, const std::string& suffix)
{
    return value.size() >= suffix.size() &&
           value.compare(value.size() - suffix.size(), suffix.size(), suffix) == 0;
}

static std::string js_quote (const std::string& value)
{
    char* escaped = g_strescape(value.c_str(), nullptr);
    std::string result = std::string("\"") + escaped + "\"";
    g_free(escaped);
    return result;
}

static std::string node_to_json (JsonNode* node)
{
    JsonGenerator* generator = json_generator_new();
    json_generator_set_root(generator, node);
    char* data = json_generator_to_data(generator, nullptr);
    std::string result = data ? data : "null";
    g_free(data);
    g_object_unref(generator);
    return result;
}

static JsonNode* make_null ()
{
    return json_node_new(JSON_NODE_NULL);
}

static JsonNode* make_int (gint64 value)
{
    JsonNode* node = json_node_new(JSON_NODE_VALUE);
    json_node_set_int(node, value);
    return node;
}

static JsonNode* make_double (double value)
{
    JsonNode* node = json_node_new(JSON_NODE_VALUE);
    json_node_set_double(node, value);
    return node;
}

static JsonNode* make_bool (bool value)
{
    JsonNode* node = json_node_new(JSON_NODE_VALUE);
    json_node_set_boolean(node, value);
    return node;
}

static JsonNode* make_string (const std::string& value)
{
    JsonNode* node = json_node_new(JSON_NODE_VALUE);
    json_node_set_string(node, value.c_str());
    return node;
}

static JsonNode* make_object ()
{
    JsonNode* node = json_node_new(JSON_NODE_OBJECT);
    json_node_take_object(node, json_object_new());
    return node;
}

static JsonNode* make_array ()
{
    JsonNode* node = json_node_new(JSON_NODE_ARRAY);
    json_node_take_array(node, json_array_new());
    return node;
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

static bool arg_is_string (JsonArray* args, guint index)
{
    return arg_string(args, index) != nullptr;
}

static double arg_double (JsonArray* args, guint index, double fallback = 0)
{
    if (!args || index >= json_array_get_length(args))
    {
        return fallback;
    }
    JsonNode* node = json_array_get_element(args, index);
    if (!node || !JSON_NODE_HOLDS_VALUE(node))
    {
        return fallback;
    }
    GType type = json_node_get_value_type(node);
    if (type == G_TYPE_INT64)
    {
        return (double)json_node_get_int(node);
    }
    if (type == G_TYPE_DOUBLE)
    {
        return json_node_get_double(node);
    }
    return fallback;
}

static bool arg_bool (JsonArray* args, guint index, bool fallback = false)
{
    if (!args || index >= json_array_get_length(args))
    {
        return fallback;
    }
    JsonNode* node = json_array_get_element(args, index);
    if (!node || !JSON_NODE_HOLDS_VALUE(node) || json_node_get_value_type(node) != G_TYPE_BOOLEAN)
    {
        return fallback;
    }
    return json_node_get_boolean(node);
}

static JsonObject* arg_object (JsonArray* args, guint index)
{
    if (!args || index >= json_array_get_length(args))
    {
        return nullptr;
    }
    JsonNode* node = json_array_get_element(args, index);
    if (!node || !JSON_NODE_HOLDS_OBJECT(node))
    {
        return nullptr;
    }
    return json_node_get_object(node);
}

static JsonArray* arg_array (JsonArray* args, guint index)
{
    if (!args || index >= json_array_get_length(args))
    {
        return nullptr;
    }
    JsonNode* node = json_array_get_element(args, index);
    if (!node || !JSON_NODE_HOLDS_ARRAY(node))
    {
        return nullptr;
    }
    return json_node_get_array(node);
}

static JsonArray* copy_array (JsonArray* source)
{
    JsonArray* result = json_array_new();
    if (!source)
    {
        return result;
    }
    for (guint i = 0; i < json_array_get_length(source); i++)
    {
        json_array_add_element(result, json_node_copy(json_array_get_element(source, i)));
    }
    return result;
}

static void js_eval (Win* win, const std::string& script)
{
    if (!win || !win->view || !GTK_IS_WIDGET(win->window))
    {
        return;
    }
    webkit_web_view_evaluate_javascript(WEBKIT_WEB_VIEW(win->view), script.c_str(), -1,
                                        nullptr, nullptr, nullptr, nullptr, nullptr);
}

static void emit_json (Win* win, const std::string& json)
{
    if (!win || !win->ready)
    {
        return;
    }
    js_eval(win, "window.__kalkReceive(" + json + ");");
}

static void emit_event_json (Win* win, JsonNode* node)
{
    std::string json = node_to_json(node);
    json_node_unref(node);
    emit_json(win, json);
}

static void emit_event (Win* win, const std::string& name)
{
    JsonNode* node = make_object();
    JsonObject* object = json_node_get_object(node);
    json_object_set_string_member(object, "name", name.c_str());
    json_object_set_array_member(object, "args", json_array_new());
    emit_event_json(win, node);
}

static void emit_event (Win* win, const std::string& name, JsonNode* arg)
{
    JsonNode* node = make_object();
    JsonObject* object = json_node_get_object(node);
    json_object_set_string_member(object, "name", name.c_str());
    JsonArray* args = json_array_new();
    json_array_add_element(args, arg);
    json_object_set_array_member(object, "args", args);
    emit_event_json(win, node);
}

static void emit_event_all (const std::string& name)
{
    for (auto& item : g_windows)
    {
        emit_event(item.second, name);
    }
}

static void emit_close (Win* win, bool save)
{
    emit_event(win, "window.close", make_bool(save));
}

static void emit_frame (Win* win);

static GdkDisplay* display ()
{
    return gdk_display_get_default();
}

static GdkMonitor* monitor_for_window (Win* win)
{
    GdkWindow* window = gtk_widget_get_window(win->window);
    if (window)
    {
        return gdk_display_get_monitor_at_window(gdk_window_get_display(window), window);
    }
    GdkMonitor* monitor = gdk_display_get_primary_monitor(display());
    if (!monitor)
    {
        monitor = gdk_display_get_monitor(display(), 0);
    }
    return monitor;
}

static GdkMonitor* monitor_for_frame (JsonObject* frame, Win* win)
{
    int x = json_object_get_int_member(frame, "x");
    for (int i = 0; i < gdk_display_get_n_monitors(display()); i++)
    {
        GdkMonitor* monitor = gdk_display_get_monitor(display(), i);
        GdkRectangle geometry;
        gdk_monitor_get_geometry(monitor, &geometry);
        if (x >= geometry.x && x < geometry.x + geometry.width)
        {
            return monitor;
        }
    }
    return monitor_for_window(win);
}

static void monitor_geometry (GdkMonitor* monitor, GdkRectangle* geometry)
{
    if (!monitor)
    {
        geometry->x = 0;
        geometry->y = 0;
        geometry->width = 1280;
        geometry->height = 800;
        return;
    }
    gdk_monitor_get_geometry(monitor, geometry);
}

static int cocoa_y (int y, int height, GdkRectangle* geometry)
{
    return geometry->y + geometry->height - (y + height);
}

static void center_window (Win* win)
{
    GdkMonitor* monitor = monitor_for_window(win);
    GdkRectangle area;
    gdk_monitor_get_workarea(monitor, &area);
    int width = win->requested_w;
    int height = win->requested_h;
    if (width <= 0 || height <= 0)
    {
        int actual_width = 0;
        int actual_height = 0;
        gtk_window_get_size(GTK_WINDOW(win->window), &actual_width, &actual_height);
        width = (int)std::lround(actual_width / g_scale);
        height = (int)std::lround(actual_height / g_scale);
    }
    gtk_window_move(GTK_WINDOW(win->window),
                    area.x + (area.width - gtk_size(width)) / 2,
                    area.y + (area.height - gtk_size(height)) / 2);
}

static void apply_hints (Win* win)
{
    GdkGeometry hints;
    memset(&hints, 0, sizeof(hints));
    hints.min_width = gtk_limit(win->min_w);
    hints.min_height = gtk_limit(win->min_h);
    hints.max_width = gtk_limit(win->max_w);
    hints.max_height = gtk_limit(win->max_h);
    gtk_window_set_geometry_hints(GTK_WINDOW(win->window), nullptr, &hints,
                                  (GdkWindowHints)(GDK_HINT_MIN_SIZE | GDK_HINT_MAX_SIZE));
}

static void toggle_maximize (Win* win)
{
    GdkMonitor* monitor = monitor_for_window(win);
    GdkRectangle area;
    gdk_monitor_get_workarea(monitor, &area);
    if (win->zoomed)
    {
        gtk_window_move(GTK_WINDOW(win->window), win->restore_x, win->restore_y);
        gtk_window_resize(GTK_WINDOW(win->window), win->restore_w, win->restore_h);
        win->zoomed = false;
        emit_event_all("window.demaximizes");
    }
    else
    {
        int x = 0;
        int y = 0;
        int width = 0;
        int height = 0;
        gtk_window_get_position(GTK_WINDOW(win->window), &x, &y);
        gtk_window_get_size(GTK_WINDOW(win->window), &width, &height);
        win->restore_x = x;
        win->restore_y = y;
        win->restore_w = width;
        win->restore_h = height;
        gtk_window_resize(GTK_WINDOW(win->window), width, area.height);
        gtk_window_move(GTK_WINDOW(win->window), x, area.y);
        win->zoomed = true;
        emit_event_all("window.maximizes");
    }
}

static void emit_frame (Win* win)
{
    if (!win->ready)
    {
        win->pending_frame = true;
        return;
    }
    GdkMonitor* monitor = monitor_for_window(win);
    GdkRectangle geometry;
    monitor_geometry(monitor, &geometry);
    int x = 0;
    int y = 0;
    int width = 0;
    int height = 0;
    gtk_window_get_position(GTK_WINDOW(win->window), &x, &y);
    gtk_window_get_size(GTK_WINDOW(win->window), &width, &height);
    JsonNode* node = make_object();
    JsonObject* info = json_node_get_object(node);
    json_object_set_int_member(info, "id", win->id);
    JsonObject* frame = json_object_new();
    json_object_set_double_member(frame, "x", x / g_scale);
    json_object_set_double_member(frame, "y", cocoa_y(y, height, &geometry) / g_scale);
    json_object_set_double_member(frame, "w", width / g_scale);
    json_object_set_double_member(frame, "h", height / g_scale);
    json_object_set_object_member(info, "frame", frame);
    JsonObject* screen = json_object_new();
    json_object_set_double_member(screen, "x", geometry.x / g_scale);
    json_object_set_double_member(screen, "y", geometry.y / g_scale);
    json_object_set_double_member(screen, "w", geometry.width / g_scale);
    json_object_set_double_member(screen, "h", geometry.height / g_scale);
    json_object_set_object_member(info, "screen", screen);
    emit_event(win, "window.frame", node);
}

static gboolean send_frame_timeout (gpointer data)
{
    Win* win = (Win*)data;
    win->frame_timer = 0;
    if (GTK_IS_WIDGET(win->window))
    {
        emit_frame(win);
    }
    return G_SOURCE_REMOVE;
}

static gboolean on_configure (GtkWidget* widget, GdkEventConfigure* event, gpointer data)
{
    Win* win = (Win*)data;
    if (!win->frame_timer)
    {
        win->frame_timer = g_timeout_add(30, send_frame_timeout, win);
    }
    return FALSE;
}

static gboolean on_focus_in (GtkWidget* widget, GdkEventFocus* event, gpointer data)
{
    emit_event((Win*)data, "window.focus");
    return FALSE;
}

static gboolean on_focus_out (GtkWidget* widget, GdkEventFocus* event, gpointer data)
{
    emit_event((Win*)data, "window.blur");
    return FALSE;
}

static gboolean on_draw (GtkWidget* widget, cairo_t* cr, gpointer data)
{
    cairo_set_source_rgba(cr, 0, 0, 0, 0);
    cairo_set_operator(cr, CAIRO_OPERATOR_SOURCE);
    cairo_paint(cr);
    return FALSE;
}

static gboolean destroy_timeout (gpointer data)
{
    Win* win = (Win*)data;
    win->close_timer = 0;
    if (GTK_IS_WIDGET(win->window))
    {
        gtk_widget_destroy(win->window);
    }
    return G_SOURCE_REMOVE;
}

static void request_close (Win* win, bool save)
{
    if (win->close_sent)
    {
        return;
    }
    win->close_sent = true;
    emit_close(win, save);
    if (!win->close_timer)
    {
        win->close_timer = g_timeout_add(150, destroy_timeout, win);
    }
}

static gboolean on_delete (GtkWidget* widget, GdkEvent* event, gpointer data)
{
    Win* win = (Win*)data;
    if (g_quitting)
    {
        return FALSE;
    }
    request_close(win, g_windows.size() <= 1);
    return TRUE;
}

static void on_destroy (GtkWidget* widget, gpointer data)
{
    Win* win = (Win*)data;
    if (win->frame_timer)
    {
        g_source_remove(win->frame_timer);
        win->frame_timer = 0;
    }
    if (win->close_timer)
    {
        g_source_remove(win->close_timer);
        win->close_timer = 0;
    }
    g_windows.erase(win->id);
    delete win;
    if (g_windows.empty())
    {
        gtk_main_quit();
    }
}

static void quit_app ()
{
    if (g_quitting)
    {
        return;
    }
    g_quitting = true;
    for (auto& item : g_windows)
    {
        emit_close(item.second, true);
    }
    g_timeout_add(150, [](gpointer) -> gboolean
    {
        gtk_main_quit();
        return G_SOURCE_REMOVE;
    }, nullptr);
}

static std::string resolve_url (const std::string& value)
{
    std::string url = value.empty() ? "index.html" : value;
    if (url.rfind("http://", 0) == 0 ||
        url.rfind("https://", 0) == 0 ||
        url.rfind("file://", 0) == 0)
    {
        return url;
    }
    if (url[0] == '/' || url[0] == '~')
    {
        std::string path = expand_tilde(url);
        gchar* uri = g_filename_to_uri(path.c_str(), nullptr, nullptr);
        std::string result = uri ? uri : url;
        g_free(uri);
        return result;
    }
    if (!ends_with(url, ".html"))
    {
        url += ".html";
    }
    std::string path = g_bundle + "/js/" + url;
    gchar* uri = g_filename_to_uri(path.c_str(), nullptr, nullptr);
    std::string result = uri ? uri : path;
    g_free(uri);
    return result;
}

static std::string bootstrap_script (int id, const std::string& init_script)
{
    std::string script;
    script += "(function(){var real=null,queue=[];";
    script += "Object.defineProperty(window,'kakao',{configurable:true,get:function(){return real;},";
    script += "set:function(v){real=v;if(queue.length){var q=queue;queue=[];";
    script += "for(var i=0;i<q.length;i++){try{v.receive(q[i]);}catch(e){}}}}});";
    script += "window.__kalkReceive=function(m){if(real&&typeof real.receive==='function'){real.receive(m);}else{queue.push(m);}};";
    script += "})();";
    script += "window.winID=" + std::to_string(id) + ";";
    script += "window.userName=" + js_quote(g_get_user_name()) + ";";
    script += "window.homeDir=" + js_quote(g_get_home_dir()) + ";";
    script += "window.tmpDir=" + js_quote(std::string(g_get_tmp_dir()) + "/") + ";";
    script += "window.bundlePath=" + js_quote(g_bundle) + ";";
    script += "window.kalkPlatform='linux';window.kalkCommandKey='ctrl';";
    script += init_script;
    return script;
}

static WebKitWebView* make_view (Win* win, const std::string& script)
{
    WebKitUserContentManager* manager = webkit_user_content_manager_new();
    g_signal_connect(manager, "script-message-received::kakao", G_CALLBACK(on_kakao_received), win);
    g_signal_connect(manager, "script-message-with-reply-received::kakao_request", G_CALLBACK(on_kakao_request), win);
    webkit_user_content_manager_register_script_message_handler(manager, "kakao");
    webkit_user_content_manager_register_script_message_handler_with_reply(manager, "kakao_request", nullptr);

    WebKitUserScript* user_script = webkit_user_script_new(script.c_str(),
                                                          WEBKIT_USER_CONTENT_INJECT_ALL_FRAMES,
                                                          WEBKIT_USER_SCRIPT_INJECT_AT_DOCUMENT_START,
                                                          nullptr, nullptr);
    webkit_user_content_manager_add_script(manager, user_script);
    webkit_user_script_unref(user_script);

    WebKitSettings* settings = webkit_settings_new();
    webkit_settings_set_enable_developer_extras(settings, TRUE);
    webkit_settings_set_enable_write_console_messages_to_stdout(settings, TRUE);
    webkit_settings_set_allow_file_access_from_file_urls(settings, TRUE);
    webkit_settings_set_allow_universal_access_from_file_urls(settings, TRUE);

    GtkWidget* view = GTK_WIDGET(g_object_new(WEBKIT_TYPE_WEB_VIEW,
                                              "web-context", webkit_web_context_get_default(),
                                              "user-content-manager", manager,
                                              "settings", settings,
                                              nullptr));
    g_object_unref(settings);
    g_object_unref(manager);

    GdkRGBA background = {0, 0, 0, 0};
    webkit_web_view_set_background_color(WEBKIT_WEB_VIEW(view), &background);
    webkit_web_view_set_zoom_level(WEBKIT_WEB_VIEW(view), g_scale);
    g_signal_connect(view, "load-changed", G_CALLBACK(on_load_changed), win);

    return WEBKIT_WEB_VIEW(view);
}

static GdkMonitor* pointer_monitor ()
{
    GdkSeat* seat = gdk_display_get_default_seat(display());
    GdkDevice* pointer = gdk_seat_get_pointer(seat);
    gint x = 0;
    gint y = 0;
    gdk_device_get_position(pointer, nullptr, &x, &y);
    GdkMonitor* monitor = gdk_display_get_monitor_at_point(display(), x, y);
    if (!monitor)
    {
        monitor = gdk_display_get_primary_monitor(display());
    }
    if (!monitor)
    {
        monitor = gdk_display_get_monitor(display(), 0);
    }
    return monitor;
}

static Win* create_window (const std::string& url_string, const std::string& init_script)
{
    Win* win = new Win();
    win->id = ++g_next_id;
    win->init_script = init_script;

    GtkWidget* window = gtk_window_new(GTK_WINDOW_TOPLEVEL);
    win->window = window;
    gtk_window_set_title(GTK_WINDOW(window), "kalk");
    gtk_window_set_decorated(GTK_WINDOW(window), FALSE);
    gtk_window_set_resizable(GTK_WINDOW(window), TRUE);
    gtk_window_set_default_size(GTK_WINDOW(window), gtk_size(400), gtk_size(400));
    gtk_widget_set_app_paintable(window, TRUE);
    GdkScreen* screen = gtk_widget_get_screen(window);
    GdkVisual* visual = gdk_screen_get_rgba_visual(screen);
    if (visual)
    {
        gtk_widget_set_visual(window, visual);
    }
    g_signal_connect(window, "draw", G_CALLBACK(on_draw), nullptr);
    g_signal_connect(window, "delete-event", G_CALLBACK(on_delete), win);
    g_signal_connect(window, "destroy", G_CALLBACK(on_destroy), win);
    g_signal_connect(window, "configure-event", G_CALLBACK(on_configure), win);
    g_signal_connect(window, "focus-in-event", G_CALLBACK(on_focus_in), win);
    g_signal_connect(window, "focus-out-event", G_CALLBACK(on_focus_out), win);

    std::string script = bootstrap_script(win->id, init_script);
    GtkWidget* view = GTK_WIDGET(make_view(win, script));
    win->view = view;
    gtk_container_add(GTK_CONTAINER(window), view);

    GdkMonitor* monitor = pointer_monitor();
    GdkRectangle area;
    gdk_monitor_get_workarea(monitor, &area);
    int initial = gtk_size(400);
    gtk_window_move(GTK_WINDOW(window),
                    area.x + (area.width - initial) / 2,
                    area.y + (area.height - initial) / 2);

    g_windows[win->id] = win;
    gtk_widget_show_all(window);
    std::string url = resolve_url(url_string);
    webkit_web_view_load_uri(WEBKIT_WEB_VIEW(view), url.c_str());
    return win;
}

static JsonNode* frame_info (Win* win)
{
    GdkMonitor* monitor = monitor_for_window(win);
    GdkRectangle geometry;
    monitor_geometry(monitor, &geometry);
    int x = 0;
    int y = 0;
    int width = 0;
    int height = 0;
    gtk_window_get_position(GTK_WINDOW(win->window), &x, &y);
    gtk_window_get_size(GTK_WINDOW(win->window), &width, &height);
    JsonNode* node = make_object();
    JsonObject* info = json_node_get_object(node);
    json_object_set_int_member(info, "id", win->id);
    JsonObject* frame = json_object_new();
    json_object_set_double_member(frame, "x", x / g_scale);
    json_object_set_double_member(frame, "y", cocoa_y(y, height, &geometry) / g_scale);
    json_object_set_double_member(frame, "w", width / g_scale);
    json_object_set_double_member(frame, "h", height / g_scale);
    json_object_set_object_member(info, "frame", frame);
    JsonObject* screen = json_object_new();
    json_object_set_double_member(screen, "x", geometry.x / g_scale);
    json_object_set_double_member(screen, "y", geometry.y / g_scale);
    json_object_set_double_member(screen, "w", geometry.width / g_scale);
    json_object_set_double_member(screen, "h", geometry.height / g_scale);
    json_object_set_object_member(info, "screen", screen);
    return node;
}

struct SnapshotData
{
    GtkWidget* view;
    std::string path;
};

static void snapshot_done (GObject* source, GAsyncResult* result, gpointer user_data)
{
    SnapshotData* data = (SnapshotData*)user_data;
    GError* error = nullptr;
    cairo_surface_t* surface = webkit_web_view_get_snapshot_finish(WEBKIT_WEB_VIEW(data->view), result, &error);
    if (surface)
    {
        cairo_surface_write_to_png(surface, data->path.c_str());
        cairo_surface_destroy(surface);
    }
    if (error)
    {
        g_printerr("snapshot: %s\n", error->message);
        g_error_free(error);
    }
    delete data;
}

static std::string snapshot_path (const std::string& requested)
{
    if (!requested.empty())
    {
        return expand_tilde(requested);
    }
    std::string path = std::string(g_get_home_dir()) + "/Desktop/kakao.png";
    int number = 0;
    while (g_file_test(path.c_str(), G_FILE_TEST_EXISTS))
    {
        number++;
        path = std::string(g_get_home_dir()) + "/Desktop/kakao_" + std::to_string(number) + ".png";
    }
    return path;
}

static void open_target (const std::string& target)
{
    std::string path = expand_tilde(target);
    if (path[0] != '/' && path.find("://") != std::string::npos)
    {
        g_app_info_launch_default_for_uri(path.c_str(), nullptr, nullptr);
        return;
    }
    gchar* uri = g_filename_to_uri(path.c_str(), nullptr, nullptr);
    if (uri)
    {
        g_app_info_launch_default_for_uri(uri, nullptr, nullptr);
        g_free(uri);
    }
}

static JsonNode* run_shell (JsonArray* args)
{
    std::string command;
    for (guint i = 0; i < json_array_get_length(args); i++)
    {
        const char* part = arg_string(args, i);
        if (!part)
        {
            continue;
        }
        char* quoted = g_shell_quote(part);
        if (!command.empty())
        {
            command += " ";
        }
        command += quoted;
        g_free(quoted);
    }
    if (command.empty())
    {
        return make_null();
    }
    gchar* output = nullptr;
    gint status = 0;
    if (!g_spawn_command_line_sync(command.c_str(), &output, nullptr, &status, nullptr) || status != 0)
    {
        g_free(output);
        return make_null();
    }
    JsonNode* node = make_string(output ? output : "");
    g_free(output);
    return node;
}

static JsonNode* window_route (const std::string& req, JsonArray* args, Win* win)
{
    if (req == "frameInfo")
    {
        return frame_info(win);
    }
    if (req == "new")
    {
        std::string url = arg_is_string(args, 0) ? arg_string(args, 0) : "index.html";
        std::string script = arg_is_string(args, 1) ? arg_string(args, 1) : "";
        if (url == "icon")
        {
            return make_null();
        }
        Win* created = create_window(url, script);
        return make_int(created->id);
    }
    if (req == "close")
    {
        request_close(win, g_windows.size() <= 1);
        return make_null();
    }
    if (req == "reload")
    {
        emit_event(win, "window.willReload");
        win->reload_pending = true;
        webkit_web_view_reload_bypass_cache(WEBKIT_WEB_VIEW(win->view));
        return make_null();
    }
    if (req == "raise")
    {
        gtk_window_deiconify(GTK_WINDOW(win->window));
        gtk_window_present(GTK_WINDOW(win->window));
        return make_null();
    }
    if (req == "maximize")
    {
        toggle_maximize(win);
        return make_null();
    }
    if (req == "minimize")
    {
        gtk_window_iconify(GTK_WINDOW(win->window));
        return make_null();
    }
    if (req == "hide")
    {
        gtk_window_iconify(GTK_WINDOW(win->window));
        return make_null();
    }
    if (req == "center")
    {
        center_window(win);
        return make_null();
    }
    if (req == "setTopLeft")
    {
        JsonObject* point = arg_object(args, 0);
        if (point)
        {
            GdkMonitor* monitor = monitor_for_window(win);
            GdkRectangle geometry;
            monitor_geometry(monitor, &geometry);
            double x_css = json_object_get_double_member(point, "x");
            double y_css = json_object_get_double_member(point, "y");
            int x_gtk = gtk_size(x_css);
            int y_gtk = (int)std::lround(geometry.y + geometry.height - y_css * g_scale);
            gtk_window_move(GTK_WINDOW(win->window), x_gtk, y_gtk);
        }
        return make_null();
    }
    if (req == "setFrame")
    {
        JsonObject* frame = arg_object(args, 0);
        if (frame)
        {
            GdkMonitor* monitor = monitor_for_frame(frame, win);
            GdkRectangle geometry;
            monitor_geometry(monitor, &geometry);
            double x_css = json_object_get_double_member(frame, "x");
            double y_css = json_object_get_double_member(frame, "y");
            double width_css = json_object_get_double_member(frame, "w");
            double height_css = json_object_get_double_member(frame, "h");
            win->requested_w = (int)std::lround(width_css);
            win->requested_h = (int)std::lround(height_css);
            gtk_window_resize(GTK_WINDOW(win->window), gtk_size(width_css), gtk_size(height_css));
            gtk_window_move(GTK_WINDOW(win->window), gtk_size(x_css),
                            (int)std::lround(geometry.y + geometry.height - (y_css + height_css) * g_scale));
        }
        return make_null();
    }
    if (req == "setSize")
    {
        double width = arg_double(args, 0);
        double height = arg_double(args, 1);
        win->requested_w = (int)std::lround(width);
        win->requested_h = (int)std::lround(height);
        gtk_window_resize(GTK_WINDOW(win->window), gtk_size(width), gtk_size(height));
        return make_null();
    }
    if (req == "setMinSize")
    {
        win->min_w = (int)std::round(arg_double(args, 0));
        win->min_h = (int)std::round(arg_double(args, 1));
        apply_hints(win);
        return make_null();
    }
    if (req == "setMaxSize")
    {
        win->max_w = (int)std::round(arg_double(args, 0));
        win->max_h = (int)std::round(arg_double(args, 1));
        apply_hints(win);
        return make_null();
    }
    if (req == "id")
    {
        return make_int(win->id);
    }
    if (req == "framerateDrop")
    {
        return make_null();
    }
    if (req == "toggleInspector")
    {
        WebKitWebInspector* inspector = webkit_web_view_get_inspector(WEBKIT_WEB_VIEW(win->view));
        if (webkit_web_inspector_is_attached(inspector))
        {
            webkit_web_inspector_close(inspector);
        }
        else
        {
            webkit_web_inspector_show(inspector);
        }
        return make_null();
    }
    if (req == "fullscreen")
    {
        GdkWindow* window = gtk_widget_get_window(win->window);
        if (window && (gdk_window_get_state(window) & GDK_WINDOW_STATE_FULLSCREEN))
        {
            gtk_window_unfullscreen(GTK_WINDOW(win->window));
        }
        else
        {
            gtk_window_fullscreen(GTK_WINDOW(win->window));
        }
        return make_null();
    }
    if (req == "snapshot")
    {
        std::string requested = arg_is_string(args, 0) ? arg_string(args, 0) : "";
        std::string path = snapshot_path(requested);
        SnapshotData* data = new SnapshotData{win->view, path};
        webkit_web_view_get_snapshot(WEBKIT_WEB_VIEW(win->view),
                                     WEBKIT_SNAPSHOT_REGION_VISIBLE,
                                     WEBKIT_SNAPSHOT_OPTIONS_NONE,
                                     nullptr, snapshot_done, data);
        return make_string(path);
    }
    if (req == "post")
    {
        std::string name = arg_is_string(args, 0) ? arg_string(args, 0) : "";
        JsonArray* post_args = arg_array(args, 1);
        for (auto& item : g_windows)
        {
            if (item.second == win)
            {
                continue;
            }
            JsonNode* node = make_object();
            JsonObject* object = json_node_get_object(node);
            json_object_set_string_member(object, "name", name.c_str());
            json_object_set_array_member(object, "args", copy_array(post_args));
            emit_event_json(item.second, node);
        }
        return make_null();
    }
    return make_null();
}

static JsonNode* route_request (const std::string& route, JsonArray* args, Win* win)
{
    if (route == "now")
    {
        return make_double(g_get_real_time() / 1000000.0);
    }
    if (route == "log")
    {
        g_print("kakao log\n");
        return make_null();
    }
    if (route == "open")
    {
        if (arg_is_string(args, 0))
        {
            open_target(arg_string(args, 0));
        }
        return make_null();
    }
    if (route == "finder")
    {
        if (arg_is_string(args, 0))
        {
            std::string path = expand_tilde(arg_string(args, 0));
            fs::path parent = fs::path(path).parent_path();
            if (!parent.empty())
            {
                open_target(parent.string());
            }
        }
        return make_null();
    }
    if (route.rfind("bundle.", 0) == 0)
    {
        std::string req = route.substr(7);
        std::string arg = arg_is_string(args, 0) ? arg_string(args, 0) : "";
        if (req == "path") return make_string(g_bundle);
        if (req == "appPath") return make_string(g_bundle + "/" + arg);
        if (req == "macOSPath") return make_string(g_bundle + "/Contents/MacOS/" + arg);
        if (req == "jsPath") return make_string(g_bundle + "/js/" + arg);
        if (req == "resourcePath") return make_string(g_bundle + "/Contents/Resources/" + arg);
        return make_null();
    }
    if (route.rfind("window.", 0) == 0)
    {
        return window_route(route.substr(7), args, win);
    }
    if (route.rfind("clipboard.", 0) == 0)
    {
        std::string req = route.substr(10);
        GtkClipboard* clipboard = gtk_clipboard_get(GDK_SELECTION_CLIPBOARD);
        if (req == "get" || req == "read")
        {
            gchar* text = gtk_clipboard_wait_for_text(clipboard);
            if (!text)
            {
                return make_null();
            }
            JsonNode* node = make_string(text);
            g_free(text);
            return node;
        }
        if (req == "set" || req == "write")
        {
            const char* text = arg_string(args, 0);
            if (!text) return make_null();
            gtk_clipboard_set_text(clipboard, text, -1);
            return make_string(text);
        }
        return make_null();
    }
    if (route.rfind("app.", 0) == 0)
    {
        std::string req = route.substr(4);
        if (req == "quit")
        {
            quit_app();
            return make_null();
        }
        if (req == "sh")
        {
            return run_shell(args);
        }
        return make_null();
    }
    if (route.rfind("status.", 0) == 0)
    {
        return make_null();
    }
    if (route.rfind("fs.", 0) == 0)
    {
        return fs_route(route.substr(3), args);
    }
    if (route.rfind("js.", 0) == 0)
    {
        return make_null();
    }
    if (route.rfind("test.", 0) == 0)
    {
        std::string req = route.substr(5);
        std::string input = arg_is_string(args, 0) ? arg_string(args, 0) : "";
        if (req == "ping")
        {
            return make_string("you say " + input + " you get pong!");
        }
        if (req == "struct")
        {
            JsonNode* node = make_object();
            JsonObject* object = json_node_get_object(node);
            json_object_set_string_member(object, "input", ("you sent " + input).c_str());
            json_object_set_string_member(object, "output", "you get this!");
            return node;
        }
        return make_null();
    }
    g_printerr("unknown request %s\n", route.c_str());
    return make_null();
}

static JsonNode* message_root (JSCValue* value)
{
    char* json = jsc_value_to_json(value, 0);
    if (!json)
    {
        return make_null();
    }
    JsonParser* parser = json_parser_new();
    GError* error = nullptr;
    JsonNode* root = nullptr;
    if (json_parser_load_from_data(parser, json, -1, &error))
    {
        root = json_node_copy(json_parser_get_root(parser));
    }
    else if (error)
    {
        g_printerr("message json: %s\n", error->message);
        g_error_free(error);
    }
    g_object_unref(parser);
    g_free(json);
    return root;
}

static void handle_message (JSCValue* value, Win* win, WebKitScriptMessageReply* reply)
{
    JsonNode* root = message_root(value);
    if (!root || !JSON_NODE_HOLDS_OBJECT(root))
    {
        if (root) json_node_unref(root);
        if (reply)
        {
            JSCContext* context = jsc_value_get_context(value);
            JSCValue* empty = jsc_value_new_null(context);
            webkit_script_message_reply_return_value(reply, empty);
            g_object_unref(empty);
        }
        return;
    }
    JsonObject* object = json_node_get_object(root);
    const char* route = json_object_get_string_member_with_default(object, "route", "");
    JsonArray* args = json_object_has_member(object, "args") && JSON_NODE_HOLDS_ARRAY(json_object_get_member(object, "args"))
        ? json_object_get_array_member(object, "args")
        : nullptr;

    JsonNode* result = route_request(route, args, win);

    if (reply)
    {
        JSCContext* context = jsc_value_get_context(value);
        std::string json = result ? node_to_json(result) : "null";
        JSCValue* reply_value = jsc_value_new_from_json(context, json.c_str());
        webkit_script_message_reply_return_value(reply, reply_value);
        g_object_unref(reply_value);
    }
    if (result)
    {
        json_node_unref(result);
    }
    json_node_unref(root);
}

static void on_kakao_received (WebKitUserContentManager* manager, WebKitJavascriptResult* result, gpointer data)
{
    Win* win = (Win*)data;
    JSCValue* value = webkit_javascript_result_get_js_value(result);
    handle_message(value, win, nullptr);
}

static gboolean on_kakao_request (WebKitUserContentManager* manager, JSCValue* value, WebKitScriptMessageReply* reply, gpointer data)
{
    Win* win = (Win*)data;
    handle_message(value, win, reply);
    return TRUE;
}

static void on_load_changed (WebKitWebView* view, WebKitLoadEvent event, gpointer data)
{
    Win* win = (Win*)data;
    if (event == WEBKIT_LOAD_STARTED)
    {
        win->ready = false;
        win->pending_frame = false;
    }
    if (event == WEBKIT_LOAD_FINISHED)
    {
        win->ready = true;
        if (win->pending_frame)
        {
            win->pending_frame = false;
            emit_frame(win);
        }
        if (win->reload_pending)
        {
            win->reload_pending = false;
            emit_event(win, "window.didReload");
        }
    }
}

static void move_stash_wins ()
{
    std::string dir = g_bundle + "/.stash/win";
    std::string old = g_bundle + "/.stash/old";
    std::error_code error;
    fs::remove_all(old, error);
    if (!fs::exists(dir, error))
    {
        fs::create_directories(dir, error);
        return;
    }
    fs::rename(dir, old, error);
    if (error)
    {
        return;
    }
    fs::create_directories(dir, error);
}

int main (int argc, char** argv)
{
    g_set_prgname("kalk");
    gdk_set_program_class("kalk");
    gtk_init(&argc, &argv);

    GdkMonitor* primary = gdk_display_get_primary_monitor(display());
    if (!primary)
    {
        primary = gdk_display_get_monitor(display(), 0);
    }
    g_gdk_scale = primary ? gdk_monitor_get_scale_factor(primary) : 1;
    if (g_gdk_scale < 1)
    {
        g_gdk_scale = 1;
    }
    const char* scale_env = g_getenv("KALK_SCALE");
    if (!scale_env)
    {
        scale_env = g_getenv("KALK_GDK_SCALE");
    }
    if (scale_env)
    {
        g_ui_scale = g_ascii_strtod(scale_env, nullptr);
    }
    if (!(g_ui_scale > 0.25))
    {
        g_ui_scale = 2.0;
    }
    if (g_ui_scale > 4.0)
    {
        g_ui_scale = 4.0;
    }
    g_scale = g_ui_scale / (double)g_gdk_scale;
    if (!(g_scale > 0.1))
    {
        g_scale = 1.0;
    }

    char* executable = g_file_read_link("/proc/self/exe", nullptr);
    if (executable)
    {
        g_bundle = fs::path(executable).parent_path().parent_path().parent_path().string();
        g_free(executable);
    }
    else
    {
        g_bundle = fs::current_path().string();
    }

    move_stash_wins();

    std::string index = "index.html";
    if (argc > 1 && argv[1][0] != '-')
    {
        index = argv[1];
    }
    create_window(index, "");
    gtk_main();
    return 0;
}
