import {
  REACT_CONTEXT,
  REACT_ELEMENT,
  REACT_FORWARD_REF,
  REACT_MEMO,
  REACT_PROVIDER,
} from "./constants";
import { wrapToVdom, shallowEqual } from "./utils";
import { Component } from "./Component";
import {
  useState,
  useMemo,
  useCallback,
  useReducer,
  useContext,
} from "./react-dom";

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
    _currentValue: undefined,
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
function cloneElement(oldElement, props, children) {
  if (arguments.length > 3) {
    // 如果参数的长度大于 3， 多个儿子
    props.children = Array.prototype.slice.call(arguments, 2).map(wrapToVdom);
  } else if (arguments.length === 3) {
    props.children = wrapToVdom(children); // 字符串 数字 React元素
  }
  return {
    ...oldElement,
    props,
  };
}
/**
 * 返回一个对象
 *
 */
function memo(type, compare = shallowEqual) {
  return {
    $$typeof: REACT_MEMO,
    compare, // 用来比较新旧属性差异， 判断新老属性是否相同
    type,
  };
}
class PureComponent extends Component {
  // 继承父组件，重写父组件方法
  shouldComponentUpdate(nextProps, nextState) {
    // 如果props或者state不相等返回true
    return (
      !shallowEqual(this.props, nextProps) ||
      !shallowEqual(this.state, nextState)
    );
  }
}

const React = {
  useContext,
  useReducer,
  useCallback,
  useMemo,
  useState,
  createElement,
  Component,
  createRef,
  forwardRef,
  createContext,
  cloneElement,
  memo,
  PureComponent,
};

export default React;
