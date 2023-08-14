import React from "react";
// import ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";

import OldBatchUpdatePage from "./routes/OldBatchUpdatePage.jsx";
import NewBatchUpdatePage from "./routes/NewBatchUpdatePage.jsx";

// import ReactDOM, { createRoot } from "react-dom";

const element = <NewBatchUpdatePage />;

// legacy模式ReactDOM.renders会同步渲染
// ReactDOM.render(element, document.getElementById("root"));
// createRoot会启用concurrent并发模式
createRoot(document.getElementById("root")!).render(element);
