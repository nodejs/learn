# JavaScript Asynchronous Programming and Callbacks

## 1. What Is Asynchronous Programming?

**Asynchronous programming** allows a program to start a task that may take some time to complete without stopping the rest of the program from running.

For example, imagine your program needs to download data from a server. The program does not need to sit and wait doing nothing until the server responds. It can continue with other work and handle the response when it arrives.

### Synchronous vs Asynchronous

**Synchronous** code runs one operation at a time and waits for each operation to finish before moving to the next.

```js
console.log("First");
console.log("Second");
console.log("Third");
```

Output:

```text
First
Second
Third
```

Each statement runs in order.

**Asynchronous** code can start an operation and continue executing other code while waiting for the operation to complete.

```js
console.log("First");

setTimeout(() => {
  console.log("Second");
}, 2000);

console.log("Third");
```

Output:

```text
First
Third
Second
```

The timer waits for approximately 2 seconds before its callback runs, while JavaScript continues executing the next statement.

---

# 2. Is JavaScript Synchronous or Asynchronous?

JavaScript is **synchronous and single-threaded by default**.

This means JavaScript executes one piece of JavaScript code at a time on its main thread.

For example:

```js
const a = 10;
const b = 20;
const c = a + b;

console.log(c);
```

The statements execute in order:

```text
10 + 20
30
```

JavaScript itself does not normally create additional JavaScript threads for every task.

However, JavaScript can perform **asynchronous operations** because the environment where JavaScript runs provides additional APIs.

For example:

* Browsers provide Web APIs.
* Node.js provides APIs for files, networking, timers, and other operations.

These environments allow JavaScript to start operations that can finish later.

---

# 3. Why Do We Need Asynchronous Programming?

Many operations take time to complete.

Examples include:

* Downloading data from a server
* Reading a file
* Waiting for a timer
* Sending a network request
* Waiting for a user to click a button
* Accessing a database

If JavaScript had to wait for every slow operation to finish before doing anything else, applications could become unresponsive.

Asynchronous programming allows JavaScript to remain responsive while these operations are being completed.

---

# 4. Callbacks

A **callback** is a function that is passed to another function so that it can be executed later.

For example:

```js
function greet(name, callback) {
  console.log(`Hello ${name}`);
  callback();
}

function finished() {
  console.log("Greeting finished.");
}

greet("Moses", finished);
```

Output:

```text
Hello Moses
Greeting finished.
```

Here:

```js
finished
```

is passed as an argument to `greet()`.

The `greet()` function later calls it:

```js
callback();
```

Therefore, `finished` is a **callback function**.

---

# 5. Callbacks and Browser Events

Callbacks are commonly used with browser events.

For example:

```js
const button = document.getElementById("button");

button.addEventListener("click", () => {
  console.log("Button clicked!");
});
```

The function:

```js
() => {
  console.log("Button clicked!");
}
```

is a callback.

It is not executed immediately.

Instead, the browser executes it when the user clicks the button.

### Another Example

```js
window.addEventListener("load", () => {
  console.log("The page has finished loading.");
});
```

The callback runs after the page's load event occurs.

---

# 6. Callbacks and Timers

Callbacks are also used with timers.

```js
setTimeout(() => {
  console.log("2 seconds have passed.");
}, 2000);
```

The second argument:

```js
2000
```

means approximately 2000 milliseconds, or 2 seconds.

The function:

```js
() => {
  console.log("2 seconds have passed.");
}
```

is the callback.

The callback is executed after the timer has finished.

---

# 7. Callbacks with Network Requests

Callbacks can also be used with network operations.

For example, the older `XMLHttpRequest` API uses callbacks:

```js
const xhr = new XMLHttpRequest();

xhr.onreadystatechange = () => {
  if (xhr.readyState === 4) {
    if (xhr.status === 200) {
      console.log(xhr.responseText);
    } else {
      console.error("Request failed.");
    }
  }
};

xhr.open("GET", "https://example.com/data");
xhr.send();
```

The request takes time to complete.

Instead of stopping the entire program while waiting, JavaScript continues running and later executes the callback when the request state changes.

---

# 8. Error-First Callbacks in Node.js

Node.js traditionally uses a pattern called an **error-first callback**.

The callback normally receives the error as its first argument.

Example:

```js
const fs = require("node:fs");

fs.readFile("file.txt", (err, data) => {
  if (err) {
    console.error("Error:", err);
    return;
  }

  console.log(data.toString());
});
```

The general structure is:

```js
function callback(err, data) {
  // handle result
}
```

If an error occurs:

```js
err
```

contains information about the error.

If the operation succeeds, `err` is usually `null`.

This pattern makes it possible to handle both successful and unsuccessful operations.

---

# 9. The Problem with Too Many Callbacks

Callbacks are useful, but using many callbacks inside one another can make code difficult to read and maintain.

For example:

```js
window.addEventListener("load", () => {
  document.getElementById("button").addEventListener("click", () => {
    setTimeout(() => {
      items.forEach((item) => {
        console.log(item);
      });
    }, 2000);
  });
});
```

Notice how the code becomes increasingly indented.

With more asynchronous operations, this can become much worse:

```js
doSomething((result1) => {
  doSomethingElse(result1, (result2) => {
    doAnotherThing(result2, (result3) => {
      doSomethingAgain(result3, (result4) => {
        console.log(result4);
      });
    });
  });
});
```

This pattern is often called **callback hell** or the **pyramid of doom**.

The main problems are:

* Difficult-to-read code
* Deep nesting
* Difficult error handling
* Difficult maintenance
* Difficult debugging

---

# 10. Higher-Order Functions and Callbacks

A function that accepts another function as an argument or returns a function is called a **higher-order function**.

For example:

```js
function processUser(name, callback) {
  console.log(`Processing ${name}...`);
  callback();
}

processUser("Moses", () => {
  console.log("User processed.");
});
```

Here:

* `processUser()` is a higher-order function.
* The function passed to `processUser()` is a callback.

JavaScript supports this because **functions are first-class values**.

This means functions can be:

* Stored in variables
* Passed as arguments
* Returned from other functions
* Stored in objects or arrays

---

# 11. How JavaScript Handles Asynchronous Operations

A simplified way to understand asynchronous JavaScript is:

```text
JavaScript Code
      ↓
Call Stack
      ↓
Web APIs / Node.js APIs
      ↓
Task completes
      ↓
Callback Queue
      ↓
Event Loop
      ↓
Call Stack
      ↓
Callback executes
```

For example:

```js
console.log("Start");

setTimeout(() => {
  console.log("Timer finished");
}, 2000);

console.log("End");
```

The output is:

```text
Start
End
Timer finished
```

The important idea is that JavaScript does not stop executing the entire program while the timer is waiting.

---

# 12. Event Loop

The **event loop** is a mechanism that helps JavaScript handle asynchronous operations while JavaScript itself remains single-threaded.

A simplified process is:

1. JavaScript executes code on the call stack.
2. An asynchronous operation is started.
3. The environment handles the operation.
4. JavaScript continues executing other code.
5. When the operation is ready, its callback is placed into an appropriate queue.
6. The event loop checks whether the call stack is empty.
7. The callback is eventually moved to the call stack.
8. JavaScript executes the callback.

Understanding the **call stack, queues, and event loop** is important for understanding asynchronous JavaScript.

---

# 13. Modern Alternatives to Callbacks

Modern JavaScript provides better ways to organize asynchronous operations.

The main approaches are:

### 1. Callbacks

```js
setTimeout(() => {
  console.log("Finished");
}, 1000);
```

### 2. Promises

```js
const promise = new Promise((resolve, reject) => {
  resolve("Success!");
});

promise.then((result) => {
  console.log(result);
});
```

### 3. Async/Await

```js
async function run() {
  const result = await promise;
  console.log(result);
}

run();
```

Promises were introduced in **ES2015 (ES6)**, while `async`/`await` was introduced in **ES2017**.

---

# 14. Key Terms to Remember

| Term                      | Meaning                                                         |
| ------------------------- | --------------------------------------------------------------- |
| **Synchronous**           | Operations execute in order and wait for each other             |
| **Asynchronous**          | Operations can complete later without blocking the current flow |
| **Callback**              | A function passed to another function to be executed later      |
| **Higher-order function** | A function that accepts or returns another function             |
| **Call Stack**            | Keeps track of currently executing JavaScript functions         |
| **Event Loop**            | Coordinates asynchronous callbacks with the call stack          |
| **Promise**               | Represents the eventual result of an asynchronous operation     |
| **async**                 | Declares a function that works with promises                    |
| **await**                 | Waits for a promise to settle inside an async function          |
| **Callback Hell**         | Excessive nesting of callbacks                                  |

---

# 15. Simple Example to Remember

Think of ordering food at a restaurant.

### Synchronous

You order food and stand at the kitchen waiting until the food is prepared.

```text
Order food
     ↓
Wait
     ↓
Food ready
     ↓
Continue
```

### Asynchronous

You order food, receive a number, and sit down.

```text
Order food
     ↓
Sit and do something else
     ↓
Food becomes ready
     ↓
You are notified
     ↓
Collect food
```

The notification is similar to a **callback**.

---

# Summary

JavaScript executes JavaScript code **synchronously on a single main thread**, but it can handle asynchronous operations through capabilities provided by its host environment, such as browsers and Node.js.

**Callbacks** were one of the original and simplest ways to work with asynchronous operations.

However, too many nested callbacks can make code difficult to understand and maintain. Modern JavaScript therefore provides **Promises** and **async/await**, which make asynchronous code easier to organize.

### The progression to remember:

```text
Callbacks
    ↓
Promises
    ↓
Async / Await
```

Understanding callbacks is important because they form the foundation for understanding how JavaScript handles asynchronous programming.
