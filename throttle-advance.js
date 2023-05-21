const throttle = (func, limit) => {
  let lastFunc
  let lastRan
  return function() {
    const context = this
    const args = arguments
    if (!lastRan) {
      func.apply(context, args)
      lastRan = Date.now()
    } else {
      clearTimeout(lastFunc)
      lastFunc = setTimeout(function() {
        if ((Date.now() - lastRan) >= limit) {
          func.apply(context, args)
          lastRan = Date.now()
        }
      }, limit - (Date.now() - lastRan))
    }
  }
}


var throttle2 = function(fn, t) {
  var prevArg;
  var timer;
  return function helper(...args) {
      if (timer) {
          prevArg = args;
      } else {
          fn(...args);
          prevArg = null;
          timer = setTimeout(() => {
              //clearTimeout(timer);
              timer = undefined;
              if (prevArg) {
                  return helper(...prevArg);
              }
          }, t);
      }
  }
};



var throttle3 = function(fn, t) {
  let timeoutInProgress = null;
  let argsToProcess = null;
  
  const timeoutFunction = () => {
    if (argsToProcess === null) {
      timeoutInProgress = null; // enter the waiting phase
    } else {
      fn(...argsToProcess);
      argsToProcess = null;
      timeoutInProgress = setTimeout(timeoutFunction, t);
    }
  };

  return function throttled(...args) {
    if (timeoutInProgress) {
      argsToProcess = args;
    } else {
      fn(...args); // enter the looping phase
      timeoutInProgress = setTimeout(timeoutFunction, t);
    }
  }
};


var throttle4 = function(fn, t) {
  let intervalInProgress = null;
  let argsToProcess = null;
  
  const intervalFunction = () => {
    if (argsToProcess === null) {
      clearInterval(intervalInProgress);
      intervalInProgress = null; // enter the waiting phase
    } else {
      fn(...argsToProcess);
      argsToProcess = null;
    }
  };

  return function throttled(...args) {
    if (intervalInProgress) {
      argsToProcess = args;
    } else {
      fn(...args); // enter the looping phase
      intervalInProgress = setInterval(intervalFunction, t);
    }
  }
};


var throttle5 = function(fn, t) {
  let timeout = null;
  let nextTimeToCallFn = 0;
  return function(...args) {
    const delay = Math.max(0, nextTimeToCallFn - Date.now());
    clearTimeout(timeout);
    timeout = setTimeout(() => { 
      fn(...args);
      nextTimeToCallFn = Date.now() + t;
    }, delay);
  }
};
