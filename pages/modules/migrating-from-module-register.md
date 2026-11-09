---
authors: GeoffreyBooth
---

# Migrating from `module.register()` to `module.registerHooks()`

Node.js 27 removes `module.register()` and the `--experimental-loader` and `--loader` flags ([DEP0205](https://nodejs.org/api/deprecations.html#dep0205-moduleregister)). These provided _asynchronous_ module customization hooks, which ran on a separate loader thread. They were documented as experimental, deprecated in the docs in Node.js 24.15.0 and 25.9.0, and began printing a runtime warning in Node.js 26.0.0.

[`module.registerHooks()`](https://nodejs.org/api/module.html#moduleregisterhooksoptions) is the replacement. It takes the same kinds of hooks (`resolve` and `load`), but they are synchronous and run on the thread that loads your modules. In most cases that makes them simpler to write and faster to run.

## Pick your path

| Your hooks…                                                              | Do this                                                                                                                                                           |
| ------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| can run synchronously on the main thread (most can)                      | Rewrite them for `registerHooks()`, as described [below](#rewriting-your-hooks).                                                                                  |
| depend on asynchronous work, and you can’t or don’t want to rewrite them | Use [`module-register-ponyfill`](https://github.com/joyeecheung/module-register-ponyfill), a drop-in `register()` built on `registerHooks()` and a worker thread. |
| need their own off-thread design                                         | Build it on `registerHooks()` plus a worker; [`everysync`](https://github.com/mcollina/everysync) turns async worker APIs into synchronous calls.                 |

`registerHooks()` is available in Node.js 22.15.0 and later (and 23.5.0 and later). If your package supports older versions, feature-detect it:

```js
import module from 'node:module';

if (typeof module.registerHooks === 'function') {
  module.registerHooks({ resolve, load });
} else {
  module.register('./hooks.mjs', import.meta.url);
}
```

## Rewriting your hooks

An asynchronous hooks module, registered with `register()`:

```js
// hooks.mjs
export async function resolve(specifier, context, nextResolve) {
  if (specifier === 'virtual:greeting') {
    return { url: 'virtual:greeting', shortCircuit: true };
  }
  return nextResolve(specifier, context);
}

export async function load(url, context, nextLoad) {
  if (url === 'virtual:greeting') {
    return {
      format: 'module',
      source: 'export default "hello"',
      shortCircuit: true,
    };
  }
  return nextLoad(url, context);
}
```

```js
// register.mjs
import { register } from 'node:module';

register('./hooks.mjs', import.meta.url);
```

The same hooks, registered with `registerHooks()`:

```js
// register.mjs
import { registerHooks } from 'node:module';

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === 'virtual:greeting') {
      return { url: 'virtual:greeting', shortCircuit: true };
    }
    return nextResolve(specifier, context);
  },
  load(url, context, nextLoad) {
    if (url === 'virtual:greeting') {
      return {
        format: 'module',
        source: 'export default "hello"',
        shortCircuit: true,
      };
    }
    return nextLoad(url, context);
  },
});
```

The hook functions have the same names, arguments and return values. What changed:

- Remove `async` and `await`. `nextResolve()` and `nextLoad()` return their results directly.
- Pass the hooks straight to `registerHooks()` instead of exporting them from a separate module, so there is no specifier or `parentURL` to resolve. You can still keep them in their own file and `import` them.

Run your app with the registration file preloaded, the same way you did before:

```bash
node --import ./register.mjs app.mjs
```

## Replacing `--loader` and `--experimental-loader`

These flags took a module that exported hooks. Replace the flag with `--import` and a small file that registers them:

```bash
# Before (removed)
node --experimental-loader ./hooks.mjs app.mjs

# After
node --import ./register.mjs app.mjs
```

Running Node.js 27 with either flag fails with `bad option: --loader` (or `--experimental-loader`).

## What behaves differently

### Hooks run on the main thread

Asynchronous hooks had their own thread and global scope, so they passed data through `initialize()`, the `data` option and message ports. Synchronous hooks share your application’s thread and globals, so none of that is needed. Use a closure or module-level state instead:

```js
import { registerHooks } from 'node:module';

const prefix = '>> '; // was passed through `initialize({ prefix })`

registerHooks({
  resolve(specifier, context, nextResolve) {
    console.log(prefix + 'resolving', specifier);
    return nextResolve(specifier, context);
  },
});
```

There is no `initialize` hook, `data` option or `transferList` option. A slow hook now blocks your application instead of a background thread, so keep them fast.

### Hooks can’t be asynchronous

If a hook awaited something, such as a file read, replace it with a synchronous equivalent:

```js
import { registerHooks } from 'node:module';
import { readFileSync } from 'node:fs';

registerHooks({
  load(url, context, nextLoad) {
    if (url.endsWith('.txt')) {
      return {
        format: 'module',
        shortCircuit: true,
        source: `export default ${JSON.stringify(readFileSync(new URL(url), 'utf8'))};`,
      };
    }
    return nextLoad(url, context);
  },
});
```

If the work can’t be made synchronous (a network request, for example), see [Hooks that need asynchronous work](#hooks-that-need-asynchronous-work).

## Hooks that need asynchronous work

Two options keep the asynchronous work off your main thread.

### Keep your hooks module as it is

[`module-register-ponyfill`](https://github.com/joyeecheung/module-register-ponyfill) provides `register()` on top of `registerHooks()`, a worker thread and `Atomics`, so an existing hooks module works unchanged. Install it, then replace `import { register } from 'node:module'` with an import from the package:

```js
// register.mjs
import { register } from 'module-register-ponyfill';

register('./hooks.mjs', import.meta.url);
```

### Build a bridge with `everysync`

[`everysync`](https://github.com/mcollina/everysync) lets synchronous code call an asynchronous function that runs in a worker thread: the caller blocks until the worker’s promise settles. That is what a synchronous `load` hook needs to fetch modules from a URL, for example.

First, the worker exposes the asynchronous work:

```js
// fetch-worker.mjs
import { wire } from 'everysync';
import { workerData } from 'node:worker_threads';

wire(workerData.buffer, {
  async fetchText(url) {
    const response = await fetch(url);
    return await response.text();
  },
});

// Keep the worker's event loop alive.
setInterval(() => {}, 100000);
```

Then the registration file starts the worker and calls it from the hooks as if it were synchronous:

```js
// register.mjs
import { registerHooks } from 'node:module';
import { Worker } from 'node:worker_threads';
import { makeSync } from 'everysync';

const buffer = new SharedArrayBuffer(1024, {
  maxByteLength: 64 * 1024 * 1024,
});
const worker = new Worker(new URL('./fetch-worker.mjs', import.meta.url), {
  workerData: { buffer },
  execArgv: [], // Don't re-run this file (via --import) inside the worker.
});
worker.unref(); // Don't let the worker keep the process alive.
const { fetchText } = makeSync(buffer);

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith('https://')) {
      return { url: specifier, shortCircuit: true };
    }
    return nextResolve(specifier, context);
  },
  load(url, context, nextLoad) {
    if (url.startsWith('https://')) {
      return { format: 'module', source: fetchText(url), shortCircuit: true };
    }
    return nextLoad(url, context);
  },
});
```

```bash
node --import ./register.mjs app.mjs
```

Two details matter. Pass `execArgv: []` when you preload the registration file with `--import`, because workers inherit your flags and would otherwise run `register.mjs` themselves and start another worker (`makeSync()` then fails with “The initialization timed out”). And remember that the calling thread is blocked while the worker waits on the network, so this suits tooling and development more than hot paths.

### Hooks now apply to `require()` too

Asynchronous hooks did not affect every `require()` call in a CommonJS module graph. Synchronous hooks run for `import`, `require()` and `createRequire()`, so a hook that previously only saw `import` will now also see CommonJS loads. If your hook assumes every module is ESM, check `context.format` or `context.conditions`.

### Workers don’t inherit hooks

Hooks registered with `registerHooks()` apply only to the thread that registered them. To use them in worker threads, either call `registerHooks()` in each worker, or register them in a file preloaded with `--import` (or `--require`); workers inherit those flags through `process.execArgv`:

```bash
node --import ./register.mjs app.mjs
```

### Register before loading the modules you want to customize

As before, hooks only affect modules loaded after they are registered. Preloading with `--import` guarantees this. If you register inside your application, load the customized modules afterward with a dynamic `import()`:

```js
import './register.mjs';

const { default: greeting } = await import('virtual:greeting');
```

## Troubleshooting

- `bad option: --loader` or `bad option: --experimental-loader`: see [Replacing `--loader`](#replacing---loader-and---experimental-loader).
- `SyntaxError: The requested module 'node:module' does not provide an export named 'register'`, or `module.register is not a function`: switch to `registerHooks()`, as described [above](#rewriting-your-hooks).
- A hook that worked before now fails with `Promise` or `await` errors: it is probably returning a promise from a synchronous hook. Remove `async`.

For the full hook reference, including the `context` objects and every return value, see the [`module` API documentation](https://nodejs.org/api/module.html#customization-hooks).
