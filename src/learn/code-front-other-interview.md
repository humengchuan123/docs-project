let a = { name:'juli', age: 20};

function change(o) {

o.age = 24;

o={ name: 'kate',age: 30 };

return o;

}

let b = change(a)

console.log(b.age)

console.log(a.age)

请用最优方法输出长度为500的数组内容为：["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "AA", "AB", "AC", "AD", "AE", "AF", "AG", "AH", "AI", "AJ", "AK", "AL", "AM", "AN", "AO", "AP", "AQ", "AR", "AS", "AT", "AU", "AV", "AW", "AX", "AY", "AZ", "BA", "BB", "BC", "BD", "BE", "BF", "BG", "BH", "BI", "BJ", "BK", "BL", "BM", "BN", "BO", "BP", "BQ", "BR", "BS", "BT", "BU", "BV", "BW", "BX", "BY", "BZ", "CA", "CB"........]

// 1.先实习A-Z的数组集合

function generateArrayUpper() {

    let arrGenerate = []

    for (var i = 0; i < 26; i++) {

      var letter = String.fromCharCode(65 + i);

      arrGenerate.push(letter);

    }

    return arrGenerate

};

let arrUpper1 = []

arrUpper1 = generateArrayUpper()

console.log('%c [ arrUpper ]-11', 'font-size:13px; background:pink; color:#bf2c9f;', arrUpper1)

// 2.然后进行遍历组合

let repeatArr = []

for(let i=0; i < arrUpper1.length; i++) {

    for(let j=0; j < arrUpper1.length; j++) {

        repeatArr.push(arrUpper1[i] + arrUpper1[j])

    }

}

console.log('%c [ repeatArr ]-19', 'font-size:13px; background:pink; color:#bf2c9f;', repeatArr)

// 3.输出长度500的数组

let lastOutArr = [...arrUpper1,...repeatArr].slice(0,500)

console.log('%c [ lastOutArr ]-27', 'font-size:13px; background:pink; color:#bf2c9f;', lastOutArr)

JavaScript判断变量类型的几种方式 | typeof | instanceof | constructor | Object.prototype.toString.call()
bind apply call的相同与不同

for in 和 for of的区别

for in可以遍历可枚举的数据（例如：数组，字符串，对象）遍历得到key。for of 可迭代数据（数组，字符串，Set，Map）遍历得到value值。

求数组中的最大值
Math.max(...arr)
Math.max.apply(null, arr)
arr.sort((a,b)=> { return a - b})
arr.reduce((a,b)=>{ return a>b ? a : b })

谈谈闭包和闭包场景应用
触发：函数作为返回值被返回；函数当作参数被传递；自执行函数

应用：隐藏变量；解决for循环等

将一个数组拍平&实现一个拍平方案[1,2,3,[4,5,[6]]]
1.arr.flat() 只解决二维

2.Array.prototype.concat.apply([], arr)

3.解决多维数组 flat(arr) { const hasdeep = arr.some((item) => item instanceof Array) if(!hasdeep) { return arr } const res = Array.prototype.concat.apply([], arr) retrun flat(res) }

盒子模型：网页中元素占网页实际的大小
width+height （box-sizing：border-box） width+height+border+padding(box-sizing: content-box)

BFC
触发条件：display：inline- block｜table-cell｜flex

overflow：hidden

position：fixed｜absolute

作用：解决margin塌陷问题；清除浮动

函数柯粒化
curry（1）（2）（3）（）

sum (args) { return args.reduce( (pre, cur) => pre + cur , 0）} curry(..args) { let sumvalue = sum(args) calc(...newArgs) { if (newArgs.length > 0) ( sumvalue += sum(newArgs) ) } else { return sumvalue} }

描述new关键字1.首先创建了一个空对象，这个对象将会作为执行构造函数之后返回的对象实例。

2.使上面创建的空对象的原型(proto)指向构造函数的prototype属性。

3.将这个空对象赋值给构造函数内部的this，并执行构造函数逻辑。

4.根据构造函数执行逻辑，返回第一步创建的对象或构造函数的显式返回值。

深拷贝
1.json.parse(json.stringify()) 缺点：无法拷贝时间，正则，复杂的对象，函数，null这些会被干掉

2.lodash.deepclone()

3.structuredClone()

4.deepClone(obj) {

    if(typeof obj !== "object" || typeof obj !== "null") {

        return obj

    }

    let resObj = obj instanceof Array ? [] : {}

    for(let key in obj) {

        if(obj.hasOwnProperty(key)) {

            resObj[key] = deepClone(resObj[key])

        }

    }

    return resObj

}

防抖与节流
debounce 区别：一段时间内只执行最后一次 应用场景：优化input输入框

debounce(fn, delay) {

let timer = null

return function () {

if(timer) clearTimeout(timer)

timer = setTimeout(()=>{

fn.call(this, arguments)

}, delay)

}

}

throttle 区别：一段时间内有规律的执行 应用场景：拖拽、scroll滚动优化

throttle(fn, delay) {

let timer = null

return function () {

if(timer) return

timer = setTimeout(()=>{

fn.apply(this, arguments)

timer=null

}, delay)

}

}

手写bind函数
Function.prototype.mybind = function () {

    const fn = this

    let arg = Array.prototype.splice.call(arguments)

    let _this = arg.shift()



    return function () {

       return fn.apply(_this, arg)

    }

}

手写instanceof
function myInstanceof (obj,obj1) {

    let objProto = obj.__proto__

    while(true) {

        if(objProto === null) {

            return false

        }

        if(objProto === obj1.prototype) {

            return true

        }

        objProto = objProto.__proto__

    }

}

// 生成一个随机6位数字和字母组合
const random = (n) =>

Math.random()

    .toString(36)

    .slice(2, 2 + n)

// 迭代器面试题
var [a, b] = {a:1, b: 2}

object.prototype[sybool.iterator] = function () { var arr = Object.values(this); const itme = arr[sybool.iterator](); return itme}

//函数重载

function (obj,name, fn) {

const oldName = obj[name]

obj[name] = function(...args) {

    if(args.length === fn.length) {

      return fn.apply(this, args)

    }else if (typeof oldName === 'function') {

      return oldName.apply(this, args)

    }

}

}

手写promise

class MyPromise {

constructor(executor) {

this.state = "pending"; // 初始状态

this.value = undefined; // 保存异步操作的结果

this.callbacks = []; // 存储成功和失败回调

const resolve = (value) => {

if (this.state === "pending") {

    this.state = "fulfilled"; // 成功状态

    this.value = value;



    this.callbacks.forEach(callback => callback.onFulfilled(value));

}

};

const reject = (reason) => {

if (this.state === "pending") {

    this.state = "rejected"; // 失败状态

    this.value = reason;



    this.callbacks.forEach(callback => callback.onRejected(reason));

}

};

try {

executor(resolve, reject);

} catch (error) {

reject(error);

}

}

then(onFulfilled, onRejected) {

if (this.state === "fulfilled") {

onFulfilled(this.value);

} else if (this.state === "rejected") {

onRejected(this.value);

} else if (this.state === "pending") {

this.callbacks.push({ onFulfilled, onRejected });

}

}

}

iframe清理缓存，每次请求页面都是新的数据

在url地址上加上时间搓。
