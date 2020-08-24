# vue对数组的处理

``` javascript
// 需要处理的 数组的方法
const methodsToPatch = ["push", 'pop', "shift", "unshift", "splice", "sort", "reverse"];
methodsToPatch.forEach(method => {
    // 将Array.prototype保存起来， 防止vue处理时对 Array.prototype产生不必要的影响
    const original = Object.create(Array.prototype)[method];
    // def 是vue封装的Object.definePrototy(object, key , {})
    def(original, method, function mutator(...args) {
        // 调用数组方法返回的结果
        const result = original.apply(this, args)
        const ob = this.__ob__
        let inserted;
        switch (method) {
            // 如果是push ,unshift, splice方法需要单独处理
            case "push":
            case "unshift":
                inserted = args;
                break;
            case "splice":
                // 这里需要 slice(2) 是因为 splice(start, deleteCount, item1, ..., itemn) 
                // 数组的splice方法传入的值，是从第三个参数开始的
                inserted = args.slice(2);
                break;
            default:
                break;
        }
        if (inserted) {
            // 如果传入的参数存在，则对参数进行监听
            ob.observeArray(inserted)
        }
        // 通知依赖收集进行数据更新
        ob.dep.notify()
        return result
    })
});
```
