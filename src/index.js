import ReactDOM from "./react/react-dom";
import React from "./react";

// import ReactDOM from "react-dom";
// import React from "react";

import App from "./study/17-createPortal";

// 把虚拟DOM 变成真实DOM并插入到 root
ReactDOM.render(<App title="按钮的标题" />, document.getElementById("root"));
