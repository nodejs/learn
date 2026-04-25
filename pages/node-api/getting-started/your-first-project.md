---
authors: gabrielschulhof, NickNaso, jschlight, mhdawson, KevinEady, avivkeller
---

# Your First Project

Before you start, make sure you've got all the necessary [prerequisites](/learn/node-api/getting-started/prerequisites.md) and [tools](/learn/node-api/getting-started/tools.md) installed, and read [Anatomy of a Node-API project](/learn/node-api/getting-started/project-structure.md) to understand the common layout and configuration files shared by all `node-addon-api` projects.

This tutorial uses `node-addon-api` at the C++ wrapper level.

## Creating a project

The quickest way to get a working project is to copy the Hello World example from the [node-addon-examples](https://github.com/nodejs/node-addon-examples) repository:

```bash
git clone https://github.com/nodejs/node-addon-examples.git
cp -r node-addon-examples/src/1-getting-started/a-first-project/node-addon-api hello-world
cd hello-world
npm install
```

Alternatively, set up the project manually:

```bash
mkdir hello-world
cd hello-world
npm init -y
npm install node-addon-api
```

Then create the source files described below. Once the project is set up, verify everything works:

```bash
npm test
```

## src/hello_world.cc

[`hello_world.cc`](https://github.com/nodejs/node-addon-examples/blob/main/src/1-getting-started/a-first-project/node-addon-api/src/hello_world.cc) is perhaps the simplest useful Node-API file you can write.

The file defines a C++ `Method` function that takes a single `Napi::CallbackInfo&` argument. This `info` object provides access to the JavaScript environment, including any arguments passed in from JavaScript.

> `info` behaves like an array of JavaScript arguments.

`Method` uses `info` to obtain a `Napi::Env`, then creates and returns a `Napi::String` with the value `"world"`.

The `Init` function registers the single export from this module: the name `"HelloWorld"` maps to the `Method` function.

The `NODE_API_MODULE` macro at the bottom ensures `Init` is called when the module is loaded.

## lib/binding.js

[`binding.js`](https://github.com/nodejs/node-addon-examples/blob/main/src/1-getting-started/a-first-project/node-addon-api/lib/binding.js) loads the compiled binary and re-exports its contents. The sole export from the binary is the `HelloWorld` function.

## test/test_binding.js

[`test_binding.js`](https://github.com/nodejs/node-addon-examples/blob/main/src/1-getting-started/a-first-project/node-addon-api/test/test_binding.js) uses `require` to load the `HelloWorld` function from `binding.js`. The `testBasic` function calls it and verifies the result.

## Conclusion

This project demonstrates a minimal Node-API module that exports a single function. Some things to try next:

- Run `test_binding.js` in your debugger. Step through the code and observe what visibility you have into the JavaScript object created by the C++ code.
- Modify `test_binding.js` to require the compiled binary directly instead of going through `binding.js`. Step through in the debugger and note the difference.
- Modify `hello_world.cc` to read arguments passed from JavaScript. The [`node-addon-api` examples](https://github.com/nodejs/node-addon-api#examples) are a good reference.
