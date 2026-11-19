---
authors: GeoffreyBooth
---

# Using module customization hooks

Module customization hooks let you change how Node.js resolves and loads modules, without touching the modules themselves. A `resolve` hook decides what a specifier such as `'./app'` or `'lodash'` points to, and a `load` hook decides what source code and format the resulting URL has. With them you can:

- add support for file types Node.js doesn’t load natively, such as JSX, SVG or CoffeeScript
- serve virtual modules that don’t exist on disk
- redirect or alias specifiers
- mock modules in tests

Hooks are registered with [`module.registerHooks()`](https://nodejs.org/api/module.html#moduleregisterhooksoptions), which is available in Node.js 22.15.0 and later. It takes synchronous hooks that run on the same thread as your modules. Some hooks need to wait on something asynchronous, like a network request; [that case is covered below](#asynchronous-work).

For the full hook reference, including the `context` objects and every return value, see the [`module` API documentation](https://nodejs.org/api/module.html#customization-hooks).

## Synchronous work

### What is “synchronous work”

A hook is synchronous if it knows its result by the time it returns. Rewriting a specifier, matching a file extension, reading a file with `readFileSync()` and transforming source text with a synchronous compiler all qualify. Most hooks work this way:

```js
// A load hook is a synchronous function and must return an object.
function load(url, context, nextLoad) {
  const source = fs.readFileSync(new URL(url), 'utf8');
  // The result is already known by the time the function returns.
  return { format: 'module', shortCircuit: true, source };
}
```

A hook can’t be synchronous if its result only becomes available later, in a callback or a promise, because the function has already returned by then:

```js
function load(url, context, nextLoad) {
  fs.readFile(new URL(url), 'utf8', (err, data) => {
    // The result is only available in this callback…
  });
  // …so it isn’t known yet when the function returns.
}
```

```js
function load(url, context, nextLoad) {
  fs.promises.readFile(new URL(url), 'utf8').then(data => {
    // The result is only available in this callback…
  });
  // …so it isn’t known yet when the function returns.
}
```

For that case, see [asynchronous work](#asynchronous-work) below.

### How to do it with `module.registerHooks()`

Pass `resolve` and/or `load` functions to `registerHooks()`. Each receives the usual arguments plus a `nextResolve()` or `nextLoad()` function that calls the next hook in the chain (or Node.js’s default behavior), and returns its result directly:

```js
// register.js
import { registerHooks } from 'node:module';
import { readFileSync } from 'node:fs';

registerHooks({
  load(url, context, nextLoad) {
    if (new URL(url).searchParams.has('raw')) {
      const text = readFileSync(new URL(url), 'utf8');
      return {
        format: 'module',
        shortCircuit: true,
        source: `export default ${JSON.stringify(text)};`,
      };
    }
    return nextLoad(url, context);
  },
});
```

```js
// app.js
import greeting from './greeting.txt?raw';

console.log(greeting); // The contents of greeting.txt
```

This hook makes any import that ends in `?raw` return the file’s contents as a string, a convention borrowed from [Vite](https://vite.dev/guide/assets#importing-asset-as-string). It works for any file type, so `./styles.css?raw` would work too.

Run your app with the registration file preloaded, so that the hooks are in place before any of your modules load:

```sh
node --import ./register.js app.js
```

A `resolve` hook works the same way: it receives `(specifier, context, nextResolve)`, and either returns its own `{ url, shortCircuit: true }` or calls `nextResolve()`. You can also put the hooks in their own file and `import` them into the registration file.

The examples below match files with `url.endsWith('.jsx')` or similar to keep them short, but that isn’t robust enough for real use: hooks often pass information along in a query string, which comes after the file extension (`Greeting.jsx?v=2`), so a check like `endsWith('.jsx')` would miss it. Parse the URL, as the hook above does, and check its `pathname` instead.

Hooks can also run a compiler synchronously. This one makes `.jsx` files importable, using [esbuild](https://esbuild.github.io/)’s synchronous `transformSync()` to compile them:

```js
// register.js
import { registerHooks } from 'node:module';
import { readFileSync } from 'node:fs';
import { transformSync } from 'esbuild';

registerHooks({
  load(url, context, nextLoad) {
    if (url.endsWith('.jsx')) {
      const source = readFileSync(new URL(url), 'utf8');
      const { code } = transformSync(source, {
        loader: 'jsx',
        jsx: 'automatic',
        format: 'esm',
        sourcefile: new URL(url).pathname,
      });
      return { format: 'module', shortCircuit: true, source: code };
    }
    return nextLoad(url, context);
  },
});
```

```jsx
// Greeting.jsx
export function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}
```

```jsx
// app.jsx
import { renderToStaticMarkup } from 'react-dom/server';
import { Greeting } from './Greeting.jsx';

console.log(renderToStaticMarkup(<Greeting name="world" />)); // <h1>Hello, world!</h1>
```

```sh
node --import ./register.js app.jsx
```

The same approach works for any language that compiles to JavaScript. For example, a hook for CoffeeScript, using the [`coffeescript`](https://coffeescript.org/) package:

```js
// register.js
import { registerHooks } from 'node:module';
import { readFileSync } from 'node:fs';
import CoffeeScript from 'coffeescript';

registerHooks({
  load(url, context, nextLoad) {
    if (url.endsWith('.coffee')) {
      const source = readFileSync(new URL(url), 'utf8');
      return {
        format: 'module',
        shortCircuit: true,
        source: CoffeeScript.compile(source, { bare: true }),
      };
    }
    return nextLoad(url, context);
  },
});
```

```coffee
# greet.coffee
export greet = (name) -> "Hello, #{name}!"
```

```js
// app.js
import { greet } from './greet.coffee';

console.log(greet('world')); // Hello, world!
```

Because hooks run on your application’s thread, they share its globals, so state can live in a closure or a module-level variable:

```js
import { registerHooks } from 'node:module';

const prefix = '>> ';

registerHooks({
  resolve(specifier, context, nextResolve) {
    console.log(prefix + 'resolving', specifier);
    return nextResolve(specifier, context);
  },
});
```

A slow hook blocks your application, so keep them fast.

For a collection of robust, ready-made hooks and more examples, see [`@nodejs-loaders`](https://github.com/nodejs-loaders/nodejs-loaders).

### Things to keep in mind

#### Workers don’t inherit hooks

Hooks registered with `registerHooks()` apply only to the thread that registered them. To use them in worker threads, either call `registerHooks()` in each worker, or register them in a file preloaded with `--import` (or `--require`); workers inherit those flags through `process.execArgv`:

```sh
node --import ./register.js app.js
```

#### Register before loading the modules you want to customize

Hooks only affect modules loaded after they are registered. Preloading with `--import` guarantees this. If you register inside your application, load the customized modules afterward with a dynamic `import()`:

```js
import './register.js';

const { default: greeting } = await import('./greeting.txt?raw');
```

## Asynchronous work

### What is “asynchronous work”

This tends to be more edge-case. A hook does asynchronous work if it has to wait for something before it can return, such as a network request or a call into a library that runs concurrently (exposing that via promise-based APIs). `registerHooks()` can’t wait on a promise—its hooks must return their results directly. To get that work done anyway, do it on a different thread, block the thread that loads your modules until the result is ready, and return the result synchronously.

Doing the work synchronously is preferable whenever you can: it’s simpler, and it avoids the overhead of communicating between threads.

### Doing the work on a worker thread

Say a hook needs to fetch a module’s source over the network. Written naively, it would look like this, but `fetch()` and `response.text()` both return promises:

```js
function getSource(url) {
  const response = fetch(url); // But fetch is asynchronous!
  const text = response.text(); // And so is response.text()!
  return text;
}

function load(url, context, nextLoad) {
  return { source: getSource(url), shortCircuit: true, format: 'module' };
}
```

Instead, `getSource()` can do the fetching in a worker thread, block on it with [`Atomics.wait()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Atomics/wait) until the worker signals that it’s done, and read the result synchronously with [`receiveMessageOnPort()`](https://nodejs.org/api/worker_threads.html#worker_threadsreceivemessageonportport):

```js
// register.js
import { registerHooks } from 'node:module';
import {
  MessageChannel,
  receiveMessageOnPort,
  Worker,
} from 'node:worker_threads';

// Fetch the source on a different thread and block until it returns.
function getSource(url) {
  const { port1, port2 } = new MessageChannel();
  const notifyHandle = new Int32Array(new SharedArrayBuffer(4));

  new Worker(
    `
    const { workerData } = require('node:worker_threads');
    const { url, notifyHandle, port2 } = workerData;

    (async () => {
      try {
        const response = await fetch(url);
        port2.postMessage({ text: await response.text() });
      } catch (error) {
        port2.postMessage({ error });
      } finally {
        // Always wake up the loading thread, even on failure.
        Atomics.store(notifyHandle, 0, 1);
        Atomics.notify(notifyHandle, 0);
      }
    })();
    `,
    {
      eval: true,
      workerData: { url, notifyHandle, port2 },
      transferList: [port2],
    }
  );

  // Block until the worker finishes.
  Atomics.wait(notifyHandle, 0, 0);

  // Retrieve the result synchronously.
  const { text, error } = receiveMessageOnPort(port1).message;
  if (error) throw error;
  return text;
}

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith('https://')) {
      return { url: specifier, shortCircuit: true };
    }
    return nextResolve(specifier, context);
  },
  load(url, context, nextLoad) {
    if (url.startsWith('https://')) {
      return { format: 'module', shortCircuit: true, source: getSource(url) };
    }
    return nextLoad(url, context);
  },
});
```

```sh
node --import ./register.js app.js
```

Now `app.js` can `import` a module from an `https://` URL.

This starts a new worker for every request, to keep the example short. A hook that handles many requests should start one worker and reuse it.

Blocking is only safe as long as the worker never needs the blocked thread to make progress. If the worker waits for a message from the thread that’s loading your modules, or loads modules that go through the same hooks, both threads end up waiting for each other, and your application hangs. It also hangs if the worker never signals completion, which is why the example signals in a `finally` block. `Atomics.wait()` accepts a timeout as its fourth argument if you want a limit.

### Using a library

Libraries wrap this same idea. For a simple hook like the one above, writing it yourself is usually clearer. For anything more complex, it’s better to write the worker yourself, so that you control how the threads communicate; a library’s preset thread orchestration is a black box, and not being able to see how the threads talk to each other is what tends to cause confusing deadlocks. If you’d rather use one, there are two.

#### `module-register-ponyfill`

[`module-register-ponyfill`](https://github.com/joyeecheung/module-register-ponyfill) lets you write hooks as a module whose `resolve` and `load` functions are `async`. Its `register()` function runs that module on a worker thread, and uses `registerHooks()` and `Atomics` to make the results available to the loader synchronously. Install it with `npm install module-register-ponyfill`, then write the hooks module:

```js
// hooks.js
export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith('https://')) {
    return { url: specifier, shortCircuit: true };
  }
  return nextResolve(specifier, context);
}

export async function load(url, context, nextLoad) {
  if (url.startsWith('https://')) {
    const response = await fetch(url);
    return {
      format: 'module',
      source: await response.text(),
      shortCircuit: true,
    };
  }
  return nextLoad(url, context);
}
```

And register it:

```js
// register.js
import { register } from 'module-register-ponyfill';

register('./hooks.js', import.meta.url);
```

```sh
node --import ./register.js app.js
```

Now `app.js` can `import` a module from an `https://` URL. The hooks module runs on its own thread, so it has its own global scope and doesn’t share state with your application.

The ponyfill has a few limitations; see its [known divergences](https://github.com/joyeecheung/module-register-ponyfill#known-divergences-from-native-moduleregister). For example, hooks registered by one `register()` call don’t affect how later hooks modules are loaded, so a hook that enables JSX won’t let you write the next hooks module in JSX.

#### `everysync`

[`everysync`](https://github.com/mcollina/everysync) lets synchronous code call an asynchronous function that runs in a worker thread: the caller blocks until the worker’s promise settles or a timeout expires. That is what a synchronous `load` hook needs to fetch modules from a URL, for example.

First, the worker exposes the asynchronous work:

```js
// fetch-worker.js
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
// register.js
import { registerHooks } from 'node:module';
import { Worker } from 'node:worker_threads';
import { makeSync } from 'everysync';

const buffer = new SharedArrayBuffer(1024, {
  maxByteLength: 64 * 1024 * 1024,
});
const worker = new Worker(new URL('./fetch-worker.js', import.meta.url), {
  workerData: { buffer },
  execArgv: [], // Don't re-run this file (via --import) inside the worker.
});
worker.unref(); // Don't let the worker keep the process alive.
// The default timeout is 1 second per call, so allow longer for the network.
const { fetchText } = makeSync(buffer, { timeout: 30_000 });

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

```sh
node --import ./register.js app.js
```

Two details matter. Pass `execArgv: []` when you preload the registration file with `--import`, because workers inherit your flags and would otherwise run `register.js` themselves and start another worker (`makeSync()` then fails with “The initialization timed out”). And remember that the calling thread is blocked while the worker waits on the network, so this suits tooling and development more than hot paths. `everysync` gives up after one second by default (`The response timed out after 1000ms`), so choose a `timeout` that suits your slowest request.

## End of life for `module.register()`

Earlier versions of Node.js had another way to register hooks: `module.register()`, along with the `--experimental-loader` and `--loader` flags. Those ran asynchronous hooks on a separate loader thread. Node.js 27 removes them ([DEP0205](https://nodejs.org/api/deprecations.html#dep0205-moduleregister)); they were deprecated in the documentation in Node.js 24.15.0 and 25.9.0, and began printing a runtime warning in Node.js 26.0.0.

If you have code that still uses them, the [`module-register-to-register-hooks`](https://github.com/nodejs/userland-migrations) codemod, one of the [userland migrations](/learn/getting-started/userland-migrations), rewrites the common cases for you. Hooks that do asynchronous work can use the approaches in [Asynchronous work](#asynchronous-work) instead.

If your package has to support versions of Node.js with and without `registerHooks()`, feature-detect it. The snippet below is a simplified sketch: a robust implementation also has to detect whether the hook chain is synchronous or asynchronous, which [`@nodejs-loaders`](https://github.com/nodejs-loaders/nodejs-loaders) handles for you. Check for `registerHooks()` first, then for `module.register()` (which only exists in older versions), and handle versions that have neither:

```js
import module from 'node:module';

if (typeof module.registerHooks === 'function') {
  module.registerHooks({ resolve, load });
} else if (typeof module.register === 'function') {
  module.register('./hooks.js', import.meta.url);
} else {
  // This version of Node.js doesn't support customization hooks at all.
  // Skip them, as here, or throw an error if your package can't work without them.
  console.warn(
    'Module customization hooks are not supported by this version of Node.js.'
  );
}
```
