import { REACT_ELEMENT } from "./constants";
import { wrapToVdom } from "./utils";
function createElement(type, config, children) {
  let ref, key;
  if(config) {
    ref = config.ref // 用来引用真实DOM元素
    key = config.key // 进行DOM-DIFF 优化，用来唯一标识某个子元素
    delete config.ref
    delete config.key
  }
  let props = { ...config };
  if (arguments.length > 3) {
    // 如果参数的长度大于 3， 多明多个儿子
    props.children = Array.prototype.slice.call(arguments, 2).map(wrapToVdom);
  } else if (arguments.length === 3) {
    props.children = wrapToVdom(children); // 字符串 数字 React元素
  }
  return {
    $$typeof: REACT_ELEMENT, // 元素的类型
    type, // dom 标签类型 h1 h2 span div
    props, // className style children
    ref,
    key
  };
}

const React = {
  createElement,
};

export default React;
