/** 
 * ajax
 */
function ajax({
  url,
  type,
  data,
  dataType
}) {
  let xhr = null
  if (window.XMLHttpRequest) {
    // 如果是现代浏览器
    xhr = new XMLHttpRequest()
  } else {
    // 如果是IE低版本浏览器
    xhr = new ActiveXObject("Microsoft.XMLHttp")
  }
  // 将请求方法转为小写
  type = tpye.toLowerCase()
  xhr.onReadyStateChange = function () {
    // 监听xhr状态变化
    if (xhr.readyState === 4 && xhr.status === 200) {
      var res;
      if (dataType !== undefined && dataType.toLowerCase() === "json") {
        res = JSON.parse(xhr.responseText)
      } else {
        res = xhr.responseText
      }
      return res
    }
  }
  // 如果请求方式为get 将 传入的data拼接在 url上
  if (type === "get" && data !== undefined) {
    url += "?" + data;
  }
  // 打开链接
  xhr.open(type, url, true);
  // 如果请求方式为post请求，则修改请求消息头
  if (type === "post") {
    //增加：设置请求消息头
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  }
  //4.发送请求
  if (type === "post" && data !== undefined) {
    xhr.send(data);
  } else {
    xhr.send(null);
  }
}
/** 
 * promise
 */
const PENDING = "PENGDING";
const FULFILLED = "FULFILLED ";
const RESOLVED = "RESOLVED";
class MyPromise {
  constructor(fn) {
    this.rejectCallbacks = [];
    this.resolveCallbacks = [];
    this.state = PENDING;
    this.value = undefined;
    let resolve = (val) => {
      setTimeout(() => {
        if ((typeof val === "function" || typeof val === "object") && val !== null && typeof val
          .then === "function") {
          resolveExcutor(this, val, resolve, reject)
          return
        }
        if (this.state === PENDING) {
          this.state = RESOLVED
          this.value = val
          this.resolveCallbacks.forEach(fn => fn())
        }
      }, 1000)
    }
    let rejected = (reason) => {
      setTimeout(() => {
        if ((typeof val === "function" || typeof val === "object") && val !== null && typeof val
          .then === "function") {
          resolveExcutor(this, val, resolve, reject)
          return
        }
        if (this.state === PENDING) {
          this.state = FULFILLED;
          this.value = reason;
          this.rejectCallbacks.forEach(fn => fn())
        }
      }, 1000)
    }
    fn(resolve, rejected)
  }

  static all(promises) {
    return new MyPromise((resolve, reject) => {
      let result = []
      let index = 0
      for (let i = 0; i < promises.length; i++) {
        promises[i].then(val => {
          index++;
          result.push(val)
          if (promises.length === index) {
            resolve(result)
          }
        }, err => {
          reject(err)
        })
      }
    })
  }
  static race(promises) {
    return new MyPromise((resolve, reject) => {
      for (let i = 0; i < promises.length; i++) {
        promises[i].then(val => {
          resolve(val)
        }, err => {
          reject(err)
        })
      }
    })
  }
  static resolve(val) {
    return new MyPromise((resolve, reject) => {
      if (val == null) resolve(null)
      if (val instanceof MyPromise) {
        val.then(y => {
          resolveExcutor(this, y, resolve, reject)
        }, err => {
          reject(err)
        })
      }
      resolve(val)
    })
  }
  then(onFulfilled = val => val, onRejected = err => {
    throw err
  }) {
    let promise2 = null
    promise2 = new MyPromise((resolve, reject) => {
      if (this.state === PENDING) {
        // 将then的回调压入到 resolveCallbacks中
        // 将回调执行一遍，得到回调的返回值
        // 将返回值和当前的promise传入 resolve执行器中，递归执行，
        // 当返回值为 thenable对象 或者是一个 promise的特殊情况
        this.resolveCallbacks.push(() => {
          const x = onFulfilled(this.value)
          resolveExcutor(promise2, x, resolve, reject)
        })
        this.rejectCallbacks.push(() => {
          const x = onRejected(this.value)
          resolveExcutor(promise2, x, resolve, reject)
        })
      }
      if (this.state === FULFILLED) {
        this.resolveCallbacks.push(() => {
          const x = onFulfilled(this.value)
          resolveExcutor(promise2, x, resolve, reject)
        })
      }
      if (this.state === FULFILLED) {
        this.rejectCallbacks.push(() => {
          const x = onRejected(this.value)
          resolveExcutor(promise2, x, resolve, reject)
        })
      }
    })
    return promise2
  }

  finally(cb) {
    let p = this.constructor;
    return this.then(
      val => p.resolve(cb()).then(() => val),
      err => p.resolve(cb()).then(() => {
        throw err
      }))
  } catch (err) {
    return new MyPromise((resolve, reject) => {
      reject(err)
    })
  }
}

function resolveExcutor(promise2, x, resolve, reject) {
  if (x === promise2) {
    throw new Error("循环调用promise")
  }
  if (x instanceof MyPromise) {
    if (x.state === PENDING) {
      x.then(y => {
        resolveExcutor(promise2, y, resolve, reject)
      })
    }
    x.state === RESOLVED && resolve(x)
    x.state === FULFILLED && reject(x)
  }
  if ((typeof val === "function" || typeof val === "object") && val !== null && typeof val.then === "function") {
    if (typeof x.then === "function") {
      x.then(
        (val) => resolve(val),
        err => {
          reject(err)
        })
    } else {
      resolve(x)
    }
  } else {
    resolve(x)
  }
}
const promise = new MyPromise((resolve, reject) => {
  reject("step11");
})
promise.then(
    data => {
      console.log("resolve 值：", data);
      return 'resolve'
    },
    rej => {
      console.log("reject 值：", rej);
      return 11111
    }
  )

  .then((data) => {
    console.log("data", data)
    return 3333333333
    // throw new Error("finnally")
  }).then(val => {
    console.log("val", val)

  })

// MyPromise.race([
//   new MyPromise((resolve, reject) => {
//     setTimeout(() => {
//       resolve(3)
//     })
//   }),
//   new MyPromise(resolve => {
//     resolve(1);
//   }),
//   new MyPromise(resolve => {
//     resolve(2);
//   }),
// ]).then(dataList => {
//   console.log(dataList);
// });
// step9
// const promise = new MyPromise((resolve, reject) => {
//   resolve("step9");
// });
// const promise1 = promise.then(data => {
//   return promise1;
// });
// 步骤7
// const promise = new MyPromise((resolve, reject) => {
//     resolve("step7");
//   })
//   .then(data => {
//     console.log("获取到数据：", data);
//     return new MyPromise(resolve => {
//       resolve("7.1");
//     });
//   })
//   .then(data => {
//     console.log("获取到数据：", data);
//   });
// const promise = new MyPromise((resolve, reject) => {
//     resolve("step6");
//   })
//   .then(data => {
//     console.log("获取到数据：", data);
//     return {
//       then(r, j) {
//         r("step6.1");
//       }
//     };
//   })
//   .then(data => {
//     console.log("获取到数据：", data);
//   });
// const promise = new MyPromise((resolve, reject) => {
//     resolve("step5");
//   })
//   .then(data => {
//     console.log("获取到数据：", data);
//     return "step5.1";
//   })
//   .then()
//   .then(data => {
//     console.log("获取到数据：", data);
//   });

// const promise = new MyPromise((resolve, reject) => {
//     resolve("step4");
//   })
//   .then(data => {
//     console.log("获取到数据：", data);
//     return "step4.1";
//   })
//   .then(data => {
//     console.log("获取到数据：", data);
//   });

// const promise = new MyPromise((resolve, reject) => {
//   setTimeout(() => {
//     // ajax 获取数据
//     resolve("step1");
//   }, 1000);
// }).then(data => {
//   console.log("获取到数据：", data);
// });

// const promise = new MyPromise((resolve, reject) => {
//   resolve("step2");
// }).then(data => {
//   console.log("获取到数据：", data);
// });

// const promise = new MyPromise((resolve, reject) => {
//   resolve("step3");
//   resolve("step3.1");
// }).then(data => {
//   console.log("获取到数据：", data);
// });



class EventBus {
  constructor() {
    // 创建一个对象存储事件
    this.event = Object.create(null)
  }
  on(eventName, fn) {
    // 注册事件 ，将事件名与事件存储在对象中
    if (!this.event[eventName]) {
      this.event[eventName] = []
    }
    // 这里可能会有多个事件监听
    this.event[eventName].push(fn)
  }
  off(eventName, offFn) {
    // 解除事件
    if (this.event[eventName]) {
      // 通过传入的方法查找 与解绑事件相同的事件的 序号
      let index = this.event[eventName].findIndex(fn => fn === offFn)
      // 删除事件
      this.event[eventName].splice(index, 1)
      if (this.event[eventName].length === 0) {
        // 如果事件被删除后为空数组 ，则从对象中移除
        delete this.event[eventName]
      }
    }
  }
  emit(eventName, ...args) {
    // 触发事件
    if (this.event[eventName]) {
      // 如果事件不为空，则遍历进行调用
      this.event[eventName].forEach(fn => {
        fn(...args)
      })
    }
  }
  once(eventName, onceCb) {
    // 只调用一次事件
    // 完成对事件的注册和删除
    let cb = (...args) => {
      // 调用事件
      onceCb.apply(this, args)
      // 删除事件
      this.off(eventName, onceCb)
    }
    // 注册事件
    this.on(eventName, cb)
  }
}

/**
 *  Object.create(proto, protoObject)
 *  在内部创建一个空函数 F，将空函数F.prototype设置为 传入的proto，
 * 再返回 new F()
 */
function mycreate(proto, protoObject) {
  if (typeof proto !== "object" || typeof proto !== "function") {
    throw new Error("proto must be a object or function")
  }

  function F() {}
  F.prototype = proto
  return new F()
}

// curry 函数科里化
function curry(fn) {
  let result = [];
  return function temp(...args) {
    if (args.length > 0) {
      result = result.concat(args);
      return temp;
    } else {
      return fn.apply(this, result);
    }
  };
}

// instanceof
function myinstanceof(leftValue, rightValue) {
  let rightPro = rightValue.prototype;
  let leftPro = leftValue.__proto__;
  while (true) {
    if (leftPro == null) {
      return false;
    }
    if (leftPro === rightPro) {
      return true;
    }
    leftPro = leftPro.__proto__;
  }
}
// 节流
/**
- 函数在一段时间内无论被调用多少次，只会执行一次
  */
function throttle(fn, delay) {
  let timer = null;
  return function () {
    let _this = this;
    let args = arguments;
    if (!timer) {
      timer = setTimeout(() => {
        fn.apply(_this, args);
      }, delay);
    }
  };
}
// 防抖
/**
- 函数在一段时间内无论被调用多少次，只会执行最后一次调用
  */
function debounce(fn, delay) {
  let timer = null;
  return function () {
    let _this = this;
    let args = arguments;
    if (timer) {
      timer = setTimeout(() => {
        fn.apply(_this, args);
        clearTimeout(timer);
      }, delay);
    }
  };
}
// 浅克隆
function shallowClone(target) {
  let result = {};
  for (let key in target) {
    if (target.hasOwnPrototy(key)) {
      result[key] = target[key];
    }
  }
  return result;
}

// 深克隆
function deepClone(target, map = new Map()) {
  if (typeof target === "object") {
    // 如果是 null 直接返回
    if (target == null) return null;
    // 判断是否为数组，分别赋值为数组和对象
    let isArray = Array.isArray(target);
    let cloneTarget = isArray ? [] : {};
    if (map.has(target)) {
      // 处理循环引用问题
      // 判断在 map 中是否存在 target
      return map.get(target);
    }
    // 想 map 中添加 target
    map.set(target, cloneTarget);
    // target 为数组则直接返回， 为对象，则返回对象的 key
    let keys = isArray ? target : Object.keys(target);
    keys.forEach((item) => {
      // 为克隆对象赋值
      cloneTarget[item] = deepClone(target[item], map);
    });
  } else {
    return target;
  }
}

// bind
/**
1. bind 函数 返回一个 已经绑定了 this 的函数
  2. bind 方法传入的参数会被当做默认参数， 与 bind 方法返回的函数参数拼接起来 
  3. bind 方法返回的函数被当做 构造函数时， bind 方法传入的第一个参数失效
*/
Function.prototype.mybind = function (context) {
  if (typeof this !== "function") {
    throw new Error("not a function");
  }
  // 获取需要绑定的 this
  context = context || window;
  // 需要绑定的函数
  let fToBind = this;
  // 获取传入的参数
  let args = [].slice.call(arguments, 1);
  let fNOP = function () {};
  // 返回的函数
  let fBound = function () {
    return function () {
      // 将 bind 传入的参数与 bind 方法返回的函数的参数拼接起来
      args = [].concat(args, ...arguments);
      /**
      _ this instanceof fNOP 判断 bind 返回的函数是否被当做构造函数使用
      _ 如果被当做构造函数， 则 bind 传入的 this 失效， 使用 当前函数的 this,
      _ 否则使用 bind 传入的 this 
      */
      fToBind.apply(this instanceof fNOP ? this : context, args);
    };
  };
  // 用来维护原型链
  if (this.prototype) {
    fNOP.prototype = this.prototype;
  }
  // 将返回函数的原型指向 fNOP
  fBound.prototype = new fNOP();
  return fBound;
};

/**
apply 第二个参数为数组 
*/
function myapply(context) {
  if (typeof this !== "function") {
    throw new Error("not a function");
  }
  context = context || window;
  context.fn = this;
  let result = null;
  if (arguments[1].length > 0) {
    result = context.fn(...arguments[1]);
  } else {
    result = context.fn();
  }
  delete context.fn;
  return result;
}
/**
call 
*/
function mycall(context, ...args) {
  if (typeof this !== "function") {
    throw new Error("not a function");
  }
  context = context || window;

  context.fn = this;
  let result = context.fn(args);
  delete context.fn;
  return result;
}

/**
-
new -
1. 创建一个新对象
  -
  2. 改变原型 
  3， 改变 this 
  4， 返回对象 
  */
function mynew() {
  // 声明一个对象
  let obj = {};
  // 获取构造函数
  let constructor = [].shift.call(arguments);
  // 改变对象的原型指向
  obj.__proto__ = constructor.prototype;
  // 改变this
  let result = constructor.apply(obj, arguments);
  // 返回对象
  return typeof result === "object" ? result : obj;
}