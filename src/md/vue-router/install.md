# vue-router的install方法

## 逻辑 @/install.js

> 方法

``` javascript
//注册实例
const registerInstance = (vm, callval) => {
    let i = vm.$options._parentVnode
    if (isDef(i) && isDef(i = i.data) && isDef(i = i.registerRouteInstance)) {
        i(vm, callval)
    }
}
```

> 如果已经被调用过，直接返回

``` javascript
if (install.installed && _Vue === Vue) return
```

> 创建一个 mixin

``` javascript
Vue.mixin({
    beforeCreate() {
        // 首次进入路由
        if (isDef(this.$options.router)) {

            this._routerRoot = this
            this._router = this.$options.router
            this._router.init(this)
            Vue.util.defineReactive(this, '_route', this._router.history.current)
        } else {
            // 之后为每个组件传递根路由，方便在组件中访问
            this._routerRoot = (this.$parent && this.$parent._routerRoot) || this
        }
        registerInstance(this, this)
    }
})
```

> 将$router 和$route 挂载到Vue实例上，并修改get

``` javascript
 Object.defineProperty(Vue.prototype, "$router", {
     get() {
         return this._routerRoot._router
     }
 })

 Object.defineProperty(Vue.prototype, "$route", {
     get() {
         return this._routerRoot._route
     }
 })
```

> 注册RouterView 和 RouterLink组件 @/components/

``` javascript
Vue.component("RouterView", View)
Vue.component("RouterLink", Link)
```

> 对路由钩子使用相同的合并策略 @/history/base.js

``` javascript
const strats = Vue.config.optionMergeStrategies
strats.beforeRouteEnter = strats.beforeRouteLeave = strats.beforeRouteUpdate = strats.created
```
