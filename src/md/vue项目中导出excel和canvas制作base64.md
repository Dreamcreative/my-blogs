---
title: vue项目中导出excel和canvas制作base64
date: 2018-09-13 18:48:05
tags:
---
## 导出excel 文件
!["export1.png"]( /images/export1.png )
!["export2.png"]( /images/export2.png )

## canvas 制作 base64格式 图片
### html 
canvas标签进行隐藏
```
<canvas id="canvas" style="display:none"></canvas>
```
### js
```
let canvas=document.getElementById("canvas"),//获取canvas
        ctx = canvas.getContext("2d"), //对应的CanvasRenderingContext2D对象(画笔)
        img = new Image(),//创建新的图片对象
        url = this.picAddBase( picUrl ) ,
        index = url.lastIndexOf("/")  ,
        base64 = '' ;//base64 
    canvas.width = 600;
    canvas.height = 600 ;
    console.log( picUrl)
    img.setAttribute("crossOrigin",'anonymous'); //解决 canvas 跨域问题
    //"http://resource.guaishoubobo.com/public/resource/20180515/5afa42cab3b88.png" ;
    img.src = this.picAddBase( picUrl ) ; //测试服 图片跨域 
    //picAddBase() 处理 图片路径，将相对路径变为图片绝对路径
    img.onload = function(){//图片加载完，再draw 和 toDataURL
        ctx.drawImage(img,0,0 ,canvas.width , canvas.height);    
        base64 = canvas.toDataURL("image/png"); 
        /**下载利用了a标签的 download属性  
        *但是 download 只能下载同源的资源, 所以需要先将图片转换未base64格式
        *base64 没有同源限制
        */
        let a = document.createElement('a');
        a.download = url.slice(index+1).split(".")[0]; // 下载的图片 名称
        a.href = base64 ;
        a.click() ;
    };
```