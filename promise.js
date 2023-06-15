let executorFn = (resolve, reject) => {
  try {
    // business logic
    // if succesfull then call resolve with result
    let result = 1;
    resolve(result);
  } catch (error) {
    reject(error);
  }
};

// basic promise sturcture
let promise = new Promise(executorFn);

promise.then(console.log);

// interesting use case suppose promise got rejected
promise = new Promise((resolve, reject) => {
  setTimeout(reject, 1000);
});

// we should not do promise.then(console.log("suceess"))
//The reason why promise.then(console.log("success")).catch(console.log("rejected")) is incorrect is
//because you are invoking the console.log function immediately and passing its result (which is undefined) as the callback to then and catch.
promise.then(() => console.log("success")).catch(() => console.log("rejected"));

// promise = new Promise((resolve, reject) => {
//   setTimeout(() => {
//     throw Error("Async error");
//   }, 1000);
// });

//promise.then(console.log).catch(console.log);

// will this catch error?

// No, the catch block will not be able to handle the error thrown in the code you provided.

// When you use throw inside the setTimeout callback, it throws an error asynchronously. However, the catch block can only handle errors that occur during the execution of the promise itself, not errors thrown asynchronously outside of the promise.

// In your code, the error thrown inside the setTimeout callback is not caught by the promise or its associated catch block. Instead, it will result in an uncaught error, which typically gets logged to the console with an error stack trace.

// If you want to handle asynchronous errors that occur within a setTimeout callback, you can wrap the code inside a try...catch block and manually reject the promise with the caught error

// when we use catch there is an explicite try catch block along the executor function which can handle synchronous error

promise = Promise.all([
  new Promise((resolve) => resolve(1)),
  new Promise((resolve) => resolve(2)),
  new Promise((resolve) => setTimeout(resolve(3), 1000)),
  new Promise((resolve) => resolve(4)),
]);

promise.then(console.log).catch(console.log);

promise = Promise.all([
  new Promise((resolve) => resolve(1)),
  new Promise((resolve) => resolve(2)),
  new Promise((resolve) => setTimeout(resolve(3), 1000)),
  new Promise((resolve) => resolve(4)),
  new Promise((resolve, reject) => setTimeout(reject("rejected in all"), 5000)),
]);

promise.then(console.log).catch(console.log);

promise = Promise.allSettled([
  new Promise((resolve) => resolve(1)),
  new Promise((resolve) => resolve(2)),
  new Promise((resolve) => setTimeout(resolve(3), 1000)),
  new Promise((resolve) => resolve(4)),
  new Promise((resolve, reject) => setTimeout(reject("rejected in all"), 5000)),
]);

promise.then(console.log).catch(console.log);

// write a polyfill for promise.allSettled
Promise._allSettled = function (promises) {
  let resolveHandler = (result) => ({ status: "fulfilled", value: result });
  let rejectHandler = (error) => ({ status: "rejected", reason: error });

  let convertedPromises = promises.map((promise) =>
    promise.then(resolveHandler, rejectHandler)
  );
  return Promise.all(convertedPromises);
};

promise = Promise._allSettled([
  new Promise((resolve) => resolve(1)),
  new Promise((resolve) => resolve(2)),
  new Promise((resolve) => setTimeout(resolve(3), 1000)),
  new Promise((resolve) => resolve(4)),
  new Promise((resolve, reject) => setTimeout(reject("rejected in all"), 5000)),
]);

promise.then(console.log).catch(console.log);

// a generic function for promisification (convert a function that accepts callback to a function that returns promise)
function promisification(fn) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      function callback(err, ...params) {
        if (err) reject(err);
        else {
          if (params.length === 1) resolve(params[0]);
          else resolve(params);
        }
      }
      args.push(callback);
      return fn.call(this, ...args);
    });
  };
}

function asyncSum(a, b, cb) {
  setTimeout(() => {
    cb(null, a + b);
  }, 2000);
}

asyncSum(2, 3, console.log);

let newFn = promisification(asyncSum);
newFn(2, 4).then(console.log);
