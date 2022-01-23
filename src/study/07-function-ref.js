import React from "../react";

export default class Form extends React.Component {
  constructor(props) {
    super(props);
    this.input = React.createRef();
  }
  getFocus = () => {
    this.input.current.focus();
  };
  render() {
    return (
      <div>
        <ForwarderTextInput ref={this.input} />
        <button onClick={this.getFocus}>获得焦点</button>
      </div>
    );
  }
}

function TextInput(props, ref) {
  return <input ref={ref} />;
}
const ForwarderTextInput = React.forwardRef(TextInput);
