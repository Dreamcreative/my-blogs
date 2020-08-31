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
    if (target.hasOwnPrototyep(key)) {
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
  let obj = {};
  let constructor = [].shift.call(arguments);
  obj.__proto__ = constructor.prototype;
  let result = constructor.apply(obj, arguments);
  return typeof result === "object" ? result : obj;
}