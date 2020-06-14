# AXIOS源码理解
```javascript
~ ./axios.js
var utils = require('./utils');
var bind = require('./helpers/bind');
var Axios = require('./core/Axios');
var mergeConfig = require('./core/mergeConfig');
var defaults = require('./defaults');
function createInstance(defaultConfig){
  // 实例化 axios
  var context = new Axios(defaultConfig)
  // 将context当做 Axios原型上的request方法的参数进行执行，使用apply
  var instance = bind(Axios.prototype.request, context)
  // 复制axios原型上的属性到axios实例上
  utils.extend(instance, Axios.prototype, context)
  // 复制上下文到axios实例上
  utils.extend(instance, context)
  // 返回axios实例
  return instance
}

var axios = createInstance(defaults);
axios.Axios = Axios;
// 创建一个axios实例 
/** 
  mergerConfig()
  将传入的config对象与axios自身默认的属性进行合并，以传入的属性值为主
*/
axios.create= function (instanceConfig){
  return createInstance( mergerConfig(axios.defaults, instanceConfig))
}

// 暴露axios的取消方法
axios.Cancel = requir('./cancel/cancel')
axios.CancelToken = requir('./cancel/CancelToken')
axios.isCancel = requir('./cancel/isCancel')

// 暴露axios的all方法，实际上就是Promise.all()
axios.all= function all(promises){
  return promise.all(promises)
}

module.exports = axios
```

```javascript
new Axios(defaultConfig)
处理流程
1. 将传入的defaultConfig 赋值给 default做为默认值
2. 将request 、response 对象挂载到 axios.interCeptors 拦截器上

为axios原型添加 request、getUri方法
分别遍历的将 get delete head options请求方法挂载到axios原型对象上
分别将 put post patch 请求方法挂载到axios原型对象上

为什么要分两次遍历挂载 请求方法 ？ 
因为 get delete head options 是通过 request的head进行传递参数
而 put post patch 是通过 request 的body 进行传递参数

axios.prototype.request = function(config){} 方法
1. 设置config 的默认值 
2. 将传入的config 与axios 默认的配置进行合并，以传入的config为主
3. 设置config.method ，如果config中没有传入，则默认为 get 请求
4. 处理axios的拦截器中间件， 
    因为axios.interCeptors 拦截对象上 存在request、response 两种对象
  所以对 request和response 对象分别处理拦截器中间件
  1. 对 request对象处理
    将request的中间件 进行unshift 头部弹出 处理
  2. 对 response对象处理
    将response的中间件进行 push 压入数组处理

返回一个参数序列化的 url 地址
axios.prototype.getUri = function (config){} 方法


```

```javascript
axios.interceptors拦截器
# ~./core/interceptorManager.js
在拦截器的prototype原型上 挂载了 use、 eject、forEach 方法
InterceptorManager.prototype.use(fulfilled, rejected)
use 会传入 两个方法， 分别是成功处理函数、失败处理函数
将这两个函数push到 InterceptorManage 的handers栈中

InterceptorManager.prototype.eject(id)
将传入的id设置为null

InterceptorManage.prototype.forEach(fn)
依次执行 handler栈中的 拦截器方法
```

``` javascript
var axios = createInstance(defaults);
defaults ~./defaults
1. 通过 XMLHttpRequest对象 和process 来判断是浏览器环境 还是 node 环境
  浏览器环境则使用 XMLHttpRequest封装的请求
  node环境则使用 node原生的http、https模块封装的请求
2. 为defaults设置默认axios默认的属性值
```