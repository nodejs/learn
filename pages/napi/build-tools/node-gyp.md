---
authors: gabrielschulhof, NickNaso, jschlight, mhdawson, KevinEady, avivkeller
---

# node-gyp

[node-gyp](https://github.com/nodejs/node-gyp) is the standard build tool for native Node.js addons and is used by the vast majority of packages in the npm ecosystem. It is actively maintained by the Node.js team. Most of the examples on this site use node-gyp to build binaries.

node-gyp is based on Google's [GYP](https://gyp.gsrc.io/) build tool. GYP provides a single cross-platform configuration format for C/C++ builds. Although Google archived the upstream GYP repository, node-gyp continues to receive active development and maintenance independently.

> node-gyp requires **Python 3.6 or later**. Python 2 is not supported. The full list of requirements for each platform can be found in the [node-gyp installation docs](https://github.com/nodejs/node-gyp#installation).

node-gyp is included with npm; when npm sees `"gypfile": true` in `package.json`, it invokes node-gyp automatically during `npm install`. You can also install and use it directly:

```bash
npm install -g node-gyp
```

For developers who find node-gyp too constraining, [CMake.js](/learn/napi/build-tools/cmake-js.md) is a good alternative.

### Pros

- Included with npm - no separate global install required for consumers.
- Nearly universally used in the Node.js ecosystem, with broad documentation and community knowledge.
- Supports Windows, macOS, and Linux from a single `binding.gyp` configuration file.

### Cons

- The underlying GYP format is no longer actively developed by Google.
- Some developers find GYP's configuration syntax verbose or difficult to debug.
