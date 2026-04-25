#include <emscripten.h>
extern "C" {
  EMSCRIPTEN_KEEPALIVE void init() {}
  EMSCRIPTEN_KEEPALIVE int calc(int y) { return 2024 - y; }
  EMSCRIPTEN_KEEPALIVE const char* greet() { return "مرحباً بكم في موقع غزال"; }
}