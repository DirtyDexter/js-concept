function fib (n) {
	return n == 1 ? 0 : n == 2 ? 1 : fib(n-1) + fib(n-2)
}

function memorizer (func) {
  var cache = {}
  return function (n) {
    if (cache[n]) {
      //console.log("returning from cache"+ cache[n])
    	return cache[n]
    }
    cache[n] = func(n)
    return cache[n]
  }
}

fib = memorizer(fib)
console.log(fib(40))
