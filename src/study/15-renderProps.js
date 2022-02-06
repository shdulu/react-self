import React from "../react";

function withMouseTracker(OldComponent) {
  console.log('09899321938921')
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = { x: 0, y: 0 };
    }
    handleMouseMove = (event) => {
      console.log('0000000000000000000')
      this.setState({
        x: event.clientX,
        y: event.clientY,
      });
    };
    render() {
      return (
        <div onMouseMove={this.handleMouseMove}>
          <OldComponent {...this.state}></OldComponent>
        </div>
      );
    }
  };
}

function Show(props) {
  return (
    <div>
      <h1>请移动鼠标</h1>
      <p>
        当前的鼠标位置是 {props.x} {props.y}
      </p>
    </div>
  );
}
const MouseTracker = withMouseTracker(Show);
export default MouseTracker;
