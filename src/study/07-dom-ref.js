import React from "../react";

export default class Sum extends React.Component {
  constructor(props) {
    super(props);
    this.a = React.createRef();
    this.b = React.createRef();
    this.result = React.createRef();
  }
  handleAdd = (event) => {
    debugger
    let valueA = this.a.current.value
    let valueB = this.b.current.value
    this.result.current.value = valueA + valueB
  };
  render() {
    return (
      <div>
        <input ref={this.a} /> + <input ref={this.b} />
        <button onClick={this.handleAdd}>=</button>
        <input ref={this.result} />
      </div>
    );
  }
}
