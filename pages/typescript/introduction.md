---
authors: sbielenica, ovflowd, vaishnav-mk, AugustinMauroy
---

# Introduction to TypeScript

## What is TypeScript

**[TypeScript](https://www.typescriptlang.org)** is an open-source language maintained and developed by Microsoft.

TypeScript is a superset of JavaScript that adds a static type system. It helps catch type-related errors during development, provides better editor support through features such as autocompletion and safe refactoring, and makes codebases easier to maintain as they grow.

We can talk about other TypeScript benefits later, let's see some examples now!

## First TypeScript code

Take a look at this code snippet and then we can unpack it together:

<!--
  Maintainers note: this code is duplicated in the next article, please keep them in sync
-->

```ts
type User = {
  name: string;
  age: number;
};

function isAdult(user: User): boolean {
  return user.age >= 18;
}

const justine = {
  name: 'Justine',
  age: 23,
} satisfies User;

const isJustineAnAdult = isAdult(justine);
```

Let's understand what happens here.

First, we define a custom type named `User`. This type describes the
structure that every user object should follow. In this example, a user
must have a `name` of type `string` and an `age` of type `number`.

Next, we create the `isAdult` function. It accepts a parameter of type
`User` and returns a `boolean`, indicating whether the user's age is at
least `18`.

We then create a `justine` object. The `satisfies` operator verifies
that the object conforms to the `User` type while preserving the
object's most specific inferred type. This allows TypeScript to validate
the object's structure without changing its inferred properties.

Finally, we call `isAdult(justine)` and store the result in
`isJustineAnAdult`.

One of TypeScript's strengths is its ability to **infer types
automatically**. For example, even though we never explicitly declared
the type of `isJustineAnAdult`, TypeScript correctly infers it as
`boolean`.

If the code doesn't match the declared types---for example, if `age`
were a string instead of a number---TypeScript reports an error during
development, helping you catch mistakes before your code runs.

> **Note**
>
> TypeScript's type system exists only during development. During
> compilation, all type annotations are removed, so they do not affect
> your application's runtime behavior.

## What does TypeScript consist of?

TypeScript consists of two main components: the code itself and type definitions.

### TypeScript Code

The code part is regular JavaScript with additional TypeScript-specific syntax for type annotations. When TypeScript code is compiled, all the TypeScript-specific parts are removed, resulting in clean JavaScript that can run in any environment. For example:

```ts displayName="example.ts"
function greet(name: string) {
  console.log(`Hello, ${name}!`);
}
```

### Type Definitions

Type definitions describe the shape of existing JavaScript code. They are usually stored in `.d.ts` files and don't contain any actual implementation—they only describe the types. These definitions are essential for interoperability with JavaScript: code is not usually distributed as TypeScript, but instead transpiled to JavaScript that includes sidecar type definition files.

For example, when you use Node.js with TypeScript, you'll need type definitions for Node.js APIs. This is available via `@types/node`. Install it using:

```bash
npm add --save-dev @types/node
```

These type definitions allow TypeScript to understand Node.js APIs and provide proper type checking and autocompletion when you use functions like `fs.readFile` or `http.createServer`. For example:

```ts
// @errors: 2345
import { resolve } from 'node:path';

resolve(123, 456);
```

Many popular JavaScript libraries have their type definitions available under the `@types` namespace, maintained by the DefinitelyTyped community. This enables seamless integration of existing JavaScript libraries with TypeScript projects.

### Transform Capabilities

TypeScript also includes powerful transformation capabilities, particularly for JSX (used in React and similar frameworks). The TypeScript compiler can transform JSX syntax into regular JavaScript, similar to how Babel works. While we won't cover these transformation features in these articles, it's worth noting that TypeScript isn't only a tool for type checking—it's also a build tool for transforming modern JavaScript syntax into compatible versions for different environments.

## How to run TypeScript code

Okay, so we have some TypeScript code. Now how do we run it?
There are few possible ways to run TypeScript code, we will cover all of them in the next articles.
