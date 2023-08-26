import { useLayoutEffect, useState, useRef } from "react";
const useDrag = () => {
  // DOM 元素属性
  const nodeStyleProps = useRef({
    currentX: 0, // 当前元素的x轴位置
    currentY: 0, // 当前元素的Y轴位置
    lastX: 0,
    lastY: 0,
    zIndex: 0,
  });
  // 要移动的DOM元素
  const moveElement = useRef(null);
  const [, forceUpdate] = useState({});

  // DOM插入之后，UI渲染之前执行。当前宏任务中的微任务列表中
  useLayoutEffect(() => {
    let startX: number, startY: number;
    const start = function (event: TouchEvent) {
      const { clientX, clientY } = event.targetTouches[0];
      startX = clientX;
      startY = clientY;
      nodeStyleProps.current.zIndex = 9999;
      (moveElement.current as unknown as HTMLDivElement)?.addEventListener(
        "touchmove",
        move
      );
      (moveElement.current as unknown as HTMLDivElement)?.addEventListener(
        "touchend",
        end
      );
    };
    const move = function (event: TouchEvent) {
      const { clientX, clientY } = event.targetTouches[0];
      nodeStyleProps.current.currentX =
        nodeStyleProps.current.lastX + (clientX - startX);
      nodeStyleProps.current.currentY =
        nodeStyleProps.current.lastY + (clientY - startY);
      forceUpdate({}); // 调用useState 刷新
    };
    const end = () => {
      nodeStyleProps.current.lastX = nodeStyleProps.current.currentX;
      nodeStyleProps.current.lastY = nodeStyleProps.current.currentY;
      nodeStyleProps.current.zIndex = 0;
      (moveElement.current as unknown as HTMLDivElement)?.removeEventListener(
        "touchmove",
        move
      );
      (moveElement.current as unknown as HTMLDivElement)?.removeEventListener(
        "touchend",
        end
      );
    };
    (moveElement.current as unknown as HTMLDivElement)?.addEventListener(
      "touchstart",
      start
    );
  }, []);

  return [
    {
      x: nodeStyleProps.current.currentX,
      y: nodeStyleProps.current.currentY,
      zIndex: nodeStyleProps.current.zIndex,
    },
    moveElement,
  ];
};

export default useDrag;
