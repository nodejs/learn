---
authors: gabrielschulhof, NickNaso, jschlight, mhdawson, KevinEady, avivkeller
---

# prebuild

One of the limitations of native addons is that they must be compiled for each target platform and architecture. Without pre-built binaries, every user who installs your package must have a working C/C++ toolchain on their machine.

[prebuild](https://github.com/prebuild/prebuild) solves this by letting you compile binaries ahead of time and publish them as [GitHub Releases](https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases). When a user installs your package, `prebuild-install` downloads the right pre-built binary for their platform and Node-API version - falling back to compiling from source only if no matching binary is found.

> Node-API support was added to prebuild in version 8.1.0.

> [node-pre-gyp](/learn/napi/build-tools/node-pre-gyp.md) is an alternative tool that uses Amazon S3 instead of GitHub Releases.

## prebuild and prebuild-install

The tooling is split into two packages:

- [prebuild](https://github.com/prebuild/prebuild) - used by you (the addon developer) to build and upload binaries.
- [prebuild-install](https://github.com/prebuild/prebuild-install) - used by your consumers to download the pre-built binary at install time.

## Installing

Install `prebuild` as a dev dependency so it is available during your CI publish workflow:

```bash
npm install prebuild --save-dev
```

## GitHub personal access token

Uploading a release asset to GitHub requires a personal access token.

1. Go to [GitHub Settings → Developer settings → Personal access tokens](https://github.com/settings/tokens).
2. Click **Generate new token** and choose **Fine-grained token** (recommended) or classic.
   - For a fine-grained token: grant **Read and write** access to **Contents** on the target repository.
   - For a classic token: select the `public_repo` scope (or `repo` for private repositories).
3. Copy the generated token - it is only shown once.
4. Set it as an environment variable:

   ```bash
   export GITHUB_TOKEN=<your-token>
   ```

In CI, store the token as a repository secret and expose it to the workflow via `env`.

## package.json

### The `repository` property

Because prebuild uploads to GitHub, you must declare the repository:

```json
"repository": {
  "type": "git",
  "url": "https://github.com/yourorg/your-napi-addon.git"
}
```

### The `dependencies` property

Consumers need `prebuild-install` to download pre-built binaries:

```json
"dependencies": {
  "prebuild-install": "^7.0.0"
}
```

### The `scripts` property

```json
"scripts": {
  "install": "prebuild-install --runtime napi || node-gyp rebuild",
  "rebuild": "node-gyp rebuild",
  "prebuild": "prebuild --runtime napi --all --strip --verbose",
  "upload": "prebuild --runtime napi --upload ${GITHUB_TOKEN}"
}
```

The `--runtime napi` flag is required for Node-API builds. The `--all` flag builds for every supported Node-API version declared in the `binary` property. Without `--all` or explicit `--target` flags, prebuild builds only for the Node-API version of the current Node.js process.

### The `binary` property

Declare which Node-API versions your addon supports:

```json
"binary": {
  "napi_versions": [3]
}
```

`3` is a reasonable default - it was the Node-API version when the API left experimental status, and binaries built against it run on all later versions.

## NAPI_VERSION

The `NAPI_VERSION` preprocessor value must be defined so the Node-API headers configure themselves for the correct version. How you set it depends on your build tool.

### node-gyp

In `binding.gyp`:

```json
"defines": [
  "NAPI_VERSION=<(napi_build_version)"
]
```

### cmake-js

In `CMakeLists.txt`:

```cpp
add_compile_definitions(NAPI_VERSION=${napi_build_version})
```

## Building and uploading

Build and package your binaries:

```bash
npm run prebuild
```

When you are ready to publish a release, upload to GitHub:

```bash
npm run upload
```

This requires `GITHUB_TOKEN` to be set in the environment. In CI, trigger the upload step only after a version tag is pushed.

## Life for your users

When a user runs `npm install`, the `install` script in your `package.json` runs:

```bash
prebuild-install --runtime napi || node-gyp rebuild
```

`prebuild-install` fetches the GitHub Releases page for your repository, finds a binary that matches the user's platform, architecture, and Node-API version, and installs it. If no match is found, `node-gyp rebuild` compiles from source as a fallback.
