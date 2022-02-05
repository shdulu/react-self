import React from "../react";

let ThemeContext = React.createContext();
class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      color: "red",
    };
  }
  changeColor = (color) => {
    this.setState({
      color,
    });
  };
  render() {
    let contextVal = { changeColor: this.changeColor, color: this.state.color };
    return (
      <ThemeContext.Provider value={contextVal}>
        <div
          style={{
            margin: "5px",
            padding: "5px",
            border: `5px solid ${this.state.color}`,
            width: "300px",
          }}
        >
          this is Page
          <Header></Header>
          <Content></Content>
        </div>
      </ThemeContext.Provider>
    );
  }
}
export default Page;

class Content extends React.Component {
  render() {
    return (
      <ThemeContext.Consumer>
        {(value) => (
          <div
            style={{
              margin: "5px",
              padding: "5px",
              border: `5px solid ${value.color}`,
            }}
          >
            Content
            <button onClick={() => value.changeColor("red")}>变红</button>
            <button onClick={() => value.changeColor("green")}>变绿</button>
          </div>
        )}
      </ThemeContext.Consumer>
    );
  }
}

class Header extends React.Component {
  static contextType = ThemeContext;
  render() {
    return (
      <div
        style={{
          margin: "5px",
          padding: "5px",
          border: `5px solid ${this.context.color}`,
        }}
      >
        Header
        <Title></Title>
      </div>
    );
  }
}

class Title extends React.Component {
  render() {
    return (
      <ThemeContext.Consumer>
        {(value) => (
          <div
            style={{
              margin: "5px",
              padding: "5px",
              border: `5px solid ${value.color}`,
            }}
          >
            Title
          </div>
        )}
      </ThemeContext.Consumer>
    );
  }
}
