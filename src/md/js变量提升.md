---
title: 变量提升
date: 2018-01-02 17:27:44
tags: 变量提升
---
# 从编译器角度看问题
    js在编译节点，编译器的一部分工作就是找到所以声明,并用和尚的作用域将他们关联起来，对于人来说 var a=2; 仅仅只是一个
声明.但是，js编译器会将该端代码拆为两段，即 var a  和 a=2;  var a 这个定义声明会在编译阶段执行，而a=2 这个赋值会在原地
等待传统意义上的从上到下的执行。
# 从代码的执行角度看问题
    执行上下文的代码会分成两个阶段进行处理: 分析和执行，我们也可以叫做
        1。编译阶段
        2.代码执行阶段
## 编译阶段
    所有声明(变量和函数)都会被移动到各自作用域的最顶端，
## 代码执行阶段
    变量的赋值会在原地进行

# 函数提升
```
    foo();
    function foo(){
        console.log(a);
        var a=2 ;
    }
```
会输出 undefined ,因为函数变量也能提升,实际运行如下
```
    function foo(){
        var a ;
        console.log(a);
        a=2 ;
    }
    foo();
```
# 函数表达式的提升情况
```
foo();
var foo=function bar(){
    console.log(a);
    var a =2;    
}
```
js会报TypeError错误
因为，函数表达式不会进行提升
实际运行情况
```
    var foo;
    foo();
    foo = function bar(){
        var a ;
        console.log(a);
        a=2 ;
    }
```
由于执行时，在作用域找得到foo，所以不会报ReferenceError错误,但是，foo此时并没有赋值( 如果foo是一个函数声明而不是函数表达式，那么就会被赋值)，
也就是说实际上 foo() 是对一个值为 undefined的变量进行函数调用，所以会抛出 TypeError 异常
同时, 即使是具名的函数表达式 bar ,名称表示服在赋值之前也无法在所在作用域中使用
```
foo();  // TypeError
bar();  // ReferenceError

var foo = function bar () {}
```
# 函数优先
函数声明和边上声明都会被提升，但是有一个值得注意的细节，那就是,函数会首先提升，然后才是变量！
```
foo();
var foo;
function foo () {
    console.log(1);
}
foo = function () {
    console.log(2);
}
```
代码实际执行
```
function foo () {
    console.log(1);
}
var foo; //重复声明,被忽略
foo(); // 1
foo = function () {
    console.log(2);
}
```
如果，在代码的结尾再执行一次foo函数，
```
function foo () {
    console.log(1);
}
var foo;    // 重复声明，被忽略
foo();      // 输出1
foo = function () {
    console.log(2);
}
foo();  //2
```
# 思考题
```
foo();
var a = true;
if (a) {
    function foo () {
        console.log("a");
    }
} else {
    function foo () {
        console.log("b");
    }
}
```
这段代码 会报 TypeError 错误，如果 if 中的函数声明能够被提升 就会 打印 a
但是报TypeError 错误 ，所以 if中的函数并没有被提升到if外层 所以 声明提升只会提升到当前作用域顶部
而变量声明 如果用 var 声明 可以被提升到外层 ,但是用let 不会