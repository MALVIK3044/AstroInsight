// function a()
// {
//     console.log("hii")
// }
// a() calling

// function a(y,f) //formal
// {
//     console.log(y+"->"+f)
// }
// a(5,6) //actual

// function a()
// {
//     console.log(arguments.length)
//     console.log(arguments[0])
// }
// a(5,6,7)

// let arr()=>
// {
//     console.log("hii")

// }
// arr()

// function a()
// {
//     console.log("a")
// }
// function b(fun1)
// {
//     console.log("b")
//     fun1()
// }
// b(a)

// (
// function a()
// {
//     let a=b=20;
//     console.log("ab")
// }
// )()
// console.log(b)

// function a()
// {
//     let fruits="apple";
//     return function b()
//     {
//     let fruits="lemon"
//     console.log(fruits)
//     }
// }
// let b=a()
// b()

// function ab()
// {
//     console.log("hii")
//     b()
// }

// let arr=[1,2,3,4,2,1,4,5,4];
// let map=new Map()

// for (let i=0;i<arr.length;i++)
// {
//     if(map.has(arr[i]))
//     {
//         map.set(arr[i],map.get(arr[i])+1);
//     }
//     else
//     {
//         map.set(arr[i],1);
//     }
// }  
 
// let arr= [5,5,1,2,3,121];
// arr.sort()
// console.log(arr);

// function asc(a,b)
// {
//     return a-b
// }
// arr.sort(asc)
// console.log(arr);\

// let div=document.createElement("div");
// let p=document.createElement("p");
// p.setAttribute("id","para");
// p.innerText="Hello World"
// console.log(div,p)
//  let data1=document.getElementById("main");
//  let data2=document.getElementsByClassName("container");
//  let data3=document.querySelector("#main");
//  let data4=document.getElementsByTagName("div")
//  let data5=document.getElementsByName("divtag");

//  console.log(data1);
//  console.log(data2);
//  console.log(data3);
//  console.log(data4);
//  console.log(data5);

// let data3=document.querySelector("#main");
//  data3.innerText("HelloWorld")    
// data3.textContent="hello"
// for(let i=1;i<=5;i++)
// {
//     let para1=document.createElement("p")
//     para1.textContent
//     data3.appendChild(para1)
// }

// console.log(data3);

// let data=data3.children
// for(let i=0;i<data2.length;i++)
//     {
//         data[i].style.background="red"
//     }

let data3= document.querySelector("#main");

let container =document.createElement("div");
container.setAttribute("id,","container");
container.style.display="flex";
container.style.flexWrap="wrap";
container.style.gap="10px";
container.style.border="2px solid black";
container.style.borderradius="20px";
container.style.padding="20px"

let arr=["red,blue,green,violet,yellow,grey,black"];

for(let i=0;i<0;i++) {
let div =document.createElement("div");
div.style.width="100px";
div.style.height="40px";
div.style.background=arr[Math.floor(Math.random())];
div.style.border="1px solid black";
div.style.borderRadius="10px";
container.appendChild(div);
}

//let arr=["red,blue,green,violet,yellow,grey,black"];