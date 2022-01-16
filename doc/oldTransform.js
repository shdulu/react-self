const babel = require("@babel/core");
const sourceCode = `<h1 id="title" key="title" ref="title">hello</h1>`;
const result = babel.transform(sourceCode, {
  plugins: [["@babel/plugin-transform-react-jsx", { runtime: "classic" }]],
});

const result1 = babel.transform(sourceCode, {
  // 新转换方式
  plugins: [["@babel/plugin-transform-react-jsx", { runtime: "automatic" }]],
});

console.log(result.code);
console.log(result1.code);
