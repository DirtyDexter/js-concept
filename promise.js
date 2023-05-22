// From https://www.youtube.com/watch?v=C3kUMPtt4hY
class MyPromise {
  constructor(executor) {
    this._resolutionQueue = [];
    this._rejectionQueue = [];
    this._state = 'pending';
    this._value;
    this.rejectionReason;
    try {
      executor(this._resolve.bind(this), this._reject.bind(this));
    } catch(e) {
      this._reject(e);
    }
  }

  _runResolutionHandlers() {
    while(this._resolutionQueue.length > 0) {
      var resolution = this._resolutionQueue.shift();
      try {
        var returnValue = resolution.handler(this._value);
      } catch(e) {
        resolution.promise._reject(e);
      }
      
      if (returnValue && returnValue instanceof MyPromise) {
        returnValue.then(function(v) {
          resolution.promise._resolve(v);
        }).catch(function(e) {
          resolution.promise._reject(e);
        });
      } else {
        resolution.promise._resolve(returnValue);
      }
    }
  }

  _runRejectionHandlers() {
    while(this._rejectionQueue.length > 0) {
      var rejection = this._rejectionQueue.shift();
      try {
        var returnValue = rejection.handler(this.rejectionReason);
      } catch(e) {
        rejection.promise._reject(e);
      }
      
      if (returnValue && returnValue instanceof MyPromise) {
        returnValue.then(function(v) {
          rejection.promise._resolve(v);
        }).catch(function(e) {
          rejection.promise._reject(v);
        });
      } else {
        rejection.promise._resolve(returnValue);
      }
    }
  }

  _resolve(value) {
    if (this._state === 'pending') {
      this._value = value;
      this._state = 'resolved';
      this._runResolutionHandlers();
    }
  }

  _reject(reason) {
    if (this._state === 'pending') {
      this.rejectionReason = reason;
      this._state = 'rejected';
      this._runRejectionHandlers();

      while(this._resolutionQueue.length > 0) {
        var resolution = this._resolutionQueue.shift();
        resolution.promise._reject(this.rejectionReason);
      }
    }
  }

  then(resolutionHandler, rejectionHandler) {
    var myPromise = new MyPromise(function() {});
    this._resolutionQueue.push({
      handler: resolutionHandler,
      promise: myPromise
    });

    if (typeof rejectionHandler === 'function') {
      this._rejectionQueue.push({
        handler: rejectionHandler,
        promise: myPromise
      });
    }

    if (this._state === 'resolved') {
      this._runResolutionHandlers();
    }

    if (this._state === 'rejected') {
      myPromise._reject(this.rejectionReason);
    }

    return myPromise;
  }

  catch(rejectionHandler) {
    var myPromise = new MyPromise(function() {});
    this._rejectionQueue.push({
      handler: rejectionHandler,
      promise: myPromise
    });

    if (this._state === 'rejected') {
      this._runRejectionHandlers();
    }

    return myPromise;
  }

  // From - https://github.com/WebDevSimplified/js-promise-library/blob/main/MyPromise.js  

  finally(callback) {
    return this.then(
      result => {
        callback();
        return result
      },
      result => {
        callback();
        throw result
      }
    );
  }

  static resolve(value) {
    return new MyPromise(resolve => {
      resolve(value);
    })
  }

  static reject(value) {
    return new MyPromise((resolve, reject) => {
      reject(value);
    })
  }

  static all(promises) {
    const result = [];
    let completed = 0;
    return new MyPromise((resolve, reject) => {
      for (var i = 0; i < promises.length; i++) {
        const promise = promises[i];
        promise.then((val) => {
          completed++;
          result[i] = val;
          if (completed === promises.length) {
            resolve(result);
          }
        }).catch(reject);
      }
    });
  }

  static allSettled(promises) {
    const result = [];
    let completed = 0;
    return new MyPromise((resolve) => {
      for (var i = 0; i < promises.length; i++) {
        const promise = promises[i];
        promise.then((val) => {
          result[i] = { state: 'resolved', value: val };
        }).catch((reason) => {
          result[i] = { state: 'rejected', reason };
        }).finally(() => {
          completed++;
          if (completed === promises.length) {
            resolve(result);
          }
        });
      }
    });
  }

  static race(promises) {
    return new MyPromise((resolve, reject) => {
      promise.array.forEach(promise => {
        promise.then(resolve).catch(reject);
      });
    });
  }

  static any(promises) {
    const errors = [];
    let completed = 0;
    return new MyPromise((resolve, reject) => {
      for (var i = 0; i < promises.length; i++) {
        const promise = promises[i];
        promise.then(resolve).catch((e) => {
          completed++;
          errors[i] = e;
          if (completed === promises.length) {
            reject(errors);
          }
        });
      }
    });
  }
}

const promise = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    reject('test');
  }, 1000);
});

promise.then((val) => {
  console.log(val);
}).catch((e) => {
  console.log('error - ', e);
}).finally((val) => {
  console.log('val - ', val);
});

