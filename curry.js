function curry(fn) {
  function nest(N, args) {
    return (...xs) => {
      if (N - xs.length <= 0) {
        return fn(...args, ...xs);
      }
      return nest(N - xs.length, [...args, ...xs]);
    };
  }
  return nest(fn.length, []);
}


var curry = function(fn) {
   return function curried(...args) {
      if(args.length >= fn.length) {
         return fn(...args);
      }

      return (...nextArgs) => curried(...args, ...nextArgs);
   };
};

var curry = function (fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }

    return curried.bind(this, ...args);
  };
};

/* Another popular variation is a curry function that doesn't accept a predefined amount of arguments 
    (the function doesn't have a predefined length e.g const getSum = (...args) => args.reduce((a, b) => a + b, 0)) 
    and is called when the user doesn't pass any arguments.
*/

var curry = function (fn) {
  return function curried(...args) {
    if (args.length === 0) {
      return fn(...args);
    }

    return (...nextArgs) => {
      if (nextArgs.length === 0) {
        return fn(...args);
      }

      return curried(...args, ...nextArgs);
    };
  };
};


