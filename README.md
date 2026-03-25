# nodejs/learn

Source content for the Node.js learning guides, published at https://nodejs.github.io/learn.

This repository was created as part of
[nodejs/nodejs.org#8612](https://github.com/nodejs/nodejs.org/issues/8612)
to give the Learn content a dedicated home, separate from the main website
monorepo. Content editors no longer need to deal with Next.js tooling or
website-specific git hooks.

## Content

All articles are Markdown files under `pages/`, grouped by topic:

```
pages/
├── getting-started/        # Introduction to Node.js
├── asynchronous-work/      # Event loop, callbacks, promises, streams
├── command-line/           # REPL, environment variables, CLI I/O
├── diagnostics/            # Debugging, profiling, memory, performance
├── file-system/            # File paths, stats, reading/writing, folders
├── http/                   # HTTP, fetch, WebSockets, proxies
├── package-management/     # npm, publishing packages, Node-API modules
├── security/               # Security best practices
├── testing/                # Test runner, mocking, code coverage
└── typescript/             # TypeScript with Node.js
```

The structure is based on
[Card Sort research](https://github.com/nodejs/nodejs.org/issues/8234)
conducted at the 2025 Cambridge Node.js Collaborators' Summit.

## Development

```bash
npm install
npm run build   # generates static site + Orama search DB in out/
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).
