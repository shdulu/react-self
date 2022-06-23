// import ReactDOM from "./react/react-dom";
// import React from "./react";

import ReactDOM from "react-dom";
import React from "react";
// import { HashRouter as Router, Route } from "react-router-dom";
// import Home from "./components/Home";
// import User from "./components/User";

// 把虚拟DOM 变成真实DOM并插入到 root
// ReactDOM.render(
//   <Router>
//     <Route path="/" component={Home}></Route>
//     <Route path="/user" component={User}></Route>
//   </Router>,
//   document.getElementById("root")
// );

import App from "./study/23.useImperativeHandle";
ReactDOM.render(<App />, document.getElementById("root"));
