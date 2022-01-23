import { REACT_TEXT, REACT_FORWARD_REF } from "./constants";
import { addEvent } from "./event";

/**
 *
 * @param {*} vdom React.createElement 返回的虚拟DOM对象 也就是 React 元素
 * @param {*} container 真实DOM容器
 */
function render(vdom, container) {
  mount(vdom, container);
}

function mount(vdom, parentDOM) {
  // 1. 把虚拟DOM变成真实DOM
  let newDOM = createDOM(vdom);
  // 2. 把真实DOM追加到容器上
  parentDOM.appendChild(newDOM);
}

/**
 * 挂在函数组件
 *
 */
function mountFunctionComponent(vdom) {
  let { type: functionComponent, props } = vdom;
  let renderVdom = functionComponent(props); // 执行函数 - 获取组件将要渲染的虚拟dom
  return createDOM(renderVdom);
}

function mountClassComponent(vdom) {
  let { type: ClassComponent, props, ref } = vdom;
  let classInstance = new ClassComponent(props);
  if (ref) ref.current = classInstance;
  let renderVdom = classInstance.render();
  vdom.oldRenderVdom = classInstance.oldRenderVdom = renderVdom;
  return createDOM(renderVdom);
}

function mountForwardComponent(vdom) {
  debugger;
  let { type, ref, props } = vdom;
  let renderVdom = type.render(props, ref);
  return createDOM(renderVdom);
}

/**
 * 把虚拟DOM变成真实DOM
 * @param {*} vdom 虚拟DOM React元素
 * @return 真实DOM
 */
function createDOM(vdom) {
  let { type, props, ref } = vdom;
  let dom;
  if (type && type.$$typeof === REACT_FORWARD_REF) {
    return mountForwardComponent(vdom);
  }
  if (type === REACT_TEXT) {
    // 文本节点
    dom = document.createTextNode(props.content);
  } else if (typeof type === "string") {
    // DOM 节点
    dom = document.createElement(type);
  } else if (typeof type === "function") {
    //
    if (type.isReactComponent) {
      // 类组件
      return mountClassComponent(vdom);
    } else {
      return mountFunctionComponent(vdom);
    }
  }
  if (props) {
    // 更新dom属性
    updateProps(dom, {}, props);
    let children = props.children;
    // 如果children 是一个React元素，也就是一个虚拟DOM
    if (typeof children === "object" && children.type) {
      // 把这个儿子虚拟DOM挂在到父节点DOM上
      mount(children, dom);
    } else if (Array.isArray(children)) {
      reconcileChildren(children, dom);
    }
  }
  vdom.dom = dom; // 在虚拟dom上挂一个dom属性指向虚拟对应的真实dom
  if (ref) ref.current = dom; // ref有值 ref的current属性指向真实dom
  return dom;
}

function reconcileChildren(children, parentDOM) {
  children.forEach((childVdom) => mount(childVdom, parentDOM));
}

function updateProps(dom, oldProps, newProps) {
  for (const key in newProps) {
    if (key === "children") {
      // 此处不处理子节点
      continue;
    } else if (key === "style") {
      // style 样式属性 循环遍历添加到dom属性
      let styleObj = newProps[key];
      for (let attr in styleObj) {
        dom.style[attr] = styleObj[attr];
      }
    } else if (/^on[A-Z].*/.test(key)) {
      // 绑定事件处理函数
      // dom.onclick = 函数
      // dom[key.toLocaleLowerCase()] = newProps[key]; 不能用这种方式绑定事件 - 需要使用代理中间执行逻辑
      // 不在把事件函数绑定到对应的DOM上，而是进行事件委托，全部委托到document上
      // AOP 做事件委托, 可以对事件拦截
      addEvent(dom, key.toLocaleLowerCase(), newProps[key]);
    } else {
      dom[key] = newProps[key];
    }
  }
  for (const key in oldProps) {
    if (!newProps.hasOwnProperty(key)) {
      // 如果一个属性在老的属性对象里有，新的属性没有，就删除
      dom[key] = null;
    }
  }
}

export function compareTwoVdom(parentDOM, oldVdom, newVdom) {
  let oldDOM = oldVdom.dom;
  let newDOM = createDOM(newVdom);
  parentDOM.replaceChild(newDOM, oldDOM);
}
export function findDOM(vdom) {
  if (!vdom) return null;
  if (vdom.dom) {
    // 如果它身上有dom属性，那说明这个vdom是一个原生组件的虚拟dom.它会有dom属性指向真实dom，直接返回
    return vdom.dom;
  } else {
    return findDOM(vdom.oldRenderVdom);
  }
}
const ReactDOM = {
  render,
};

export default ReactDOM;
