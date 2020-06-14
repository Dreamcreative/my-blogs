# 封装node原生的 http、https模块
```javascript
1. 返回一个promise
2. 判断data的数据类型
  将data的数据类型转为buffer，同时，设置header['Content-Length'] 属性
3. 判断是否使用 代理 proxy
4. 判断使用的协议是http 还是https
5. 然后监听 data、error、 end 方法
6. 返回得到的数据 或者是 错误
```