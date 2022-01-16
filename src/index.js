import ReactDOM from "react-dom";
import React from "./react";
// import React from "react";

/**
 * 元素是react虚拟dom元素
 * 其实就是一个普通的js对象，描述了界面上view的内容
 *
 * jsx 编译成createElement 是在webpack编译的时候，也就是打包的时候执行
 * 打包后的代码在浏览器里执行，会执行函数
 */
const ele1 = React.createElement(
  "h2",
  { className: "title", style: { color: "red" } },
  "this is h2",
  React.createElement("span", null, "this is span")
);
// console.dir(ele, {depth: 0})
console.log(ele1);

// ReactDOM.render(ele1, document.getElementById("root"));
