---
authors: gabrielschulhof, NickNaso, jschlight, mhdawson, KevinEady, avivkeller
---

# CMake.js

[CMake.js](https://github.com/cmake-js/cmake-js) is good build tool alternative to [node-gyp](/learn/node-api/build-tools/node-gyp.md). CMake.js is based on the [CMake](https://cmake.org) tool which must be installed.

### Pros

- Uses the CMake tool which is widely-adopted in the open source community.
- Ideal for existing C/C++ libraries already based on CMake.

### Cons

- Not widely adopted in the Node community.

## Installation

CMake.js requires that CMake is already installed. Installers are available on the [CMake website](https://cmake.org).

> macOS developers may find it more convenient to install CMake using [Homebrew](https://brew.sh). With Homebrew installed, CMake can be installed using a `brew install cmake` command.

You can verify your CMake installation with the command:

```bash
cmake --version
```

As a Node native module developer, you may find it convenient to install CMake.js as a global command line tool:

```bash
npm install cmake-js -g
```

You can verify your CMake.js installation with the command:

```bash
cmake-js --version
```

## package.json

Your `package.json` file needs to have a couple of entries for your native module to work with CMake.js.

Since your native module needs to be compiled using CMake.js on installation, the `scripts` property of your `package.json` file needs an `install` entry to make this happen:

```json
  "scripts": {
    "install": "cmake-js compile"
  }
```

It is unlikely that the users of your native module will have CMake.js installed as a global command line tool. Therefore, your project needs to declare a development dependency on CMake.js. This can be accomplished by entering this command:

```bash
npm install cmake-js --save-dev
```

An alternative is to manually add the development dependency to your `package.json` file:

```json
  "devDependencies": {
    "cmake-js": "^6.0.0"
  }
```

An example of this approach is [available here](https://github.com/nodejs/node-addon-examples/blob/main/src/8-tooling/build_with_cmake/node-addon-api/package.json).

## CMakeLists.txt

Native modules built on CMake.js have a `CMakeLists.txt` that describes how the module is to be built. The file serves the same purpose as the `binding.gyp` for projects that use `node-gyp`.

In addition to the entries required for any CMake build, additional entries are required when building native modules.

### CMake.js

Here are the lines required for all native modules built using CMake.js:

```cpp
project(node-api-cmake-build-example)
include_directories(${CMAKE_JS_INC})
file(GLOB SOURCE_FILES "hello.cc")
add_library(${PROJECT_NAME} SHARED ${SOURCE_FILES} ${CMAKE_JS_SRC})
set_target_properties(${PROJECT_NAME} PROPERTIES PREFIX "" SUFFIX ".node")
target_link_libraries(${PROJECT_NAME} ${CMAKE_JS_LIB})
```

### NAPI_VERSION

When building a native module based on Node-API, it is important to declare the minimum Node-API version against which your module is designed to work. For CMake.js, this is accomplished by adding a line like this to the `CMakeLists.txt` file:

```cpp
# define NAPI_VERSION
add_definitions(-DNAPI_VERSION=3)
```

> In the absence of other requirements, Node-API version 3 is a good choice as this is the Node-API version active when Node-API left experimental status.

### node-addon-api

Additional configuration values are required for Node-API modules based on `node-addon-api`.

`node-addon-api` requires C++11. These configuration lines at the top of the `CMakeLists.txt` file specify this requirement:

```cpp
cmake_minimum_required(VERSION 3.9)
cmake_policy(SET CMP0042 NEW)
set (CMAKE_CXX_STANDARD 11)
```

Modules based on `node-addon-api` include additional header files that are not part of Node itself. These lines instruct CMake.js where to find these files:

```cpp
# Include Node-API wrappers
execute_process(COMMAND node -p "require('node-addon-api').include"
        WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}
        OUTPUT_VARIABLE NODE_ADDON_API_DIR
        )
string(REPLACE "\n" "" NODE_ADDON_API_DIR ${NODE_ADDON_API_DIR})
string(REPLACE "\"" "" NODE_ADDON_API_DIR ${NODE_ADDON_API_DIR})
target_include_directories(${PROJECT_NAME} PRIVATE ${NODE_ADDON_API_DIR})
```

An example of this approach is [available here](https://github.com/nodejs/node-addon-examples/blob/main/src/8-tooling/build_with_cmake/node-addon-api/CMakeLists.txt).
