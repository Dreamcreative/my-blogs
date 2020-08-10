# History类

> History类属性

* router: Router  路由实例
* base: String 基础路径
* current: Route 当前路由
* pending:? Route 描述阻塞状态
* cb:(r: Route) => void 监听时的回调函数
* ready : boolean描述就绪状态
* readyCbs: Array<Function> 就绪状态的回调数组
* readyErrorCbs: Array<Function> 就绪状态的错误回调数组
* errorCbs: Array<Function>  错误的回调数组
* listeners : Array<Function> 监听函数数组
* cleanupListeners: Function 

> History类 的子类

* +go: (n: number) => void 
* +push: (loc: RawLocation, onComplete?: Function, onAbort?: Function) => void
* +replace: (loc: RawLocation, onComplete?: Function, onAbort?: Function) => void
* +ensureURL: (push?: boolean) => void
* +getCurrentLocation: () => string
* +setupListeners: Function

> transitionTo (location: RawLocation, onComplete?: Function, onAbort?: Function)对路由跳转的封装

``` javascript
  // 得到匹配的路由 route
  const route = this.router.match(location, this.current)
  // 确认跳转
  this.confirmTransition(route, () => {
      ..success..
  }, (err) => {
      ..err..
  })
```

> confirmTransition (route: Route, onComplete: Function, onAbort?: Function) 确定跳转路由

``` javascript
const current = this.current
const abort = (err) => {
    ..中止路由跳转..
}
const lastRouteIndex = route.matched.length - 1
const lastCurrentIndex = current.matched.length - 1
if (isSameRoute(route, current)) {
    // 如果传入的路由信息和当前的路由信息相同
    this.ensureURL()
    // 中止当前路由跳转
    return abort(createNavigationDuplicatedError(current, route))
}
// 根据当前路由呵匹配到的路由: 返回 更新的路由 ，停用的路由，激活的路由，
const {
    updated,
    deactivated,
    activated
} = resolveQueue(this.current.matched, route.matched)
// 合并路由守卫钩子函数，以便在之后的阶段执行
const queue: Array < ? NavigationGuard >= [].concat(
    // in-component leave guards
    // beforeRouteLeave 路由钩子
    extractLeaveGuards(deactivated),
    // global before hooks
    //  beforeHooks 全局路由钩子
    this.router.beforeHooks,
    // in-component update hooks
    // beforeRouteUpdate 路由钩子
    extractUpdateHooks(updated),
    // in-config enter guards
    // 执行当前处于激活状态的路由的 beforeRouteEnter 路由钩子
    activated.map(m => m.beforeEnter),
    // async components
    resolveAsyncComponents(activated)
)
```
