import React from "react";
import useDrag from "../../achieve/hooks/useDrag";
const style = {
  width: "100px",
  height: "100px",
  borderRadius: "50%",
  position: "relative",
};
const Drag = () => {
  const [style1, dragRef1] = useDrag();
  const [style2, dragRef2] = useDrag();
  return (
    <>
      <div
        ref={dragRef1}
        style={{
          ...style,
          backgroundColor: "red",
          transform: `translate(${style1.x}px, ${style1.y}px)`,
          zIndex: style1.zIndex,
        }}
      ></div>
      <div
        ref={dragRef2}
        style={{
          ...style,
          backgroundColor: "green",
          transform: `translate(${style2.x}px, ${style2.y}px)`,
          zIndex: style2.zIndex,
        }}
      ></div>
    </>
  );
};
export default Drag;
