const express = require("express");
const cors = require("cors");
const logger = require("morgan");

const app = express();

app.use(cors());
app.use(logger("dev"));

//http:localhost:8000/api/users?currentPage=1&pageSize=5
app.get("/api/users", (req, res) => {
  let currentPage = parseInt(req.query.currentPage);
  const pageSize = parseInt(req.query.pageSize);
  const total = 25;
  let list = [];
  let offset = (currentPage - 1) * pageSize;
  for (let i = offset; i < offset + pageSize; i++) {
    list.push({
      id: i + 1,
      name: "name" + (i + 1),
    });
  }
  res.json({
    currentPage,
    pageSize,
    list,
    totalPage: Math.ceil(total / pageSize),
  });
});

app.listen(8000, () => {
  console.log("服务已经在8000端口启动了！");
});
