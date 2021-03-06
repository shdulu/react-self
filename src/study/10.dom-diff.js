import React from "../react";
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: ["A", "B", "C", "D", "E", "F"],
    };
  }
  handleClick = () => {
    this.setState({
      list: ["A", "C", "E", "B", "G"]
    })
  }
  render() {
    return (
      <div>
        <ul>
          {this.state.list.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <button onClick={this.handleClick}>+</button>
      </div>
    );
  }
}

export default Counter;
