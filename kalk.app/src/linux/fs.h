#ifndef KALK_LINUX_FS_H
#define KALK_LINUX_FS_H

#include <json-glib/json-glib.h>
#include <string>

JsonNode* fs_route (const std::string& req, JsonArray* args);

#endif
