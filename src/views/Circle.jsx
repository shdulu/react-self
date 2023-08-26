import React from "react";
import useAnimation from "../../achieve/hooks/useAnimation";
import "./Circle.css";
const Circle = () => {
  const [className, start] = useAnimation("circle", "active");
  return <div className={className} onClick={start}></div>;
};
export default Circle;
