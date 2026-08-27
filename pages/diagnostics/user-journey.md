# User Journey

Diagnostics is the process of collecting and analyzing information about an
application to identify the cause of unexpected behavior, memory problems, or
poor performance. These guides organize that process around common symptoms
and link to tools and techniques that can help investigate them.

## Before you begin

Record the following information before starting an investigation:

- The Node.js version and operating system
- The observed symptoms and when they occur
- The steps needed to reproduce the problem
- Recent changes to the application or its environment

## Choose a diagnostic path

Start with the guide that most closely matches the symptoms:

- For incorrect or unexpected application behavior, see
  [Live Debugging](/learn/diagnostics/live-debugging).
- For increasing memory use, out-of-memory crashes, or frequent garbage
  collection, see [Memory](/learn/diagnostics/memory).
- For high latency or CPU usage, see
  [Poor Performance](/learn/diagnostics/poor-performance).

Each guide provides more specific symptoms and links to the relevant diagnostic
tools and techniques.

These guides were created by the [Diagnostics Working Group][] and the
[Node.js Website Team][].

[Diagnostics Working Group]: https://github.com/nodejs/diagnostics
[Node.js Website Team]: https://github.com/nodejs/nodejs.org
