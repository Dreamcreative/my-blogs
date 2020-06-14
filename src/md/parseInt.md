---
title: 原始js实现 parseInt
date: 2019-04-02 17:27:44
tags: 原始js实现 parseInt
---

## 原生 js 实现 parseInt
``` bash
function _parseInt( string , radix){
            // _parseInt 第一个参数只接受 string 和 number 类型 , 否则 返回NaN
            // 
        if( typeof string != "string" && typeof string!="number" ) return NaN ; 
        /***
            如果第一个参数不存在 则返回 NaN
        **/
        if( !string ) return NaN ;
        /***
            * 第二个参数 radix 存在  但是如果 
            * 1 。 radix 不为 number 类型 
            * 2. radix 是 小数  /^[1-9]\d*\.|0\.\d*[1-9]\d*$/ 判断小数的正则
            * 3. radix >36 
            * 4. radix <2
            * 返回 NaN
            * 所以 _parseInt 只接受 2-36 的整数数值
        */
        if( radix && (typeof radix !=="number" || /^[1-9]\d*\.|0\.\d*[1-9]\d*$/.test(radix) || radix>36 || radix<2)) return NaN ;
        /**
            将 第一个参数 转为 字符串 
            用 String() 而不用 toString()
            因为 toString() 是Object 的内置方法 ,而 null 和 undefined 没有
            所以 toString()遇到 null和 undefined 会报错
            而 String() 是任何值都有的方法 
        **/
        string = String( string );
        var reg = (radix ==10)?/(-?)([0]?)([0-9]+)/:/(-?)([0]?[Xx]?)([0-9a-fA-F]+)/ ;
        //   /(-?)([0]?)([0-9]+)/ : /(-?)([0]?[Xx]?)([0-9a-fA-F]+)/
        /**
            a 返回值形式 
                [ 
                    string ,
                    reg匹配到的第一个组 即 (-?) 匹配到的值 ,
                    reg匹配到的第二个组 即 ([0]?) 匹配到的值 ,
                    reg匹配到的第三个组 即 ([1-9]+) 匹配到的值 ,
                ]
        **/
        var a= string.match(reg); 
        var sign = a[1] ; // 正负值 标识
        var rawRadix = a[2]; // 原始基数
        var rawNum = a[3] ; //原始 数字
        var result = 0;
        var strArr = rawNum.split("");
        var len = strArr.length ;
        var numArr = [];
        if(a && !radix){
            /***
                如果 没有 传入radix 
                则 只能通过 传入的 第一个参数 的形式来判断 radix 
                0X 开头 表示16 进制
                0 开头  表示 8 进制 
                否则 则 使用10进制
            **/
            radix = rawRadix.toUpperCase()==="0X" ?16 : rawRadix==="0"? 8 :10 ;
        }
        for( var i =0 ;i<len ;i++){
            var num ;
            var charCode = strArr[i].toUpperCase().charCodeAt(0);
            if( radix<=36 && radix>=11 ){
                if(charCode>=65 && charCode <=90 ){
                    num = charCode -55;
                }else{
                    num = charCode -48;
                }
            }else{
                num = charCode -48;
            }
            if( num < radix ){
                numArr.push(num);
            }else{
                return NaN ;
            }
        }
        if( numArr.length >0 ){
            result = numArr.reduce((total, cur , index ,self )=>{
                total += cur*Math.pow( radix , numArr.length-index-1) ;
                return total ;
            } , 0 )
        }
        if( sign =="-"){
            //如果是负数  加上负号
            result = -result ;
        }
        return result ;
    }

    // 以下例子均返回15:
    console.log(_parseInt("F", 16));
    console.log(_parseInt("17", 8));
    console.log(_parseInt("15", 10));
    console.log(_parseInt(15.99, 10));
    console.log(_parseInt("FXX123", 16));
    console.log(_parseInt("1111", 2));
    console.log(_parseInt("15*3", 10));
    console.log(_parseInt("12", 13));

    // 以下例子均返回 NaN:
    console.log(_parseInt("Hello", 8)); // Not a number at all
    console.log(_parseInt("546", 2));   // Digits are not valid for binary representations

    // 以下例子均返回 -15：
    console.log(_parseInt("-F", 16));
    console.log(_parseInt("-0F", 16));
    console.log(_parseInt("-0XF", 16));
    console.log(_parseInt(-15.1, 10));
    console.log(_parseInt(" -17", 8));
    console.log(_parseInt(" -15", 10));
    console.log(_parseInt("-1111", 2));
    console.log(_parseInt("-15e1", 10));
    console.log(_parseInt("-12", 13));
    // 下例中也全部返回 17，因为输入的 string 参数以 "0x" 开头时作为十六进制数字解释，而第二个参数假如经过 Number 函数转换后为 0 或 NaN，则将会忽略。
    console.log(_parseInt("0x11", 16));
    console.log(_parseInt("0x11", 0));
    console.log(_parseInt("0x11"));

    // 下面的例子返回 224
    console.log(_parseInt("0e0",16));
}
``` 

[参考地址](https://blog.csdn.net/general_roc/article/details/79299973)