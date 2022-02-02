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
  if (newDOM.componentDidMount) {
    newDOM.componentDidMount();
  }
}

/**
 * 挂在函数组件
 *
 */
function mountFunctionComponent(vdom) {
  let { type: functionComponent, props } = vdom;
  let renderVdom = functionComponent(props); // 执行函数 - 获取组件将要渲染的虚拟dom
  vdom.oldRenderVdom = renderVdom;
  return createDOM(renderVdom);
}

function mountClassComponent(vdom) {
  let { type: ClassComponent, props, ref } = vdom;
  // 把类组件的属性传递给了类组件的构造函数
  let classInstance = new ClassComponent(props); // 创建类组件的实例
  vdom.classInstance = classInstance; // 在虚拟dom上挂在一个属性，指向类组件的实例，组件卸载的时候可以执行实例上的卸载方法
  if (ref) ref.current = classInstance; // 组件卸载值为空

  if (classInstance.componentWillMount) {
    classInstance.componentWillMount();
  }
  let renderVdom = classInstance.render();
  vdom.oldRenderVdom = classInstance.oldRenderVdom = renderVdom;
  let dom = createDOM(renderVdom);
  if (classInstance.componentDidMount) {
    dom.componentDidMount = classInstance.componentDidMount;
  }
  return dom;
}

function mountForwardComponent(vdom) {
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

/**
 * DOM-DIFF 递归的比较 老的虚拟dom和新的虚拟dom，找出新旧的差异，然后把这些差异
 * 最小化的操作同步到真实DOM上
 *
 * @param {*} parentDOM 父真实DOM
 * @param {*} oldVdom 老真实DOM
 * @param {*} newVdom 新虚拟DOM
 * @param {*} nextDOM 将要把新的元素插入到那个真实dom之前
 */
export function compareTwoVdom(parentDOM, oldVdom, newVdom, nextDOM) {
  // let oldDOM = findDOM(oldVdom);
  // let newDOM = createDOM(newVdom);
  // parentDOM.replaceChild(newDOM, oldDOM);

  // 如果老的是null，新的也是null
  if (!oldVdom && !newVdom) {
    return;
  } else if (oldVdom && !newVdom) {
    // 如果老的有新的没有 卸载老的节点
    unMountVdom(oldVdom);
  } else if (!oldVdom && newVdom) {
    // 如果老的没有新的有 - 插入
    mountVdom(parentDOM, newVdom, nextDOM);
  } else if (oldVdom && newVdom && oldVdom.type !== newVdom.type) {
    // 老的有新的也有，判断类型type,类型一样可以复用，否则不能复用
    // 类型不同 - 干掉老的插入新的
    unMountVdom(oldVdom);
    mountVdom(parentDOM, oldVdom, nextDOM);
  } else {
    // 新的有老的也有，类型type也一样，可以进行深度dom-diff，并且可复用当前dom节点
    updateElement(oldVdom, newVdom);
  }
}

function updateElement(oldVdom, newVdom) {
  if (oldVdom.type === REACT_TEXT && newVdom.type === REACT_TEXT) {
    // 新老节点都是文本节点，复用老的文本节点
    let currentDOM = (newVdom.dom = findDOM(oldVdom));
    currentDOM.textContent = newVdom.props.content;
  } else if (typeof oldVdom.type === "string") {
    let currentDOM = (newVdom.dom = findDOM(oldVdom));
    // 更新属性
    updateProps(currentDOM, oldVdom.props, newVdom.props);
    updateChildren(currentDOM, oldVdom.props.children, newVdom.props.children);
  } else if (typeof oldVdom.type === "function") {
    // 如果老的类型是一个函数，说明他是一个类组件或者函数组件
    if (oldVdom.type.isReactComponent) {
      // 类组件
      newVdom.classInstance = oldVdom.classInstance;
      updateClassComponent(oldVdom, newVdom);
    } else {
      // 函数组件
      updateFunctionComponent(oldVdom, newVdom);
    }
  }
}

/**
 * 更新类组件
 *
 * @param {*} oldVdom
 * @param {*} newVdom
 */
function updateClassComponent(oldVdom, newVdom) {
  let classInstance = (newVdom.classInstance = oldVdom.classInstance); // 复用老的组件实例
  if (classInstance.componentWillReceiveProps) { 
    // 执行 componentWillReceiveProps生命周期
    classInstance.componentWillReceiveProps(newVdom.props);
  }
  // 
  classInstance.updater.emitUpdate(newVdom.props);
}
/**
 * 更新函数组件
 *
 * @param {*} oldVdom
 * @param {*} newVdom
 */
function updateFunctionComponent(oldVdom, newVdom) {
  let parentDOM = findDOM(oldVdom).parentNode; // 获取老的真实dom 父节点
  let { type, props } = newVdom;
  let newRenderVdom = type(props); // 函数组件更新每次都要重新执行函数
  compareTwoVdom(parentDOM, oldVdom.oldRenderVdom, newRenderVdom);
  newVdom.oldRenderVdom = newRenderVdom;
}

function updateChildren(parentDOM, oldVChildren, newVChildren) {
  oldVChildren = Array.isArray(oldVChildren) ? oldVChildren : [oldVChildren];
  newVChildren = Array.isArray(newVChildren) ? newVChildren : [newVChildren];
  let maxLength = Math.max(oldVChildren.length, newVChildren.length);
  for (let i = 0; i < maxLength; i++) {
    // 在老的虚拟dom中查找，有老的节点，并且老节点真的对应一个真实DOM节点，并且它的索引比我要大
    let nextVdom = oldVChildren.find(
      (item, index) => index > i && item && findDOM(item)
    );
    compareTwoVdom(
      parentDOM,
      oldVChildren[i],
      newVChildren[i],
      nextVdom && findDOM(nextVdom)
    );
  }
}

function mountVdom(parentDOM, vdom, nextDOM) {
  let newDOM = createDOM(vdom);
  if (nextDOM) {
    parentDOM.insertBefore(newDOM, nextDOM);
  } else {
    parentDOM.appendChild(newDOM);
  }
  if (newDOM.componentDidMount) {
    newDOM.componentDidMount();
  }
}
/**
 *
 * 卸载老节点
 * @param {*} vdom 老的虚拟DOM
 * @description 根据老的虚拟dom节点找到对应的真实dom节点，删掉
 */
function unMountVdom(vdom) {
  let { props, ref } = vdom;
  let currentDOM = findDOM(vdom); // 获取老的真实DOM
  if (vdom.classInstance && vdom.classInstance.componentWillUnmount) {
    // 如果这个子节点是一个类组件的话，我们还要执行它的卸载的生命周期函数
    vdom.classInstance.componentWillUnmount();
  }
  if (ref && ref.current) {
    ref.current = null;
  }
  if (props.children) {
    // 如果有子节点，递归删除所有的子节点
    let children = Array.isArray(props.children)
      ? props.children
      : [props.children];
    children.forEach(unMountVdom); // 递归处理
  }
  if (currentDOM) {
    // 从父节点中把自己删除
    currentDOM.parentNode.removeChild(currentDOM);
  }
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
