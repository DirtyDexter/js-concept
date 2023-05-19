const debounce = (func, delay) => {
  let inDebounce
  return function() {
    const context = this
    const args = arguments
    clearTimeout(inDebounce)
    inDebounce = setTimeout(() => func.apply(context, args), delay)
  }
}


var debounce2 = function(fn, t) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn(...args)
    }, t);
  };
};


var debounce3 = function(fn, t) {
  let interval;
  return function(...args) {
    const lastCall = Date.now()
    clearInterval(interval);
    interval = setInterval(() => {
      if (Date.now() - lastCall >= t) {
        fn(...args);
        clearInterval(interval);
      }
    }, 1);
  }
};

var debounce4 = function(fn, t) {
  var timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
        fn(...args);
        clearTimeout(timer);
    }, t);
  }
};

