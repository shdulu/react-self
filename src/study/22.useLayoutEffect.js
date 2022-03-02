import React from "../react";
function Animation() {
  const ref = React.useRef();
  React.useEffect(() => {
    // 使用useEffect 能看到明显的动画 useEffect宏任务在下次渲染之后执行
    // 使用useLayoutEffect 看不到动画， useLayoutEffect在微任务队列
    // 
    ref.current.style.transform = `translate(500px)`;
    ref.current.style.transition = `all 500ms`;
  });
  let style = {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    backgroundColor: "red",
  };
  return <div style={style} ref={ref}></div>;
}
export default Animation;
