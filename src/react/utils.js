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

export function shallowEqual(obj1, obj2) {
  // 如果地址一样就认为相等
  if (obj1 === obj2) {
    return true;
  }
  // 只要任何一个不是对象或者是一个null 那就不相等
  if (
    typeof obj1 !== "object" ||
    obj1 === null ||
    typeof obj2 !== "object" ||
    obj2 === null
  ) {
    return false;
  }
  let keys1 = Object.keys(obj1);
  let keys2 = Object.keys(obj2);
  // 属性数量不相等返回false
  if (keys1.length !== keys2.length) {
    return false;
  }

  for (let key of keys1) {
    if (!obj2.hasOwnProperty(key) || obj1[key] !== obj2[key]) {
      return false;
    }
  }
  return true;
}
