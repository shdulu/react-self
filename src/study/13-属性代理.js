import React from "../react";

/**
 * 高阶组件可以实现属性代理，给组件添加额外的属性，以实现特定的逻辑，可以实现逻辑的复用
 *
 * @param {*} OldComponent
 * @return {*}
 */
const withLoading = (OldComponent) => {
  return class extends React.Component {
    render() {
      let state = {
        show() {
          console.log("show");
        },
        hide() {
          console.log("hide");
        },
      };
      return <OldComponent {...this.props} {...state}></OldComponent>;
    }
  };
};
@withLoading
class Hello extends React.Component {
  render() {
    console.log(this.props)
    return (
      <div>
        <p>this is Hello {this.props.title}</p>
        <button onClick={this.props.show}>显示</button>
        <button onClick={this.props.hide}>隐藏</button>
      </div>
    );
  }
}
// let LoadingHello = withLoading(Hello);
export default Hello;
