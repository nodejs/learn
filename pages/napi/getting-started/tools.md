---
authors: gabrielschulhof, NickNaso, jschlight, mhdawson, KevinEady, avivkeller
---

# Tools

## Node.js

[Node.js](https://nodejs.org/) is the runtime that executes JavaScript on your machine. It bundles the [V8 JavaScript engine](https://developers.google.com/v8/) together with a set of built-in modules that let you run JavaScript outside of a browser.

Download the appropriate installer for your platform from the [Node.js downloads page](https://nodejs.org/en/download/). The **LTS (Long Term Support)** release is the most stable choice and is recommended for addon development. The installer includes npm.

> Node-API is stable in all currently supported Node.js releases. Any Active LTS or Maintenance LTS release will work.

## npm

[npm](https://www.npmjs.com) is the package manager for Node.js. It is installed alongside Node.js. For most Node-API developers, the goal is to publish an npm package that wraps a C/C++ library and makes it available to JavaScript users.

npm is included with Node.js. You can keep it up to date with:

```bash
npm install -g npm@latest
```

## Git

[Git](https://git-scm.com) is not strictly required for Node-API work, but it is used throughout the ecosystem. Most example repositories and dependency installations rely on it.

## C/C++ compiler and Python

In addition to Node and npm, you need a C/C++ compiler toolchain and Python (required by [node-gyp](/learn/napi/build-tools/node-gyp.md).

### Windows

The recommended approach is to install [Visual Studio Build Tools](https://visualstudio.microsoft.com/downloads/#build-tools-for-visual-studio-2022) with the **"Desktop development with C++"** workload selected. This provides the MSVC compiler, Windows SDK, and the build infrastructure node-gyp requires.

Alternatively, you can install via [winget](https://learn.microsoft.com/en-us/windows/package-manager/winget/):

```powershell
winget install Microsoft.VisualStudio.2022.BuildTools
```

During or after installation, open Visual Studio Installer and ensure the **"Desktop development with C++"** workload is checked.

Python 3 is also required. Install it from [python.org](https://www.python.org/downloads/windows/) or via winget:

```powershell
winget install Python.Python.3
```

> Run PowerShell or `cmd.exe` as **Administrator** when installing global tools.

### macOS

Install Apple's command-line developer tools. If you haven't installed Xcode already, the quickest route is:

```bash
xcode-select --install
```

If that fails, install the full [Xcode IDE](https://developer.apple.com/xcode/) from the Mac App Store, which includes the necessary compiler toolchain.

Python 3 is **not** bundled with modern macOS. Install it using [Homebrew](https://brew.sh):

```bash
brew install python3
```

Or download an installer from [python.org](https://www.python.org/downloads/macos/).

### Linux

On most Linux distributions the required C/C++ toolchain and Python are either pre-installed or easily added. For Debian/Ubuntu-based systems:

```bash
sudo apt-get update
sudo apt-get install -y build-essential python3
```

For other distributions, refer to your package manager's documentation or the [LLVM installation guide](https://llvm.org/docs/GettingStarted.html).

## Verifying your tools

After installation, verify each tool is on your PATH.

### macOS and Linux

```bash
node --version
npm --version
python3 --version
git --version
cc --version
make --version
```

### Windows (PowerShell)

```powershell
node --version
npm --version
python --version
git --version
```

To confirm the MSVC compiler is available, open a **Developer Command Prompt** (installed with Visual Studio Build Tools) and run:

```cmd
cl
```

## Other tools

You'll need a shell - Terminal on macOS/Linux, PowerShell or Windows Terminal on Windows.

A capable code editor is strongly recommended. [Visual Studio Code](https://code.visualstudio.com) has excellent C/C++ support via the [C/C++ extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.cpptools) and integrates well with node-gyp builds. [CLion](https://www.jetbrains.com/clion/) is another popular choice for C++ development.
