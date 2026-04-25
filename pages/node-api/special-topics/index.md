---
authors: avivkeller
---

# Special Topics

This section covers advanced Node-API patterns that you will encounter once your native addon grows beyond a simple synchronous function call.

## Topics covered

- [Object and function references](/learn/node-api/special-topics/object-function-refs.md) - using `ObjectReference` and `FunctionReference` to keep JavaScript objects alive across call boundaries so the garbage collector does not reclaim them prematurely
- [AsyncWorker](/learn/node-api/special-topics/asyncworker.md) - running long-running C/C++ operations on a background thread using `node-addon-api`'s `AsyncWorker` class, keeping Node's event loop unblocked
- [Thread-safe functions](/learn/node-api/special-topics/thread-safe-functions.md) - calling back into JavaScript from native threads that are not the main Node.js thread, using the thread-safe function API
- [Context awareness](/learn/node-api/special-topics/context-awareness.md) - writing addons that load and unload correctly in the presence of [Worker Threads](https://nodejs.org/api/worker_threads.html), including instance data and cleanup hooks

## When do these topics apply?

| Topic                      | When you need it                                                                    |
| -------------------------- | ----------------------------------------------------------------------------------- |
| Object/function references | Storing a JS callback or object in a C++ data member that outlives the current call |
| AsyncWorker                | Offloading CPU-bound or blocking I/O work off the main thread                       |
| Thread-safe functions      | Invoking JS callbacks from native threads you manage yourself                       |
| Context awareness          | Your addon is used in Worker Thread environments or loaded/unloaded multiple times  |
