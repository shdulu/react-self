import React from "../react";

function Child(props, forwardRef) {
  let inputRef = React.useRef(); 
  // 命令式ref，可以自定义向外暴露使用对象
  // 更安全的使用方式- 保护函数内聚性
  React.useImperativeHandle(forwardRef, () => ({
    focus() {
      inputRef.current.focus()
    }
  }))
  return <input ref={inputRef} />;
}

let ForwardRefChild = React.forwardRef(Child);
function Parent() {
  let childRef = React.useRef();
  const getFocus = () => {
    childRef.current.focus();
  };
  return (
    <div>
      <ForwardRefChild ref={childRef} />
      <button onClick={getFocus}>获得焦点</button>
    </div>
  );
}

export default Parent;
