# vue 实现的 set 和 delete

> set(target, key, val) 修改对象数组的值

```javascript
# core/observe/index.js;
if (Array.isArray(target) && isValidArrayIndex(key)) {
  // 如果target是数组，判断传入的key是不是有效的 数组下标
  target.length = Math.max(target.length, key);
  //   调用数组的splice方法进行 数组下标值的替换
  target.splice(key, 1, val);
  //   返回值
  return val;
}
if (key in target && !(key in Object.prototype)) {
  // target为对象时
  // 如果key存在target中 ， 并且key不在对象的原型上
  // 直接修改对象的key val
  target[key] = val;
  return val;
}
// 获取target的 观察属性
const ob = target.__ob__;
if (!ob) {
  // 如果没有被观察，则 直接赋值
  target[key] = val;
  return val;
}
// 如果为新增的属性，为新增属性添加监听
defineReactive(ob.value, key, val);
// 触发更新
ob.dep.notify();
return val;
```

> del(target, key) 删除对象数组的属性

```javascript
# core/observe/index.js;
if (Array.isArray(target) && isValidArrayIndex(key)) {
  // 如果是数组，并且传入的下标有效
  // 直接通过splice删除数组指定下标值
  target.splice(key, 1);
  return;
}
// 获取target的观察属性
const ob = target.__ob__;
if (!hasOwn(target, key)) {
  // 判断需要删除的 key是否是自身拥有的属性
  return;
}
delete target[key];
if (!ob) {
  return;
}
// 触发更新
ob.dep.notify();
```
