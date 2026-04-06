---
authors: gabrielschulhof, NickNaso, jschlight, mhdawson, KevinEady, avivkeller
---

# Object Wrap

This tutorial is an alternative to [Your First Project](/learn/napi/getting-started/your-first-project.md). Instead of exporting a plain function, it demonstrates how to expose a C++ object as a JavaScript object using `node-addon-api`'s `ObjectWrap` class.

Before you start, make sure you've got all the necessary [prerequisites](/learn/napi/getting-started/prerequisites.md) and [tools](/learn/napi/getting-started/tools.md) installed, and read [Anatomy of a Node-API project](/learn/napi/getting-started/project-structure.md) to understand the common project layout and configuration files.

## Creating a project

Copy the Object Wrap example from the [node-addon-examples](https://github.com/nodejs/node-addon-examples) repository:

```bash
git clone https://github.com/nodejs/node-addon-examples.git
cp -r node-addon-examples/src/2-js-to-native-conversion/object-wrap-demo/node-addon-api object-wrap-demo
cd object-wrap-demo
npm install
```

Alternatively, set up the project manually:

```bash
mkdir object-wrap-demo
cd object-wrap-demo
npm init -y
npm install node-addon-api
```

Then create the source files described below. Once the project is set up, verify everything works:

```bash
npm test
```

## binding.gyp

The project's [**binding.gyp**](https://github.com/nodejs/node-addon-examples/blob/main/src/2-js-to-native-conversion/object-wrap-demo/node-addon-api/binding.gyp) follows the standard format (see [Anatomy of a Node-API project](/learn/napi/getting-started/project-structure.md#bindinggypjs) for a full explanation of the `binding.gyp` format and how `node-gyp` uses it).

## src/object_wrap_demo.h and src/object_wrap_demo.cc

[**object_wrap_demo.h**](https://github.com/nodejs/node-addon-examples/blob/main/src/2-js-to-native-conversion/object-wrap-demo/node-addon-api/src/object_wrap_demo.h) and [**object_wrap_demo.cc**](https://github.com/nodejs/node-addon-examples/blob/main/src/2-js-to-native-conversion/object-wrap-demo/node-addon-api/src/object_wrap_demo.cc) are the heart of the project. The `napi.h` header comes from `node-addon-api` and declares the C++ classes that represent JavaScript values.

`object_wrap_demo.cc` defines the `ObjectWrapDemo` C++ class:

- The **constructor** takes a single JavaScript string and stores it in the private member `_greeterName`.
- The **`Greet` method** takes a JavaScript string, prints two lines to stdout, and returns the value originally passed to the constructor.
- The **`GetClass` static method** returns the class descriptor that Node-API needs to know how to dispatch calls from JavaScript into the C++ methods.

The `Init` function exports the `ObjectWrapDemo` class by calling `ObjectWrapDemo::GetClass`. The `NODE_API_MODULE` macro at the bottom ensures `Init` is called when the module is loaded.

## lib/binding.js

[**binding.js**](https://github.com/nodejs/node-addon-examples/blob/main/src/2-js-to-native-conversion/object-wrap-demo/node-addon-api/lib/binding.js) defines an `ObjectWrapDemo` class that wraps the native binary. When `new ObjectWrapDemo(value)` is called, it creates the underlying C++ object and stores it as `_addonInstance`. The JavaScript `greet` method delegates to the same method on the C++ object.

## test/test_binding.js

[**test_binding.js**](https://github.com/nodejs/node-addon-examples/blob/main/src/2-js-to-native-conversion/object-wrap-demo/node-addon-api/test/test_binding.js) shows how to use the `ObjectWrapDemo` JavaScript class from `lib/binding.js`. Note that calling `greet` produces two lines of stdout output as a side-effect of the `printf` calls in the C++ code.

## Conclusion

This project shows how to use `ObjectWrap` to expose a stateful C++ object as a JavaScript object. Some things to try next:

- Run `test_binding.js` in your debugger. Step through the code and observe what the JavaScript object looks like from the debugger's perspective.
- Modify `test_binding.js` to require the compiled binary directly rather than through `binding.js` and observe the difference in the debugger.
- Extend `object_wrap_demo.cc` to export additional methods or properties on the `ObjectWrapDemo` class.
