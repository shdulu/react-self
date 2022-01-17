import { REACT_TEXT } from "./constants";

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
 * 把虚拟DOM变成真实DOM
 * @param {*} vdom 虚拟DOM React元素
 * @return 真实DOM
 */
function createDOM(vdom) {
  let { type, props } = vdom;
  let dom;
  if (type === REACT_TEXT) {
    // 文本节点
    dom = document.createTextNode(props.content);
  } else {
    // DOM 节点
    dom = document.createElement(type);
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

const ReactDOM = {
  render,
};

export default ReactDOM;
