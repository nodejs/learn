---
authors: flaviocopes, MylesBorins, LaRuaNa, ahmadawais, ovflowd, marksist300
---

# Understanding process.nextTick()

As you try to understand the Node.js event loop, one important part of it is `process.nextTick()`.
Every time the runtime calls back into JavaScript for an event, we call it a tick.

When we pass a function to `process.nextTick()`, we schedule it to run immediately after the current call stack completes, before the event loop continues and before any other queued tasks or phases are processed:

```js
process.nextTick(() => {
  // do something
});
```

The event loop is busy processing the current function code. When this operation ends, the JS engine runs all the functions passed to `nextTick` calls during that operation.

It's the way we can tell the JS engine to process a function asynchronously (after the current function), but as soon as possible, not queue it.

Calling `setTimeout(() => {}, 0)` schedules the callback for a future event loop iteration, much later than when using `process.nextTick()`, which executes before the event loop continues.

Use `nextTick()` when you want to make sure that in the next event loop iteration that code is already executed.

To learn more about the order of execution and how the event loop works, check out [the dedicated article](/learn/asynchronous-work/event-loop-timers-and-nexttick)
