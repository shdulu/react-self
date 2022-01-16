// 为了更方便进行虚拟Dom的对比，我们把虚拟dom进行一下包装
// 需要把字符串或者数字也变成一个对象
import { REACT_TEXT, REACT_ELEMENT } from "./constants";
export function wrapToVdom(element) {
  return typeof element === "string" || typeof element === "number"
    ? {
        $$typeof: REACT_ELEMENT,
        type: REACT_TEXT,
        props: {
          content: element,
        },
      }
    : element;
}
