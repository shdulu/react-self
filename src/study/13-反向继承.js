import React from "../react";

/**
 * 高阶组件可以反向继承
 * 一般来说子组件继承父组件，这个叫正向继承
 * 假如说你使用一个第三方库，源代码无法修改，但又想扩展其功能
 *
 * 属性代理的时候，返回一个新组件，新组件会渲染老组件，
 * 在这个反向继承当前，我们返回一个新组件，新组件继承自老组件的，只有一个组件
 * 
 * 可以拦截生命周期 和渲染的过程
 * 
 * @extends {React.Component}
 */

class Button extends React.Component {
  state = { name: "张三" };
  render() {
    console.log("Button render");
    return <button name={this.state.name}>{this.props.title}</button>;
  }
}
const wrapper = (OldComponent) => {
  return class extends OldComponent {
    state = { number: 0 };
    handleClick = () => {
      this.setState({
        number: this.state.number + 1,
      });
    };
    render() {
      console.log("wrapper render");
      let renderElement = super.render();
      let newProps = {
        ...renderElement.props,
        onClick: this.handleClick,
      };
      return React.cloneElement(renderElement, newProps, this.state.number);
    }
  };
};
let WrapperButton = wrapper(Button);
export default WrapperButton;
