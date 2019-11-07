// =============================================================================
// Core.ts | Utility Functions
// (c) Mathigon
// =============================================================================


/** Creates a random UID string of a given length. */
export function uid(n = 10) {
  return Math.random().toString(36).substr(2, n);
}


/** Checks if x is strictly equal to any one of the following arguments. */
export function isOneOf<T>(x: T, ...values: T[]) {
  for (let v of values) {
    if (x === v) return true;
  }
  return false;
}


/** Applies default keys to an object. */
export function applyDefaults(obj: any, defaults: any) {
  for (let key of Object.keys(defaults)) {
    if (!obj.hasOwnProperty(key)) obj[key] = defaults[key];
  }
  return obj;
}


/** Deep extends obj1 with obj2, using a custom array merge function. */
export function deepExtend(obj1: any, obj2: any,
                           arrayMergeFn = ((a: any[], b: any[]) => a.concat(b))) {
  for (const i of Object.keys(obj2)) {
    if (i in obj1 && Array.isArray(obj1[i]) && Array.isArray(obj2[i])) {
      obj1[i] = arrayMergeFn(obj1[i], obj2[i]);
    } else if (i in obj1 && obj1[i] instanceof Object &&
      obj2[i] instanceof Object) {
      deepExtend(obj1[i], obj2[i]);
    } else {
      obj1[i] = obj2[i];
    }
  }
}


/** Replacement for setTimeout() that is synchronous for time 0. */
export function delay(fn: () => void, t = 0) {
  if (t) {
    setTimeout(fn, t);
  } else {
    fn();
  }
}


/** Returns a promise that resolves after a fixed time. */
export function wait(t: number) {
  return new Promise(resolve => setTimeout(resolve, t));
}


/** Creates a new promise together with functions to resolve or reject. */
export function defer() {
  let resolve = () => {};
  let reject = () => {};

  const promise = new Promise((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  });

  // This prevents exceptions when promises without .catch are rejected:
  promise.catch(function (error) {
    return error;
  });

  return {promise, resolve, reject};
}


/**
 * Function wrapper that modifies a function to cache its return values. This
 * is useful for performance intensive functions which are called repeatedly
 * with the same arguments. However it can reduce performance for functions
 * which are always called with different arguments. Note that argument
 * comparison doesn't not work with Objects or nested arrays.
 */
export function cache<T>(fn: (...args: any[]) => T) {
  let cached = new Map<string, T>();
  return function (...args: any[]) {
    let argString = args.join('--');
    if (!cached.has(argString)) cached.set(argString, fn(...args));
    return cached.get(argString)!;
  };
}


/**
 * Function wrapper that prevents a function from being executed more than once
 * every t ms. This is particularly useful for optimising callbacks for
 * continues events like scroll, resize or slider move.
 *
 * @param {Function} fn
 * @param {?number} t
 * @returns {Function}
 */
export function throttle(fn: (...args: any[]) => void, t = 0) {
  let delay = false;
  let repeat = false;
  return function (...args: any[]) {
    if (delay) {
      repeat = true;
    } else {
      fn(...args);
      delay = true;
      setTimeout(function () {
        if (repeat) fn(...args);
        delay = false;
        repeat = false;
      }, t);
    }
  };
}
