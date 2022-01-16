import React from "react";
import ReactDOM from "react-dom";

/**
 * 元素是react虚拟dom元素
 * 其实就是一个普通的js对象，描述了界面上view的内容
 *
 * jsx 编译成createElement 是在webpack编译的时候，也就是打包的时候执行
 * 打包后的代码在浏览器里执行，会执行函数
 */
const ele = (
  <h1 id="title" style={{ color: "red" }}>
    this is h1 <span>this is span</span>
  </h1>
);

React.createElement(
  "h1",
  {
    id: "title",
    style: {
      color: "red",
    },
  },
  "this is h1 ",
  /*#__PURE__*/ React.createElement("span", null, "this is span")
);
const ele1 = React.createElement(
  "h2",
  { id: "title", style: { color: "red", children: [] } },
  "this is h2"
);
console.dir(ele, {depth: 0})
console.dir(ele1, {depth: 0})

ReactDOM.render(ele, document.getElementById("root"));
