---
authors: vinayakPandey7
---

# Requiring ES modules from CommonJS

Node.js can load an ES module with `require()`. That is often called **require(esm)**.

It lets CommonJS code (`require` / `module.exports`) load packages that only ship ESM (`export` / `import`), without converting the whole app to ESM first.

The feature is unflagged on current release lines, so you do not need `--experimental-require-module`. It was marked no longer experimental in Node.js 25.4.0.

## Versions

Use a Node.js version that has unflagged support:

- **Node.js 20.19.0** or later on the v20 line
- **Node.js 22.12.0** or later
- Any later major (23+)

A common `engines` range is:

```json
{
  "engines": {
    "node": "^20.19.0 || >=22.12.0"
  }
}
```

On older versions, `require()` of an ES module throws `ERR_REQUIRE_ESM`.

## Quick example

`distance.mjs`:

```mjs
export function distance(a, b) {
  return Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2);
}
```

`app.js` (CommonJS):

```cjs
const { distance } = require('./distance.mjs');

console.log(distance({ x: 0, y: 0 }, { x: 3, y: 4 }));
// 5
```

`require()` of an ES module returns the **module namespace object**, the same shape as a static `import`, including a `.default` property when the module has a default export.

`point.mjs`:

```mjs
export default class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
```

```cjs
const point = require('./point.mjs');

console.log(point);
// [Module: null prototype] { default: [class Point], __esModule: true }

const Point = point.default;
```

The ES module may also export the name `"module.exports"` so `require()` returns that value directly. See the [API docs](https://nodejs.org/api/modules.html#loading-ecmascript-modules-using-require).

## When `require()` can load ESM

The module must be **fully synchronous** (no top-level `await`), and one of these must be true:

1. The file ends in `.mjs`
2. The file ends in `.js` and the closest `package.json` has `"type": "module"`
3. The file ends in `.js`, the closest `package.json` is not `"type": "commonjs"`, and the source uses ES module syntax

Graph modules loaded from that ESM file can use `import` as usual.

## FAQ

### Can the ES module use top-level `await`?

No. Top-level `await` makes the module async. `require()` is synchronous, so that load fails. Use dynamic `import()` if you need TLA.

### Is `require(esm)` the same as `import()`?

No. `import()` is async and returns a promise. `require(esm)` runs synchronously and returns the namespace (or `module.exports` interop) immediately. Prefer `import` in new ESM code; use `require(esm)` when you are still in CommonJS.

### Do I still need dual CJS+ESM builds?

Often no, if your consumers are on the versions above. Publishing a single ESM graph that is `require()`-able is simpler and avoids [dual-package hazard](/learn/modules/publishing-a-package). Check your support policy first.

### How do I tell if a package is ESM?

Look at `"type": "module"` and `"exports"` in its `package.json`. If `require()` used to throw `ERR_REQUIRE_ESM` and you are now on a supported Node.js, try again without extra flags.

## Learn more

- [Loading ECMAScript modules using `require()`](https://nodejs.org/api/modules.html#loading-ecmascript-modules-using-require) — API details
- [Determining the module system](https://nodejs.org/api/packages.html#determining-module-system)
- [Publishing a package](/learn/modules/publishing-a-package)
- [package-examples: making ESM require-able](https://github.com/nodejs/package-examples/blob/main/guide/04-cjs-esm-interop/require-esm/README.md) — worked examples
