---
authors: gabrielschulhof, NickNaso, jschlight, mhdawson, KevinEady, avivkeller
---

# Object and Function References

JavaScript implements a dynamic memory model. When objects are no longer reachable, they become eligible for reclamation by the garbage collector running in the background.

There are situations when you need to ensure that objects created by your Node-API code remain allocated. In this case you need to explicitly create a reference to them. This is the purpose of the `ObjectReference` and `FunctionReference` classes.

## Persistent Reference

Object and function references can be instantiated as either `Weak` or `Persistent`.

A `Persistent` reference initializes the internal reference count to one which prevents reclamation of the object's memory by the garbage collector. The referenced object will remain in memory for the life of the `Persistent` reference.

Using a `Persistent` reference makes sense in the case where the duration of the reference is known ahead of time. The internal reference count is decremented when the `Persistent` reference is deleted. This will make the referenced object eligible for deletion if the internal reference count goes to zero.

The most common case for using a `Persistent` reference is when you create a JavaScript class in your Node-API code and you need to insure its constructor remains allocated by the JavaScript runtime engine.

## Weak Reference

For more complex implementations where multiple AsyncWorkers rely on the referenced object, it may make better sense to use a `Weak` reference which initializes the internal reference count to zero. The reference count can then be maintained using the `Reference` `Ref` and `Unref` methods.

The most common use case for a `Weak` reference is when your Node-API code needs to monitor when a JavaScript object you've created in your Node-API code is released by the garbage collector.

## ObjectReference

The `ObjectReference` class inherits from the `Reference` class. The value it adds is a collection of `Get` and `Set` methods that manipulate the referenced object's properties.

## FunctionReference

Like the `ObjectReference`, the `FunctionReference` class inherits from the `Reference` class. While the `ObjectReference` class adds the `Get` and `Set` methods, the `FunctionReference` class adds a set of `Call` methods that implement calls to the function.

## Example

This example code shows how to use the `FunctionReference` class.

### src/native-addon.h

[**native-addon.h**](https://github.com/nodejs/node-addon-examples/blob/main/src/4-references-and-handle-scope/function-reference-demo/node-addon-api/src/native-addon.h) declares the `NativeAddon` C++ class, which has two data members populated in the constructor:

- `Napi::FunctionReference jsFnRef`
- `Napi::Function jsFn`

### src/native-addon.cc

[**native-addon.cc**](https://github.com/nodejs/node-addon-examples/blob/main/src/4-references-and-handle-scope/function-reference-demo/node-addon-api/src/native-addon.cc) contains the `NativeAddon` implementation. The constructor, which is called from JavaScript, takes two function arguments. The first argument is stored as a `Napi::FunctionReference` and the second is stored as a `Napi::Function`.

> _There is a deliberate error in this code._

The second function is stored in the `Napi::Function jsFn` data member. **This is an error** because the lifetime of the second argument is limited to the lifetime of the constructor. The value of the `jsFn` data member will be invalid after the constructor returns. The first argument is stored in the `Napi::FunctionReference jsFnRef`. Because of the use of the `Napi::FunctionReference`, the value of `jsFnRef` will remain valid after the constructor returns.

The `NativeAddon` class implements two methods which can be called from JavaScript: `TryCallByStoredReference` and `TryCallByStoredFunction`. Notice that the `Call` method is used the same way for both the `jsFnRef` and `jsFn` data members.

### src/binding.cc

[**binding.cc**](https://github.com/nodejs/node-addon-examples/blob/main/src/4-references-and-handle-scope/function-reference-demo/node-addon-api/src/binding.cc) is a standard binding file that registers the `NativeAddon` class with Node-API.

### index.js

[**index.js**](https://github.com/nodejs/node-addon-examples/blob/main/src/4-references-and-handle-scope/function-reference-demo/node-addon-api/index.js) shows the use of the `NativeAddon` class from JavaScript. Note that the call to the native `tryCallByStoredFunction` method fails because the data member on which it relies is not valid.
