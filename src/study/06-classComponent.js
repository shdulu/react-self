import React from "../react";
// 类组件
class ClassComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { number: 0 };
  }
  handleClick = (event) => {
    console.log(event)
    this.setState({
      number: this.state.number + 1,
    });
    console.log(this.state.number);
    this.setState({
      number: this.state.number + 1,
    });
    console.log(this.state.number);
    setTimeout(() => {
      this.setState({
        number: this.state.number + 1,
      });
      console.log(this.state.number);
      this.setState({
        number: this.state.number + 1,
      });
      console.log(this.state.number);
    });
  };
  handlePClick = () => {
    console.log('handlePClick........')
  }
  render() {
    return (
      <div className="title" style={{ color: "red" }} onClick={this.handlePClick}>
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

export default ele3