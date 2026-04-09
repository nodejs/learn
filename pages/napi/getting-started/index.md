---
authors: avivkeller
---

# Getting Started with Node-API

This section walks you through everything you need to begin building native Node.js addons with Node-API. It is designed for developers who are new to native addon development and want a guided path from zero to a working module.

## What you will learn

- [Prerequisites](/learn/napi/getting-started/prerequisites.md) - the C/C++ and JavaScript knowledge you need before diving in
- [The tools you'll need](/learn/napi/getting-started/tools.md) - how to install Node, npm, Git, and the C/C++ toolchain on Windows, macOS, and Linux
- [Anatomy of a Node-API project](/learn/napi/getting-started/project-structure.md) - the common directory layout, `package.json` entries, `binding.gyp`, and the JavaScript wrapper layer shared by every `node-addon-api` project
- [Your first project](/learn/napi/getting-started/your-first-project.md) - building and running your first Node-API module
- [ObjectWrap](/learn/napi/getting-started/objectwrap.md) - exposing C++ objects as JavaScript objects using `node-addon-api`'s `ObjectWrap` class
- [Migrating from NAN](/learn/napi/getting-started/migration.md) - converting an existing NAN-based addon to Node-API

## Which API level should I use?

Node-API operates at two levels:

- **C API** - built directly into Node.js and documented on the [Node.js API pages](https://nodejs.org/api/n-api.html). Gives you maximum control and no extra dependencies.
- **C++ wrapper (`node-addon-api`)** - an npm package that wraps the C API in a friendlier C++ object model. Recommended for most projects because it reduces boilerplate significantly while preserving full ABI stability.

The examples in this section use `node-addon-api`.
