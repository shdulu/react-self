import React from "../react";

export default class Form extends React.Component {
  constructor(props) {
    super(props);
    this.input = React.createRef();
  }
  getFocus = () => {
    // this.input.current 类的实例
    this.input.current.getFocus()
  };
  render() {
    return (
      <div>
        <TextInput ref={this.input} />
        <button onClick={this.getFocus}>获得焦点</button>
      </div>
    );
  }
}

class TextInput extends React.Component {
  constructor(props) {
    super(props);
    this.input = React.createRef();
  }
  getFocus = () => {
    this.input.current.focus();
  };
  render() {
    return <input ref={this.input} placeholder="请输入内容" />;
  }
}
