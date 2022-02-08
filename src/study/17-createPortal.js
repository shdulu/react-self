import React from "../react";
import ReactDOM from "../react/react-dom";
class Dialog extends React.Component {
  constructor(props) {
    super(props);
    this.dom = document.createElement("div");
    document.body.appendChild(this.dom);
  }
  render() {
    return ReactDOM.createPortal(
      <div className="dialog">{this.props.message}</div>,
      this.dom
    );
  }
}
class App extends React.Component {
  render() {
    return <Dialog message="this is dialog"></Dialog>;
  }
}

export default App;
