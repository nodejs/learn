---
authors: olimasad
---

# Type stripping in Node.js

**Type stripping** is Node.js's built-in way to run TypeScript. Node.js removes erasable TypeScript syntax (type annotations, interfaces, and similar), replaces it with whitespace, and executes the remaining JavaScript. It does **not** type-check your code and it does **not** transform TypeScript features that need new JavaScript to be generated.

This page is a high-level overview. For a short runbook, see [Running TypeScript Natively](/learn/typescript/run-natively). For the detailed specification, see the [TypeScript API docs](https://nodejs.org/api/typescript.html#type-stripping).

## What type stripping is

TypeScript adds types on top of JavaScript. Much of that syntax is *erasable*: it exists only for the type checker and editors. Type stripping deletes that erasable syntax at runtime so `node` can run `.ts` / `.mts` / `.cts` files without a separate build step.

```ts
function greet(name: string): string {
  return `Hello, ${name}`;
}

console.log(greet('Node'));
```

```bash
node greet.ts
```

Node.js ignores `tsconfig.json` when stripping types. Features that depend on `tsconfig` settings (path aliases, downlevel emit, and similar) are intentionally unsupported. Prefer [a TypeScript runner](/learn/typescript/run) or [transpilation](/learn/typescript/transpile) when you need those.

## Quick start

On Node.js **v22.18.0+** (and current release lines where type stripping is enabled by default), run a file that uses only erasable syntax:

```bash
node example.ts
```

Disable the feature when you need to:

```bash
node --no-strip-types example.ts
```

Module systems follow the same rules as JavaScript:

- `.ts` follows the nearest `package.json` `"type"` field (like `.js`)
- `.mts` is always an ES module
- `.cts` is always CommonJS
- `.tsx` is not supported

Import specifiers still need file extensions: `import './file.ts'`.

## Which Node.js versions have it?

| Support | Versions (summary) |
| --- | --- |
| Enabled by default | v22.18.0+, v23.6.0+, and current release lines that ship type stripping on by default |
| Marked stable | See the [History table in the API docs](https://nodejs.org/api/typescript.html#type-stripping) (for example v24.12.0 / v25.2.0) |

Always check the docs for the exact line you run in production. Older minor versions may still require an experimental flag.

## FAQ

### Does `node file.ts` type-check my project?

No. Use the TypeScript compiler (or your editor) for that:

```bash
npx tsc --noEmit
```

A common workflow is: run with `node` for fast feedback, and run `tsc --noEmit` in CI.

### What syntax is supported?

Supported examples include type annotations, interfaces, type aliases, and `import type` / inline `type` imports.

Not supported by type stripping alone (these need transform / a runner / `tsc` emit), including:

- `enum` declarations
- parameter properties
- namespaces that contain runtime values
- import aliases
- experimental decorators (until they exist in JavaScript)

Publishing packages as raw TypeScript under `node_modules` is also refused — Node.js will not strip types inside dependency trees.

### Recommended `tsconfig.json`

Match Node.js's erasable-syntax model with TypeScript **5.8+** (5.7+ is a common minimum in older guides):

```json
{
  "compilerOptions": {
    "target": "esnext",
    "module": "nodenext",
    "rewriteRelativeImportExtensions": true,
    "erasableSyntaxOnly": true,
    "verbatimModuleSyntax": true
  }
}
```

Add `"noEmit": true` when you only execute `.ts` files and do not emit `.js` output.

## Learn more

- [Running TypeScript Natively](/learn/typescript/run-natively)
- [Running TypeScript with a runner](/learn/typescript/run)
- [Running TypeScript code using transpilation](/learn/typescript/transpile)
- [Node.js API: TypeScript / type stripping](https://nodejs.org/api/typescript.html#type-stripping)
- [TypeScript: `--erasableSyntaxOnly`](https://www.typescriptlang.org/tsconfig/#erasableSyntaxOnly)
