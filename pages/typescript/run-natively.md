---
authors: AugustinMauroy, khaosdoctor, jakebailey, robpalme
---

# Running TypeScript Natively

You can write code that's valid TypeScript directly in Node.js without the need to transpile it first.

Node.js runs TypeScript through a lightweight process called type stripping. It removes erasable TypeScript syntax, such as type annotations and interfaces, then runs the remaining JavaScript.

If you are using v22.18.0 or later and your source code contains only [erasable TypeScript syntax](https://devblogs.microsoft.com/typescript/announcing-typescript-5-8-beta/#the---erasablesyntaxonly-option), you can execute TypeScript code without any flags.

```bash
node example.ts
```

If you are using a version less than v22.18.0, you can use the `--experimental-strip-types` flag to run TypeScript files directly in Node.js.

```bash
node --experimental-strip-types example.ts
```

And that's it! You can now run TypeScript code directly in Node.js without the need to transpile it first.

Node.js does not type check your code when it runs TypeScript files. Use the TypeScript compiler separately if you want to catch type-related errors:

```bash
npx tsc --noEmit
```

You can disable it via [`--no-experimental-strip-types`](https://nodejs.org/docs/latest-v22.x/api/cli.html#--no-experimental-strip-types) flag if needed.

```bash
node --no-experimental-strip-types example.ts
```

## Constraints

The support for TypeScript in Node.js has some constraints to keep in mind:

You can get more information on the [API docs](https://nodejs.org/docs/latest-v22.x/api/typescript.html#typescript-features).

### Type stripping

Type stripping only works for TypeScript syntax that can be removed without changing the runtime JavaScript. This includes common type-only syntax such as type annotations, interfaces, type aliases, and `import type`.

Syntax that requires JavaScript code generation is not handled by type stripping alone. Examples include `enum`, parameter properties, namespaces with runtime code, and import aliases. Use a runner or a separate transpilation step if your project needs those features.

### Type checking

Running a `.ts` file with `node` is not the same as running `tsc`. Node.js executes the file after stripping supported type syntax, but it does not report type errors.

For development, a common setup is to run Node.js directly for quick feedback and run `tsc --noEmit` in a separate command or CI job for type checking.

### Configuration

The Node.js TypeScript loader ([Amaro](https://github.com/nodejs/amaro)) does not need or use `tsconfig.json` to run TypeScript code.

We recommend configuring your editor and `tsc` to reflect Node.js behavior by creating a `tsconfig.json` using the `compilerOptions` listed [here](https://nodejs.org/api/typescript.html#type-stripping), as well as using TypeScript version **5.7 or higher**.
