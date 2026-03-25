# Contributing to nodejs/learn

Thank you for your interest in contributing! This repository contains the
Node.js learning guides.

## Content structure

All articles live under `pages/`, organized into topic sections:

| Directory             | Topics covered                                          |
| --------------------- | ------------------------------------------------------- |
| `getting-started/`    | Introduction, V8 engine, dev vs production, WebAssembly |
| `asynchronous-work/`  | Event loop, callbacks, promises, streams                |
| `command-line/`       | REPL, environment variables, CLI I/O                    |
| `diagnostics/`        | Debugging, profiling, memory, performance               |
| `file-system/`        | File paths, stats, reading, writing, folders            |
| `http/`               | HTTP transactions, fetch, WebSockets, proxies           |
| `package-management/` | npm, publishing packages, Node-API modules              |
| `security/`           | Security best practices                                 |
| `testing/`            | Test runner, mocking, code coverage                     |
| `typescript/`         | TypeScript with Node.js                                 |

## Making changes

### Editing an existing article

1. Find the relevant `.md` file under `pages/`.
2. Edit the content (standard GitHub-flavored Markdown).
3. Open a pull request — no build step required to review prose changes.

### Adding a new article

1. Choose the most relevant section directory, or propose a new one in your PR.
2. Create a new `.md` file with a descriptive kebab-case name.
3. Include frontmatter at the top of the file if required by `doc-kit`.

### Adding a new section

Open an issue first to discuss the proposed section before adding files.
Refer to the [Card Sort results](https://github.com/nodejs/nodejs.org/issues/8234)
for prior user-research context on content organisation.

## Building locally

```bash
npm install
npm run build
# Output is written to out/
```

## Code of Conduct

This project follows the
[Node.js Code of Conduct](https://github.com/nodejs/admin/blob/main/CODE_OF_CONDUCT.md).
