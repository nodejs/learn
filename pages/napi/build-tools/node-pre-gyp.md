---
authors: gabrielschulhof, NickNaso, jschlight, mhdawson, KevinEady, avivkeller
---

# node-pre-gyp

One of the limitations of native addons is that they must be compiled for each target platform and architecture. Without pre-built binaries, every user who installs your package must have a working C/C++ toolchain on their machine.

[node-pre-gyp](https://github.com/mapbox/node-pre-gyp) solves this by letting you build binaries ahead of time, upload them to a remote location, and have users download the right binary at install time - falling back to compiling from source only if a matching binary is not available.

> Note that Node-API support was added to node-pre-gyp in version 0.8.0.

This page describes the changes required to a Node-API addon to support node-pre-gyp.

## Amazon S3

By default, node-pre-gyp uploads binaries to [Amazon S3](https://aws.amazon.com/s3/).

> The [node-pre-gyp-github](https://github.com/bchr02/node-pre-gyp-github) module adds support for publishing to GitHub Releases instead.

### Amazon S3 Requirements

Before uploading you need:

1. An Amazon Web Services account.
2. An IAM user or role with permission to upload to S3.
3. An [S3 bucket](https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingBucket.html) to host the binaries.

### AWS Credentials

Never store credentials in your repository. node-pre-gyp supports two common approaches for providing credentials during development:

1. A `~/.node_pre_gyprc` file:

   ```json
   {
     "accessKeyId": "xxx",
     "secretAccessKey": "xxx"
   }
   ```

2. Environment variables:

   ```bash
   export node_pre_gyp_accessKeyId=xxx
   export node_pre_gyp_secretAccessKey=xxx
   ```

For CI environments, prefer IAM roles or short-lived credentials rather than long-lived access keys. See the [node-pre-gyp credentials documentation](https://github.com/mapbox/node-pre-gyp#3-configure-aws-credentials) for additional options.

## package.json

### The `dependencies` and `devDependencies` properties

The package is now published under the `@mapbox` scope. Use `@aws-sdk/client-s3` as a dev dependency for the upload step.

```json
"dependencies": {
  "@mapbox/node-pre-gyp": "^1.0.0"
},
"devDependencies": {
  "@aws-sdk/client-s3": "^3.0.0"
}
```

### The `scripts` property

The `install` script should invoke node-pre-gyp with `--fallback-to-build` so that users who don't have a pre-built binary available can still compile locally:

```json
"scripts": {
  "install": "node-pre-gyp install --fallback-to-build"
}
```

### The `binary` property

The `binary` property tells node-pre-gyp which Node-API versions your addon supports and where to find/upload binaries:

```json
"binary": {
  "module_name": "your_module",
  "module_path": "./lib/binding/napi-v{napi_build_version}",
  "remote_path": "./{module_name}/v{version}/{configuration}/",
  "package_name": "{platform}-{arch}-napi-v{napi_build_version}.tar.gz",
  "host": "https://your_bucket.s3.us-west-1.amazonaws.com",
  "napi_versions": [3]
}
```

Set `module_name` to a valid C identifier. The `napi_versions` array lists which Node-API versions to build for; `3` is a reasonable minimum for most addons.

See the [node-pre-gyp docs](https://github.com/mapbox/node-pre-gyp#1-add-new-entries-to-your-packagejson) for a complete reference, including [Node-API considerations](https://github.com/mapbox/node-pre-gyp#n-api-considerations).

## binding.gyp

### New target

Add a post-build target to copy the compiled binary to the path specified by `module_path`:

```json
{
  "target_name": "action_after_build",
  "type": "none",
  "dependencies": ["<(module_name)"],
  "copies": [
    {
      "files": ["<(PRODUCT_DIR)/<(module_name).node"],
      "destination": "<(module_path)"
    }
  ]
}
```

### NAPI_VERSION

Include the Node-API version in the first target's `defines` so the header files configure themselves correctly:

```json
"defines": [
  "NAPI_VERSION=<(napi_build_version)"
]
```

## JavaScript updates

JavaScript code that loads the native binary must dynamically resolve the path to the correct `.node` file:

```cjs
const binary = require('@mapbox/node-pre-gyp');
const path = require('path');
const bindingPath = binary.find(
  path.resolve(path.join(__dirname, './package.json'))
);
const binding = require(bindingPath);
```

## Build

Once everything is in place, build from source:

```bash
npm install --build-from-source
```

## Package and publish

```bash
./node_modules/.bin/node-pre-gyp package
./node_modules/.bin/node-pre-gyp publish
```

## CI and automated builds

Use [GitHub Actions](https://docs.github.com/en/actions) to build, test, and publish binaries for multiple platforms and architectures. A typical workflow matrix covers `ubuntu-latest`, `macos-latest`, and `windows-latest`, plus any architecture variants you need (e.g. `x64`, `arm64`). See the node-pre-gyp repository for [example workflow configurations](https://github.com/mapbox/node-pre-gyp).
