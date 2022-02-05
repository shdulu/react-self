import {
  REACT_CONTEXT,
  REACT_ELEMENT,
  REACT_FORWARD_REF,
  REACT_PROVIDER,
} from "./constants";
import { wrapToVdom } from "./utils";
import { Component } from "./Component";

function createElement(type, config, children) {
  let ref, key;
  if (config) {
    delete config.__source;
    delete config.__self;
    ref = config.ref; // 用来引用真实DOM元素
    key = config.key; // 进行DOM-DIFF 优化，用来唯一标识某个子元素
    delete config.ref;
    delete config.key;
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
    key,
  };
}

function createRef() {
  return {
    current: null, //
  };
}

/**
 *
 * @param {*} render 可以接受转发的ref的函数组件
 */
function forwardRef(render) {
  return {
    $$typeof: REACT_FORWARD_REF,
    render,
  };
}

function createContext() {
  let context = {
    $$typeof: REACT_CONTEXT,
    _currentValue: undefined
  };
  context.Provider = {
    $$typeof: REACT_PROVIDER,
    _context: context,
  };
  context.Consumer = {
    $$typeof: REACT_CONTEXT,
    _context: context,
  };
  return context;
}

const React = {
  createElement,
  Component,
  createRef,
  forwardRef,
  createContext,
};

export default React;
