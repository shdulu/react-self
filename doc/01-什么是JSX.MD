# 什么是 JSX

- 是一种 JS 和 HTML 混合的语法，将组件的结构、数据甚至样式都聚合在一起的写法

## 什么是元素

- JSX 其实只是一种语法糖，最终会通过 babel 转译成 `React.createElement` 语法
- `React.createElement` 会返回一个 **React 元素**
- React 元素事实上是普通的 JS 对象，用来描述你在屏幕上看到的内容
- `ReactDOM` 来确保浏览器中真实 DOM 数据和 React 元素保持一致

```jsx
<h1 className="title" style={{ color: "red" }}>
  hello
</h1>
```

```js
// babel 转译后的代码
React.createElement(
  "h1",
  {
    className: "title",
    style: {
      color: "red",
    },
  },
  "hello"
);
```
