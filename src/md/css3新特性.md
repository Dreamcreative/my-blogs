---
title: css3新特性
date: 2018-01-02 17:27:44
tags: css3新特性
---
1.过渡 2.动画 3.形状转变（transition） 4. 选择器  5.阴影 6. 边框 border-image   border-radius 
7.背景 background-clip  background-origin  background-size  8. 反射  9 文字 （换行  省略号   文字阴影）
10 颜色 （rgba  hsla） 11 渐变（gradient） 12 filter   13  弹性布局  14 栅格布局 15 多列布局  16 盒模型定义（box-sizing）
17媒体查询  @media   18  混合模式  


1. 过渡  兼容   ie10   firefox chrome safari  opera
``` bash
transition  : transition-property  transition-duration transition-timing-function transition-delay 
//过渡的css属性  过渡效果需要的时间  过渡效果的速度曲线  过渡效果何时开始

transition-timing-function : linear / ease  /ease-in / ease-out / ease-in-out / cubic-bezier(n,n,n,n)  n [0,1]
匀速 / 慢速开始，变快 ，慢速结束 / 慢速开始 / 慢速结束 / 慢速开始，慢速结束 /  

``` 
cubic-bezier (贝塞尔 曲线 )

2. 动画   兼容   ie10   firefox chrome safari  opera
``` bash
animation ：name  duration  timing-function delay  iteration-count  direction  ;

//绑定的keyframe 名称 /
``` 

3 形状转换
transform：rotate( deg );


4.选择器


5 阴影
以前没有c3的时候，或者需要兼容低版本浏览器的时候，阴影只能用图片实现 ，现在则使用c3提供
``` bash
box-shadow
``` 
6 边框
1.边框图片
``` bash
border-image
``` 
2.边框圆角
``` bash
border-radius
``` 
7 背景
``` bash
background-clip
background-origin
``` 
8 反射 （倒影）
``` bash
-webkit-box-reflect:方向[ above-上 | below-下 | right-右 | left-左 ]，偏移量，遮罩图片
``` 
9 文字
``` bash
word-break : normal  | break-all || keep-all 
使用浏览器默认换行  || 只能在空格或连字符处换行 || 允许在单词内换行
超出部分出现省略号 
text-overflow : ellipsis | clip  |  string 
出现省略号 | 直接剪切 |  直接剪切 （只兼容firefox）
width: 200px;
overflow:hidden ;
white-space: nowrap ;

多行超出省略号
width: 200px;
overflow:hidden ;
text-overflow : ellipsis ;
display: -webkit-box ;
-webkit-line-clamp:2;
-webkit-box-orient :vertical;

w文字阴影 
text-shadow : 水平阴影，垂直阴影，模糊的距离，以及阴影的颜色 
x  y  inset  color ;
``` 
10 颜色 
rgba( 255,255,255 , 0~1)   rgb 为颜色值 ，a为透明度
hsla () h 色相  s  饱和度  l 高度 a 透明度

11渐变 
``` bash
gradient 
-moz-linear-gradient( top , start-color [, color ,color] , end-color );
-webkit-gradient(  speed , start point , end point , from (color ) , to ( color ))
-o-linear-gradient( start point , start - color ,end-color) ; 
``` 
ie 下的渐变靠滤镜实现渐变 ，

13弹性布局 
``` bash
display : flex ;
display : -webkit-flex ;
``` 





 