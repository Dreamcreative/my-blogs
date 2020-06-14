---
title: JavaScript高级程序设计第六章
date: 2019-09-09 10:45:54
tags: JavaScript高级程序设计第六章
---
# 第六章 面向对象的程序设计 (**Object-Oriented Programming OOP**)

**ECMAscript 中没有类的概念**,因此它的对象与基本类的语言中的对象有所区别
每个对象都是基于一个引用类型的散列表:无非就是一组键值对

## 6.1 理解对象

- 创建对象的方式有两种

  1.  对象字面量(首选)

  ```bash
  var person = {
      name:"object",
      age:12,
      fn:function(){
          console.log(this.name)
      }
  }
  ```

  2.  对象实例

  ```bash
  var person = new Object();
  person.name="object";
  person.age=12;
  person.fn=function(){
  	console.log(this.name)
  }
  ```

## 6.1.1 属性类型(描述属性 property 的各种特征)

### EACMscript 中有两种属性: 数据属性和访问器属性

1. 数据属性(数据属性有 4 个描述其行为的特性)、
   - [[Configurable]]:表示能否对该属性通过 delete 删除属性并重新定义属性、能否修改属性的特性、能否把属性修改为访问器属性.**默认为 true，并且一旦设置为 false 就不能再改为 true**
   - [[Enumerable]]:表示能否通过 for-in 循环返回属性。**默认为 true**
   - [[Writable]]:表示能否修改属性的值。**默认为 true**
   - [[Value]]:包含这个属性的数据值。**默认值为 undefined**

### 要修改属性默认的特性,必须通过 EACMscript5 的 Object.defineProperty(obj, property, descriptor)方法.

    * obj:表示目标对象
    * property:表示目标对象的属性名
    * descriptor:表示对属性名的描述对象，同时必须是：configurable,enumerable,writable,value 的其中一个或多个值

```bash
var person={};
Object.defineProperty( person , name , {
	writable:false,
	value:"person"
})
alert(person.name) // person
person.name="man";
alert(person.name) // person
```

> 上面的代码,如果是在严格模式下,一个不可修改的属性被修改，会报错.在非严格模式下会被忽略

> IE8 是第一个实现 Object.defineProperty()方法的.但是它的实现存在诸多限制，只能在 DOM 对象上使用,只能创建访问器属性.由于实现的不彻底,所以不要在 IE8 下使用 Object.defineProperty()方法

2. 访问器属性

### 访问器属性不包含数据值,他们包含一对 getter 和 setter 函数(不过都不是必须的).在读取访问器属性时调用 getter 函数,在写入访问器属性时,调用 setter 函数

- [[Configurable]]:示能否对该属性通过 delete 删除属性并重新定义属性、能否修改属性的特性、能否把属性修改为访问器属性.**默认为 true，并且一旦设置为 false 就不能再改为 true**
- [[Enumerable]]:表示能否通过 for-in 循环访问属性.**默认为 true**
- [[Get]]:在读取属性时调用的函数.**默认为 undefined**
- [[Set]]:在写入属性时调用的函数.**默认为 undefined**

### 访问器属性不能直接定义.必须通过 EACMscript5 的 Object.defineProperty(obj, property, descriptor)方法.

    * obj:表示目标对象
    * property:表示目标对象的属性名
    * descriptor:表示对属性名的描述对象，同时必须是：configurable,enumerable,writable,value 的其中一个或多个值

```bash
var book = {
	_year:2004,
	edition:1
}
Object.defineProperty(book, "year", {
	get:function(){
		return this._year
	},
	set:function(){
		if( newValue >2004){
			this._year = newValue;
			this.edition += newValue - 2004;
		}
	}
} )
book.year = 2005;
alert(book.edition) // 2
```

> 在严格模式下 getter 和 setter 如果不同时指定,会抛出错误。在非严格模式下可以不用同时指定 getter 和 setter

> 在修改访问器属性时,在 Object.defineProperty()方法未出现之前。一般使用由 Firefox 引入的两个非标准的方法**defineGetter**()和**defineSetter**()

```bash
var book = {
	_year:2004,
	edition:1
}
book.__defineSetter__("year", function(){
	return this._year
})
book.__defineGetter__("year" , function(){
	if( newValue >2004){
		this._year = newValue;
		this.edition += newValue - 2004;
	}
})
```

## 6.1.2 定义多个属性

### ECMAscript5 为对象定义多个属性,又提供了一个 Object.defineProperties(targetobj ,changeTargetobj )方法

    * targetobj: 要添加和修改器属性的对象
    * changeTargetobj: 第二个对象的属性与第一个对象中药添加或修改的属性一一对应

```bash
var book={};
object.defineProperties( book , {
	_year:{
		writable:true,
		value:2004
	},
	edition:{
		writable:true,
		value: 1
	},
	year:{
		get:funtion(){
			return this._year;
		},
		set:function(){
			if( newValue >2004){
				this._year = newValue;
				this.edition += newValue - 2004;
			}
		}
	}
})
```

> 以上在 book 对象上定义了两个数据属性和一个访问器属性,与 Object.defineProperty()唯一的区别就是,这里的属性都是在同一时间创建的

## 6.1.3 读取属性的特性

### 在 ECMAscript5 中定义了 Object.getOwnPropertyDescriptor(obj ,property )方法，可以取得给定属性的描述符,返回值是一个对象

    * 数据属性: 返回对象有 configurable、enumerable、writable、value
    * 访问器属性: 返回对象有 configurable、enumerable、set、 get

## 6.2 创建对象

## 6.2.1 工厂模式

### 由于 ECMAscript 中无法创建类,所以使用函数来封装特定接口创建对象

```bash
function create(name , age){
	var o = new Object();
	o.name= name;
	o.age = age;
	o.sayname = function (){
		return this.name;
	}
	return o ;
}
var person1 = create("tom",12);
var person2 = create("jim" , 13);
```

> 工厂模式虽然解决了创建多个相似对象的问题,但却没有解决对象识别的问题

### 构造函数模式

```bash
function Person(name,age){
	this.name = name;
	this.age = age;
	this.sayname = function(){
		return this.name;
	}
}
var person1 = new Person("tom",12);
var person2 = new Person("jim",11);
```

#### 使用 Person()函数代替了 create()函数，Person()中代码除了与 create()中相同的部分外,还存在以下不同之处

- 没有显式地创建对象
- 直接将属性和方法赋给了 this 对象
- 没有 return 语句

#### 按照惯例,构造函数始终应该以一个大写字母开头,而非构造函数则应该以一个小写字母开头.这种方法借鉴自其它 OO 语言。因为构造函数本身也是函数,值不过可以用来创建对象而已

#### 创建 Person 的新实例,必须使用 new 操作符,这种调用构造函数实际上会经历一下 4 个步骤

1. 创建一个对象
2. 将构造函数的作用域赋给新对象(因此 this 将指向这个新对象)
3. 执行构造函数中的代码
4. 返回新对象

#### person1 和 person2 分别保存着 Person 的一个不同的实例。着两个对象都有着一个 constructor(构造函数)属性，该属性指向构造函数(这里是 Person)

```bash
alert(person1.constructor == Person ) // true
alert(person2.constructor == Person ) // true
```

#### 检测对象类型

##### 使用 instanceof 操作符

```bash
alert(person1 instanceof Object) // true
alert(person1 instanceof Person) // true
alert(person2 instanceof Object) // true
alert(person2 instanceof Person) // true
```

##### person1 和 person2 之所以同时是 Object 的实例,是因为所有对象均继承自 Object

#### 1 构造函数当做函数

##### 构造函数与其他函数的唯一区别，就在于调用他们的方式不同。(**任何函数,通过 new 操作符调用，那它就可以作为构造函数。如果不通过 new 操作符调用,那它跟普通函数没有任何区别**)

#### 2 构造函数的问题

##### 构造函数的主要问题,就是每个方法都要在每个实例上重新创建一边，

##### 在 ECMAscript 中的函数式对象,因此每定义一个函数，也就是实例化一个对象，在构造函数中创建的函数，在每次实例的时候都会重新创建，所以每个实例对象中的函数都是不同的,我们可以通过下面的方式来解决

```bash
function Person (name,age){
	this.name = name;
	this.age = age;
	this.sayname = sayname;
}
function sayname = function(){
	return this.name;
};
```

##### 我们将函数定义在构造函数外面，构造函数上的函数只是一个指针，指向一个函数，这样就能解决每个实例对象中的函数不同的问题,但是这样就没有封装性可言。

**好在这些问题可以通过使用原型模式来解决**

#### 6.2.3 原型模式

##### 我们创建的每个函数都有一个 prototype(显式原型)属性，这个属性是一个指针，指向一个对象.这个对象是用来包含所有势力共享的属性和方法

```bash
function Person(){};
var PersonProto = Person.prototype ;
PersonProto.name = "tom";
PersonProto.age = 12;
PersonProto.sayname = function(){
	return this.name;
};
var person1 = new Person();
person1.sayname() // tom
var person2 = new Person();
person2.sayname() // tom
alert( person1.sayname ==person2.sayname) // true
```

#### 1 理解原型对象

##### 只要创建一个函数,就会根据一定的规则为函数创建一个 prototype 属性，指向函数的原型对象。同时，所有原型对象会自动获取一个 constructor 属性，这个属性指向构造函数

##### 创建了自定义的构造函数之后，其原型对象默认只会取得 constructor 属性，而其他方法都是从 Object 继承而来。

##### 当调用构造函数创建一个新实例后，该实例的内部将包含一个指针(内部属性,ECMA-262 中管这个指针叫[[prototype]]).虽然我们没有标准的方式访问[[prototype]],但是在 Firfox、Safari、Chrome 的每个对象上都支持一个属性**proto**(隐式原型)，这个连接存在于实例和构造函数的原型对象之间,而不存在与实例与构造函数之间

##### 虽然在所以事先中都无法访问到[[prototype]],但是可以通过 isPrototypeOf()方法来确定对象之间是否存在这种关系

```bash
alert(Person.prototype.isPrototypeOf(person1)) //true
alert(Person.prototype.isPrototypeOf(person2)) //true
```

##### ECMAscript5 增加了一个新方法,getPrototypeOf().在所有支持的实现中,返回[[prototype]]的值

```bash
alert(Object.getPrototypeOf(person1) == Person.prototype) //true
alert(Object.getPrototypeOf(person1)).name //tom
```

> 每当代码读取某个对象的属性时，都会进行一次搜索,目标是具有给定名字的属性。搜索首先从对象实例本身开始。如果在实例中找到了,就直接返回该属性的值;否则会继续搜索指针指向的原型对象，找到了就会返回该属性的值,如果搜索一直到 Object.prototype 还没有搜索到，就会返回 undefined,因为 Object.prototype 是最顶级的原型对象 ------ 这就是原型链搜索

#### 2 原型和 in 操作符

##### 有两种方式使用 in 操作符 ： 单独使用 (in) 和 (for-in)使用

1. 单独使用时，in 操作符会在通过对象能够访问的给定属性时返回 true,无论该属性是在自身实例上还是原型对象上

```bash
function Person(){}
Person.prototype.name="tom";
Person.prototype.age = 12;
Person.prototype.sayname= function(){
	return this.name
}
var person1 = new Person();
var person2 = new Person();
alert(person1.hasOwnProperty("name")) //false hasProperty() 查找自身属性
alert( "name" in Person1) // true  in操作符查找自身和原型对象

person1.name = "jim";
alert(person1.name) //jim
alert(person1.hasOwnProperty("name")) // true
alert("name" in person1) // true
```

2. 在使用 for-in 循环时,返回所有能够通过对象访问到的、可遍历的属性，其中包括自身属性、原型对象属性

> 在 IE8 及更早的版本中,存在一个 bug，即屏蔽不可美剧属性的实例属性不会出现在 for-in 循环中

```bash
var o ={
	toString:function(){
		return "my object";
	}
}
for(var item in o){
	if(item=="toString"){
		alert("Found") //在 IE中不会显示
	}
}
```

> 上面的代码在 IE 中由于其实现认为原型对象上 toString()方法[[enumerable]]为 false，因此应该跳过该属性,所以我们看不到 alert(),当然也包括了其他原型对象上的[[enumerable]]为 false 的属性

##### ECMAscript5 中提供了一个 Object.keys(obj)方法，接收一个对象，返回一个包含了自身和原型对象上的所有课可遍历的属性的字符串数组集合。而如果你想得到所有的属性名(无论是可遍历，或者是不可遍历的属性名),可以使用 Object.getOwnPropertyNames().并且可以用 Object.keys()和 Object.getOwnPropertyNames()来代替 for-in 循环

#### 3 更简单的原型语法

```bash
function Person(){}
Person.prototype={
	name:"tom",
	age:12,
	sayname:function(){}
}
```

##### (如以上)我们可以用一个包含所有属性和方法的对象字面量来重写整个原型对象。以上的实现结果与单个在 prototype 上定义属性和方法得到的结果相同。但是有一个例外:constructor 属性不在指向 Person.((因为在创建实例对象的时候,根据一定的规则生成一个指向原型对象的 prototype 属性，同时获取到 constructor 属性。而以上的方式相当于手动改写了对象的原型对象,所以这个的 constructor 属性不在指向 Person.只能由我们手动的修改 constructor，将 constructor 指向我们想让它指向的构造函数))

```bash
function Person(){}
Person.prototype={
	constructor:Person,
	name:"tom",
	age:12,
	sayname:function(){}
}
```

##### 由于原生的 constructor 是不可遍历的(enumerable 为 false),但是使用上面的方式修改 constructor 是可遍历的(enuerable 为 true),我们可以使用下面的方式修改 constructor

```bash
function Person(){}
Person.prototype={
	name:"tom",
	age:12,
	sayname:function(){}
}
Object.defineProperty(Person,"constructor",{
	enumerable:false,
	value:Person
})
```

#### 4 原型的动态性

##### 原型中查找过程是一次搜索，因此我们对原型对象所在的任何修改都能够立刻从实例上体现

```bash
var friend = new Person();
Person.prototype.sayHi = function(){
	alert("HI")
}
friend.sayHi(); // HI
```

##### 尽管可以随时为原型添加属性和方法,并且修改后能够立即体现出来。但是如果重写了整个原型对象，那么情况就不一样了。在调用构造函数时会为实例添加一个纸箱最初原型的[[prototype]]指针，而重写原型就等于切断了构造函数和原型之间的联系((请记住：实例中的指针仅纸箱原型，而不指向构造函数))

```bash
function Person(){}
var friend = new Person();
Person.prototype={
	name:"tom",
	age:12,
	sayname:function(){}
}
friend.sayname() // error
```

> 可以理解为 当 friend = new Person()的时候, friend 的原型对象指向了 Person.prototype。但是当 Person.prototype={} 重写了之后，friend 的原型对象的指针指向的还是原型 Person.prototype 没有被重写之前的原型对象

#### 5 原型对象的原型

##### 所有原生的应用类型，都是采用原型模式创建的。所有的原生引用类型(Array,String,Object 等等)，都在其构造函数的原型上定义了方法，我们可以像定义普通函数一样去原生引用类型上去定义新的方法。但是不建议这么做，因为这样可能会造成命名冲突，或者是意外地重写了原生方法

#### 6 原型对象的问题

##### 原型模式的缺点

1. 省略了为构造函数传递初始化参数这一环节，是的所以的时间在默认情况下取得相同的属性值
2. 原型模式最大的问题就是他的共享本性导致的

```bash
function Person(){}
Person.prototype={
	name:"tom",
	age:12,
	friends:["jim","tommy"]
}
var person1 = new Person();
var person2 = new Person();
person1.friends.push("van");
alert(person1.friend) //"jim","tommy","van"
alert(person2.friend) //"jim","tommy","van"
alert(person1.friend == person2.friend)  //true
```

##### 原型模式的引用类型的值修改会对所有实例产生影响，

#### 6.2.4 组合使用构造函数模式和原型模式

##### 创建自定义类型的最常见方式，就是组合使用构造函数模式和原型模式。使得实例分别具有私有属性和共享属性

#### 6.2.5 动态原型模式

##### 有其他 OO 语言经验的开发人员看到独立的构造函数和原型是，很可能感到非常困惑。动态原型模式正是致力于解决这个问题的一个方案 ---- 就是先判断某个方法是否有效时，来决定是否初始化原型

```bash
function Person (name,age){
	this.name=name;
	this.age= age
}
if(Person.prototype.sayname){
	Person.prototype.sayname = function(){}
}
```

#### 6.2.6 寄生构造函数模式 (没看懂，之后再写)

##### 在前面几种模式都不适用的情况下，可以使用寄生构造函数模式

#### 6.2.7 稳妥构造函数模式

##### 稳妥函数模式是指没有公共属性，而且其方法也不引用 this 的对象。最适合在一些安全的环境中使用

```bash
function Person(name,age){
	var o = new Object();
	o.sayname = function(){
		alert(name)
	}
	return o;
}
```

> 在以这种模式创建的对象中，除了使用 sayname 方法，没有别的方式可以访问其数据成员 (并且稳妥函数模式创建的实例对象与构造函数之间没有任何关系，不能使用 instanceof 来判断)

## 6.3 继承

### 许多 OO 语言都支持两种继承方式：接口继承和实现继承

- 接口继承：只继承方法签名
- 实现继承：只继承实际的方法

### 而由于在 ECMAscript 中函数没有签名，所以 ECMAscript 只支持实现继承。主要通过原型链来实现

#### 原型链

##### 原型对象(prototype)拥有一个指向其他原型对象的指针，另一个原型对象又拥有一个指向第三个原型对象的指针，那么这样层次递进，就构成了实例与原型的链条，就形成了原型链

##### 当一个实例在查找属性时，就会通过这条原型链一层一层地查找

##### 1 别忘记默认的原型

##### 所欲的引用类型默认都继承了 Object,而这个继承也是通过原型链来实现的。因此所有函数的默认原型都是 Object 的实例，而默认原型都包含一个内部指针，指向 Object.prototype，这也是为什么所有自定义类型都会继承 toString()、valueOf()等方法的原因

##### 2 确定原型和实例的关系

1. instanceof : 通过这个操作符来测试实例与原型链中出现过的构造函数 ，结果就会返回 true
2. isPrototypeOf() : 只要是原型链中出现过的原型，就会返回 true

##### 3 谨慎地定义方法

1. 在需要覆盖原型对象上的方法时，一定要房租替换原型的语句之后
2. 在通过原型链实现继承是，不能使用对象字面量方式创建原型方法，因为这样会导致重写原型链

```bash
function Person(){}
var friend = new Person();
Person.prototype={
	name:"tom",
	age:12,
	sayname:function(){}
}
friend.sayname() // error
```

> 可以理解为 当 friend = new Person()的时候, friend 的原型对象指向了 Person.prototype。但是当 Person.prototype={} 重写了之后，friend 的原型对象的指针指向的还是原型 Person.prototype 没有被重写之前的原型对象

##### 4 原型链的问题

##### 原型链虽然很强大，但是它最大的问题来着包含引用类型值的原型。就是当某一个实例修改了引用类型的原型属性时，其他实例也会受到影响

#### 6.3.2 借用构造函数

##### 在解决原型中包含引用类型值所带来问题的过程中，都使用一种叫做借用构造函数的技术

```bash
function SuperType(){
	this.colors=["red","yellow"];
}
function SubType(){
	SuperType.call(this)
}
var instance1= new SubType();
instance1.colors.push("blue");
alert(instance1.colors) // "red","yellow","blue"

var instance2= new SubType();
alert(instance2.colors) // "red","yellow"
```

> 上面的代码可以这么理解：在每次实例的时候，SubType 都会初始化一下 SuperType 使得 this.colors 重置

##### 借用构造函数的问题

##### 如果仅仅是借用构造函数，也将无法避免构造函数模式存在的问题----方法都在构造函数中定义，无法得到复用

#### 6.3.3 组合继承

##### 指将原型链和借用构造函数的技术组合到一块。思路是：使用原型链实现对原型属性和方法的继承，通过借用构造函数来实现对实例属性的继承。使得既通过原型上定义方法实现了函数复用，又能够保证每个实例拥有自己的属性

```bash
function SuperType(name){
	this.name = name;
	this.colors=["red","yellow"];
}
SuperType.prototype.sayname=function(){}
function SubType( name ,age){
	SuperType.call(this,name);
	this.age = age
}
// 继承方法
SubType。prototype = new SuperType();
SubType。prototype.constructor = SubType;
SubType。prototype.sayage = function(){}

var instance1=new SubType("tom",12);
instance1.colors.push("blue");
alert(instance1.colors)  //"red","yellow","blue"
instance1.sayname(); // tom
instance1.sayage(); // 12

var instance1=new SubType("van",13);
alert(instance1.colors)  //"red","yellow"
instance1.sayname(); // van
instance1.sayage(); // 13
```

#### 6.3.4 原型式继承

```bash
function object(o){
	function F(){}
	F.prototype = o;
	return new F();
}
```

##### 在 ECMAscript5 通过新增 Object.create()方法规范了原型式继承。Object.create(obj,ohterProperties)接收两个参数

1. obj：表示用作新对象原型的对象
2. otherProperties: 为新对象定义额外属性的对象

```bash
var person = {
	name:"tom",
	friends:["tim","van"]
}
var anotherPerson=Object.create(person,{
	name:{
		value:"greg"
	}:
})
alert( anotherPerson.name) // greg
```

#### 6.3.5 寄生继承

##### 即创建一个仅用于封装继承过程的函数，该函数在内部以某种方式来增强对象，最后在返回对象

```bash
function createAnother(original){
	var clone = object(original) // 通过调用函数创建一个新对象
	clone.sayhi = function(){}
	return clone;
}
```

#### 6.3.6 寄生组合式继承

##### 组合继承是 JavaScript 最常用的继承模式。但它最大的不足就是需要调用两次超类型构造函数，

1. 创建类型原型的时候
2. 在子类型构造函数内部

```bash
function SuperType(name){
	this.name=name;
	this.colors=["red","yellow"];
}
SuperType.prototype.sayname = function(){
	alert(this.name)
}
function SubType(name,age){
	SuperType.call(this); // 第二次调用
	this.age = age;
}
SubType.prototype= new SuperType() // 第一次调用
SubType.prototype.constructor = SubType;
SubType.prototype.sayage = function(){
	alert( this.age )
}
```

#### 寄生组合式继承：即通过借用构造函数模式来实现属性继承，通过原型链模式来实现方法继承

```bash
function inheritPrototype(subType,superType){
	var prototpye = object(superType) // 创建对象
	prototype.constructor = subType; // 增强对象
	subType.prototype = prototype // 指定对象
}
```

> 小结

> > ECMAscript 支持面向对象(OO)编程，但不适用类或者接口，对象可以在代码执行过程中创建和增强，因此鞠永动态性而非严格定义的实体.可以采用以下模式创建对象

> > > 工厂模式：使用简单的函数创建对象，为对象添加属性和方法，但是工厂函数会重复地定义属性和方法，无法做到复用

> > > 构造函数模式：可以创建自定义的引用类型，可以向创建内置对象实例一样使用 new 操作符。缺点：每个成员无法得到复用，由于函数可以不局限于任何对象(即于对象具有松散耦合的特点)，因此没有理由不在多个对象间共享函数

> > > 原型继承：使用构造函数的 prototype 属性来指定那些应该共享的属性和方法。组合使用构造函数模式和原型模式是，使用构造函数定义实例属性，而使用原型定义共享的属性和方法

> > JavaScript 主要通过原型链实现继承。原型链的构建是通过将一个类型的实例赋值给另一个构造函数的原型实现的。原型链的问题是对象实例共享所有继承的属性和方法，因此不适合单独使用。解决这个问题的技术是借用构造函数，即在字类型构造函数的内部调用超类型的构造函数，这样就可以做到每个实例都具有自己的属性，同时还能保证只使用构造函数模式来定义类型。使用最多的是继承模式是组合继承。 ---- 使用原型链继承共享的属性和方法，通过借用构造函数继承实例属性

> > 其他的继承方式

> > > 原型式继承：执行对给定对象的浅复制，而复杂得到的副本还可以进一步改造 ---- ECMAscript5 de Object.create()方法进一步规范化

> > > 寄生式继承：基于某个对象或者其他信息创建一个对象，然后增强对象，最后返回对象。但是这种模式需要多次调用超类型构造函数，导致效率低下，可以将寄生式继承与组合继承一起使用

> > > 寄生组合式继承：将寄生式继承与组合继承合二为一。是实现基于类型继承的最有效方法
