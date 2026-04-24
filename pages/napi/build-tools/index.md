---
authors: avivkeller
---

# Build Tools

Building a native Node.js addon requires compiling C/C++ source code into a binary `.node` file that Node.js can load at runtime. This section covers the build tools available to you and the trade-offs between them.

## Compiling on installation vs. distributing pre-built binaries

There are two broad strategies for shipping a native addon:

**Compile on the user's machine** - When a user runs `npm install`, the build tool compiles your C/C++ source on their system. This is simple to set up but requires every user to have a working C/C++ toolchain installed.

**Distribute pre-built binaries** - You compile binaries for each supported platform and architecture ahead of time and upload them somewhere users can download. Users who download a matching binary skip the compilation step entirely; others fall back to compiling locally.

## Build tools covered in this section

- [node-gyp](/learn/napi/build-tools/node-gyp.md) - the default build tool bundled with npm; uses Google's GYP format and is nearly universally supported in the Node ecosystem
- [CMake.js](/learn/napi/build-tools/cmake-js.md) - a CMake-based alternative, well-suited for projects that already use CMake
- [node-pre-gyp](/learn/napi/build-tools/node-pre-gyp.md) - a layer on top of node-gyp for distributing pre-built binaries via Amazon S3
