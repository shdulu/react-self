import React from "../react";
class ChildCounter extends React.Component {
  constructor(props) {
    super(props)
    console.log("ChildCounter 1.constructor");
  }
  componentWillReceiveProps(newProps) {
    console.log("ChildCounter 5.componentWillReceiveProps");
  }
  componentWillMount() {
    console.log("ChildCounter 2.componentWillMount");
  }
  render() {
    console.log("ChildCounter 3.render");
    return (
      <div>
        this is ChildCounter
        <p>count: {this.props.count}</p>
      </div>
    );
  }
  componentDidMount() {
    // 子组件 componentDidMount > 父组件 componentDidMount
    console.log("ChildCounter 4.componentDidMount");
  }
  shouldComponentUpdate(nextProps, nextState) {
    console.log("ChildCounter 6.shouldComponentUpdate");
    return nextState.count % 3 === 0; // 3的倍数更新
  }
  componentWillUnmount() {
    console.log("ChildCounter 7.componentWillUnmount");
  }
}

export default ChildCounter;
