---
authors: gabrielschulhof, NickNaso, jschlight, mhdawson, KevinEady, avivkeller
---

# Node-API

[Node-API](https://nodejs.org/api/n-api.html) is a stable C API built into Node.js that lets C/C++ code create, read, and manipulate JavaScript values as if they were created by JavaScript itself. It was introduced experimentally in Node.js 8.0.0 and became stable (no longer behind a flag) in Node.js 12.

Because Node-API is part of Node.js itself, it requires no additional installation.

## Why Node-API instead of NAN?

Before Node-API, the dominant approach for native addon development was [Native Abstractions for Node.js (NAN)](https://github.com/nodejs/nan). NAN works by calling directly into the [V8](https://developers.google.com/v8/) API, which changes with every major V8 release. This means NAN-based addons often need to be recompiled - and sometimes updated - when Node.js ships a new V8 version.

Node-API abstracts the JavaScript engine behind a stable interface. This gives you two important guarantees:

1. **Backward compatibility** - a module built today will run on all future versions of Node.js without any recompilation or code changes.
2. **ABI stability** - because the API is ABI-stable, the compiled `.node` binary itself continues to work across Node.js releases.

## Common use cases

### Wrapping an existing C/C++ library

The most common reason to write a native addon is to expose an existing C/C++ library to JavaScript developers. Node-API lets you maintain your C/C++ code independently and keep the JavaScript bindings in sync with minimal effort.

### Accessing OS resources

Some applications - such as those built with [Electron](https://electronjs.org) or [NW.js](https://nwjs.io) - need access to system APIs that Node.js does not expose. Node-API provides the hooks to reach those resources.

### Computationally intensive work

For compute-heavy tasks, writing the hot path in C or C++ and calling it from JavaScript via Node-API can yield significant performance gains. Unlike JIT-compiled JavaScript, the compiled C/C++ binary is available to Node.js immediately without a warm-up phase.

## `node-addon-api`

An important companion to Node-API is the npm package [`node-addon-api`](https://www.npmjs.com/package/node-addon-api). It wraps the C API in an idiomatic C++ object model, reducing boilerplate and making common patterns - like wrapping C++ objects as JavaScript objects - much more ergonomic. It retains the full ABI-stability guarantee of Node-API.

Most of the examples on this site use `node-addon-api`.
