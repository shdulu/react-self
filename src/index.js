import ReactDOM from "./react/react-dom";
import React from "./react";
// import React from "react";
// import ReactDOM from "react-dom";

/**
 * 元素是react虚拟dom元素
 * 其实就是一个普通的js对象，描述了界面上view的内容
 *
 * jsx 编译成createElement 是在webpack编译的时候，也就是打包的时候执行
 * 打包后的代码在浏览器里执行，会执行函数
 */
// const ele1 = React.createElement(
//   "h2",
//   { className: "title", style: { color: "red" } },
//   "this is h2",
//   React.createElement("p", { style: { color: "green" } }, "this is p")
// );
// console.log(ele1);

/**
 * 函数组件是一个普通的函数
 * 1. 接收一个props属性对象作为参数，且仅能返回一个React元素
 * 2. 组件名称首字符必须大写， React通过首字符是否大写来判断是否为原生DOM节点
 * 3. 组件需要先定义在使用
 * @param {*} props
 * @return {*}
 */
function FunctionComponent(props) {
  // return React.createElement('div', {}, '999999')
  return (
    <div className="title" style={{ color: "red" }}>
      {props.name} Hello world!
    </div>
  );
}
const ele2 = <FunctionComponent name="shdulu"></FunctionComponent>;
console.log("ele2", ele2);

// 类组件
class ClassComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { number: 0 };
  }
  handleClick = () => {
    this.setState({
      number: this.state.number + 1,
    });
    this.setState((state) => ({ number: state.number + 1 }));
    console.log(this.state.number);
    this.setState({
      number: this.state.number + 1,
    });
    console.log(this.state.number);
  };
  render() {
    return (
      <div className="title" style={{ color: "red" }}>
        hello
        <p style={{ fontSize: "20px", color: "green" }}>{this.props.name}</p>
        <hr />
        <button onClick={this.handleClick}>+1</button>
        <p>number：{this.state.number}</p>
      </div>
    );
  }
}
const ele3 = <ClassComponent name="class-com" />;

// 把虚拟DOM 变成真实DOM并插入到 root
ReactDOM.render(ele3, document.getElementById("root"));
