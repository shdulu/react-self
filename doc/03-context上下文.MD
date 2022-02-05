# Context 上下文

- 在某些场景下，你想在整个组件树中传递数据，但却不想手动每一层传递属性。你可以直接在 React 中使用强大的 contextAPI 解决上述问题。
- 在一个典型的 React 应用中，数据都是通过 props 属性自上而下（由父及子）进行传递的，但这种做法对于某些类型的属性而言是及其繁琐的，这些属性是应用程序中很多组件都需要的，Context 提供了一种在组件之间共享此类值的方式，而不必显式的通过组件树的逐层传递 props

```js
// React.createContext 返回 _context
let _context = {
  $$typeof: Symbol(react.context),
  Consumer: {
    $$typeof: Symbol(react.context),
    _context,
  },
  Provider: {
    $$typeof: Symbol(react.provider),
    _context,
  },
  _currentValue: {
    color: "red",
    changeColor,
  },
};
// context.Consumer._context = _context;
// context.Provider._context = _context;
```
