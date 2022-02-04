import React from "../react";
import ChildCounter from "./ChildCounter";
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { number: 0 };
    console.log("constructor......", 1);
  }
  
  componentWillMount() {
    console.log("componentWillMount......", 2);
  }
  componentDidMount() {
    console.log("componentDidMount......", 4);
  }
  handleClick = () => {
    this.setState({
      number: this.state.number + 1,
    });
  };
  shouldComponentUpdate(nextProps, nextState) {
    console.log("shouldComponentUpdate......", 5);
    // 不管返回true还是false， this.state 都会个改变
    return nextState.number % 2 === 0; // 奇数不更新，偶数更新，
  }
  componentWillUpdate() {
    console.log("componentWillUpdate......", 6);
  }
  componentDidUpdate() {
    console.log("componentDidUpdate......", 7);
  }
  render() {
    console.log("render......", 3);
    return (
      <div>
        <p>{this.state.number}</p>
        {this.state.number === 4 ? null : (
          <ChildCounter count={this.state.number}></ChildCounter>
        )}
        <button onClick={this.handleClick}>+</button>
      </div>
    );
  }
}

export default Counter;
