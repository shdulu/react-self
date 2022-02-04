import React from "../react";
class ChildCounter extends React.Component {
  constructor(props) {
    super(props)
    this.state= {
      number: 0
    }
    console.log("ChildCounter 1.constructor");
  }
  static getDerivedStateFromProps(nextProps, nextState) {
    const { count } = nextProps;
    if (count % 2 === 0) {
      return { number: count * 2 };
    } else {
      return { number: count * 3 };
    }
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
        <p>number: {this.state.number}</p>
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
