---
authors: avivkeller
---

# Anatomy of a Node-API project

Before diving into code, it helps to understand the files and layout that every `node-addon-api` project shares. All N-API examples in these guides follow this same structure, so this page explains it once so those tutorials can focus on what makes each one unique.

## Choosing an API level

Node-API operates at two levels:

- **C API** is built directly into Node.js and fully documented on the [Node.js API pages](https://nodejs.org/api/n-api.html). Gives you maximum control with no extra dependencies.
- **C++ wrapper (`node-addon-api`)** is an npm package that wraps the C API in an idiomatic C++ object model. Recommended for most projects: it eliminates significant boilerplate while preserving the full ABI-stability guarantee of Node-API.

The tutorials in this section use `node-addon-api`.

> Node-API is stable in all currently supported Node.js releases. Use an [Active LTS or Maintenance LTS release](https://nodejs.org/en/about/releases/) for the best experience. You can check the version of Node.js you are running with `node -v`.

## Directory layout

```
.
├── binding.gyp        # tells node-gyp how to compile the C/C++ source
├── build/             # compiled output (generated)
├── lib/
│   └── binding.js     # JavaScript layer that loads the compiled binary
├── node_modules/
├── src/
│   └── *.cc / *.h     # your C/C++ implementation
├── test/
│   └── *.js           # test code
├── package.json
└── package-lock.json
```

## package.json

Two entries in `package.json` are specific to native addons.

### `node-addon-api` dependency

```json
"dependencies": {
  "node-addon-api": "^8.0.0"
}
```

[`node-addon-api`](https://github.com/nodejs/node-addon-api) adds a C++ wrapper to the C API built into Node.js. It makes creating and manipulating JavaScript objects in C++ straightforward and is useful even when the underlying library you are wrapping is written in C.

### `"gypfile": true`

```json
"gypfile": true
```

This tells npm that the package requires a native compilation step. When npm sees this entry it automatically invokes its bundled copy of `node-gyp`, which reads `binding.gyp` to build the binary.

## binding.gyp

`binding.gyp` is a [GYP](https://gyp.gsrc.io/) file that describes how to compile and link your C/C++ code. It must be named exactly `binding.gyp`.

[GYP](https://gyp.gsrc.io/) (Generate Your Projects) lets you write a single build description that works on Windows, macOS, and Linux. [`node-gyp`](https://github.com/nodejs/node-gyp) reads this file and produces the platform-appropriate build files (MSVC project on Windows, Makefile on Linux, Xcode project on macOS), then invokes the compiler.

A minimal `binding.gyp` for a `node-addon-api` project looks like this:

```json
{
  "targets": [
    {
      "target_name": "my_addon",
      "sources": ["src/my_addon.cc"],
      "include_dirs": ["<!@(node -p \"require('node-addon-api').include\")"],
      "dependencies": ["<!(node -p \"require('node-addon-api').gyp\")"]
    }
  ]
}
```

The full GYP format is documented in the [GYP User Documentation](https://gyp.gsrc.io/docs/UserDocumentation.md).

## lib/binding.js

The `lib/` directory holds a thin JavaScript wrapper that loads the compiled binary and re-exports it. This layer keeps the binary-loading logic in one place and gives you a natural spot to add JavaScript-side validation or convenience methods.

A typical `binding.js` uses the [`bindings`](https://www.npmjs.com/package/bindings) package to resolve the path to the `.node` file regardless of platform:

```cjs
'use strict';
const addon = require('bindings')('my_addon');
module.exports = addon;
```

> If you install packages globally with npm and encounter `Error: EACCES: permission denied`, use [`nvm`](https://github.com/nvm-sh/nvm) to manage your Node.js installation. With nvm, global installs go into your home directory and never require `sudo`.
