# Contributing to nodejs/learn

Thank you for your interest in contributing! This repository contains the
Node.js learning guides.

## Content structure

All articles live under `pages/`, organized into topic sections:

| Directory             | Topics covered                                          |
| --------------------- | ------------------------------------------------------- |
| `getting-started/`    | Introduction, V8 engine, dev vs production, WebAssembly |
| `asynchronous-work/`  | Event loop, callbacks, promises, streams                |
| `concurrency/`        | Child process, worker threads, cluster                  |
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

This repository requires the Node.js version specified in the
[`.nvmrc` file](.nvmrc). Install the dependencies and generate the static site:

```bash
npm install
npm run build
```

The output is written to `out/`. Start a local server from a separate terminal:

```bash
npm run serve
```

Open <http://localhost:3000/learn> to preview the site. Run `npm run build`
again after making changes to update the generated output.

## Running the end-to-end tests

The [Playwright](https://playwright.dev) tests in `tests/e2e/` check that the
built site loads its assets, and that navigation, search and the theme toggle
work. They run against the Vercel preview of every pull request. To run them
locally against your own build:

```bash
npm run build
npx playwright install chromium # first time only
npm run test:e2e
```

The tests start `npm run serve` for you, or reuse a server already running on
port 3000. Set `PLAYWRIGHT_BASE_URL` to test a deployed copy instead.

## Code of Conduct

This project follows the
[Node.js Code of Conduct](https://github.com/nodejs/admin/blob/main/CODE_OF_CONDUCT.md).
