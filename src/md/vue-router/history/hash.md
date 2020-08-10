# HashHistory类 ，继承自History类

> 参数 (router: Router, base:? String , fallback: Boolean)
> 实现了push 、replace、go、ensureURL、getCurrentLocation

* push (location: RawLocation, onComplete?: Function, onAbort?: Function)
  + 向路由对象中压入路由信息实现路由跳转
  + 调用了 History类的 transitionTo()方法 (跳转路由)
  + 在 transitionTo onComplete完成函数中 调用了 pushHash()

``` JS
pushHash() {}
```

* replace(location: RawLocation, onComplete?: Function, onAbort?: Function)

   * 
