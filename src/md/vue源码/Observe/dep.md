# vue的依赖收集

> Dep 拥有 addSub(), removesub(), depend(), notify()等方法

1. addSub() : 只是简单的将 需要更新的Watcher添加到subs数组中
2. removeSub(): 删除依赖
3. depend(): 
4. notify(): 通知更新,然后遍历执行一遍subs中的update方法

> Dep使用一个subs 来存储Watcher , 同时使用一个自增的ID来，当Dep被notify触发更新的时候vue根据ID来对每个缓存的Watcher进行排序
