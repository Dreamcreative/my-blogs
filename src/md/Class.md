# Class类

> ES5中定义类

``` JS
  function Point(x, y) {
      this.x = x
      this.y = y
  }
  Point.prototype.toString = function() {
      return this.x
  }
```

> ES6中定义类

``` JS
class Point {
    // 构造函数，如果不定义，会默认添加
    constructor(x, y) {
        this.x = x
        this.y = y
    }
    toString() {
        return this.x
    }
}
```

> prototype属性

* prototype属性在ES6class中仍然存在，并且
