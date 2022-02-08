import {
  REACT_TEXT,
  REACT_FORWARD_REF,
  MOVE,
  PLACEMENT,
  REACT_PROVIDER,
  REACT_CONTEXT,
  REACT_MEMO,
} from "./constants";
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
  if (newDOM) parentDOM.appendChild(newDOM);
  if (newDOM && newDOM.componentDidMount) {
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
  if (!renderVdom) return null;
  return createDOM(renderVdom);
}

function mountClassComponent(vdom) {
  let { type: ClassComponent, props, ref } = vdom;
  // 把类组件的属性传递给了类组件的构造函数
  let classInstance = new ClassComponent(props); // 创建类组件的实例
  if (ClassComponent.contextType) {
    // 类上有contextType 属性 - 在类的实例上挂在 context
    classInstance.context = ClassComponent.contextType._currentValue;
  }
  vdom.classInstance = classInstance; // 在虚拟dom上挂在一个属性，指向类组件的实例，组件卸载的时候可以执行实例上的卸载方法
  if (ref) ref.current = classInstance; // 组件卸载值为空

  if (classInstance.componentWillMount) {
    classInstance.componentWillMount();
  }
  let renderVdom = classInstance.render();
  vdom.oldRenderVdom = classInstance.oldRenderVdom = renderVdom;
  if (!renderVdom) return null;
  let dom = createDOM(renderVdom); // TODO
  if (classInstance.componentDidMount) {
    dom.componentDidMount = classInstance.componentDidMount.bind(classInstance);
  }
  return dom;
}

function mountForwardComponent(vdom) {
  let { type, ref, props } = vdom;
  let renderVdom = type.render(props, ref);
  if (!renderVdom) return null;
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
  if (type && type.$$typeof === REACT_MEMO) {
    mountMemoComponent(vdom);
  } else if (type && type.$$typeof === REACT_PROVIDER) {
    return mountProviderComponent(vdom);
  } else if (type && type.$$typeof === REACT_CONTEXT) {
    return mountContextComponent(vdom);
  } else if (type && type.$$typeof === REACT_FORWARD_REF) {
    return mountForwardComponent(vdom);
  } else if (type === REACT_TEXT) {
    // 文本节点
    dom = document.createTextNode(props.content);
  } else if (typeof type === "string") {
    // DOM 节点
    dom = document.createElement(type);
  } else if (typeof type === "function") {
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
      props.children.mountIndex = 0;
      mount(children, dom);
    } else if (Array.isArray(children)) {
      reconcileChildren(children, dom);
    }
  }
  vdom.dom = dom; // 在虚拟dom上挂一个dom属性指向虚拟对应的真实dom
  if (ref) ref.current = dom; // ref有值 ref的current属性指向真实dom
  return dom;
}
function mountMemoComponent(vdom) {
  let { type, props } = vdom; // type是 memo 返回的对象
  let renderVdom = type.type(props);
  vdom.prevProps = props; // 记录一下老的属性对象，方便更新的时候对比
  vdom.oldRenderVdom = renderVdom;
  if (!renderVdom) return null;
  return createDOM(renderVdom);
}
function mountProviderComponent(vdom) {
  let { type, props } = vdom;
  let context = type._context;
  context._currentValue = props.value;
  let renderVdom = props.children; // 对Provider 而言，它要渲染的其实是他的儿子
  vdom.oldRenderVdom = renderVdom; // 这一步是为了后面更新用的
  if (!renderVdom) return null;
  return createDOM(renderVdom);
}
function mountContextComponent(vdom) {
  let { type, props } = vdom;
  let context = type._context;
  let renderVdom = props.children(context._currentValue);
  vdom.oldRenderVdom = renderVdom;
  if (!renderVdom) return null;
  return createDOM(renderVdom);
}

function reconcileChildren(children, parentDOM) {
  children.forEach((childVdom, index) => {
    childVdom.mountIndex = index;
    mount(childVdom, parentDOM);
  });
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
  if (oldVdom.type.$$typeof === REACT_MEMO) {
    updateMemoComponent(oldVdom, newVdom);
  } else if (oldVdom.type.$$typeof === REACT_CONTEXT) {
    updateContextComponent(oldVdom, newVdom);
  } else if (oldVdom.type.$$typeof === REACT_PROVIDER) {
    updateProviderComponent(oldVdom, newVdom);
  } else if (oldVdom.type === REACT_TEXT && newVdom.type === REACT_TEXT) {
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
function updateContextComponent(oldVdom, newVdom) {
  let oldDOM = findDOM(oldVdom); // 老的dom
  let parentDOM = oldDOM.parentNode; // 父dom
  let { type, props } = newVdom;
  let context = type._context;
  let renderVdom = props.children(context._currentValue);
  compareTwoVdom(parentDOM, oldVdom.oldRenderVdom, renderVdom);
  newVdom.oldRenderVdom = renderVdom;
}
function updateMemoComponent(oldVdom, newVdom) {
  let { type, prevProps } = oldVdom;
  if (!type.compare(prevProps, newVdom.props)) {
    // 如果新老属性比较后是不相等的，进入更新逻辑
    let oldDOM = findDOM(oldVdom); // 老的真实dom
    let parentDOM = oldDOM.parentNode;
    let { type, props } = newVdom;
    let renderVdom = type.type(props);
    compareTwoVdom(parentDOM, oldVdom.oldRenderVdom, renderVdom);
    newVdom.prevProps = props;
    newVdom.oldRenderVdom = renderVdom;
  } else {
    // 如果相等跳过更新，直接赋值
    newVdom.prevProps = prevProps;
    newVdom.oldRenderVdom = oldVdom.oldRenderVdom;
  }
}
function updateProviderComponent(oldVdom, newVdom) {
  let oldDOM = findDOM(oldVdom); // 老的dom
  let parentDOM = oldDOM.parentNode; // 父dom
  let { type, props } = newVdom;
  let context = type._context;
  context._currentValue = props.value; // 使用新的属性赋给_currentValue
  let renderVdom = props.children;
  compareTwoVdom(parentDOM, oldVdom.oldRenderVdom, renderVdom);
  newVdom.oldRenderVdom = renderVdom;
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
  oldVChildren = (
    Array.isArray(oldVChildren) ? oldVChildren : [oldVChildren]
  ).filter((item) => item);
  newVChildren = (
    Array.isArray(newVChildren) ? newVChildren : [newVChildren]
  ).filter((item) => item);
  //第一步： 构建老虚拟DOM的Map， key是虚拟dom的key，值是虚拟dom
  let keyedOldMap = {};
  // 同级 - 遍历老的虚拟DOM列表 - 映射Map
  oldVChildren.forEach((oldVChild, index) => {
    let oldKey = oldVChild.key ? oldVChild.key : index;
    keyedOldMap[oldKey] = oldVChild;
  });

  let patch = []; // 表示我们要打的补丁，也就是我们要进行的操作，移动和插入项
  let lastPlacedIndex = 0; // 上一个被放置好的索引，就是不需要移动的老元素的索引

  // 第二步 循环新的虚拟dom列表，用key去Map找有没有key一样的元素，如果找到了，用新的属性更新老的真实DOM
  newVChildren.forEach((newVChild, index) => {
    newVChild.mountIndex = index;
    let newKey = newVChild.key ? newVChild.key : index;
    let oldVChild = keyedOldMap[newKey];
    if (oldVChild) {
      // 如果有，说明老的节点找到了，可以复用老节点， 先更新
      updateElement(oldVChild, newVChild);
      if (oldVChild.mountIndex < lastPlacedIndex) {
        patch.push({
          type: MOVE,
          oldVChild, // oldVChild 移动到当前索引处
          newVChild,
          mountIndex: index,
        });
      }
      delete keyedOldMap[newKey]; // 从Map中删除已经复用好的节点
      lastPlacedIndex = Math.max(oldVChild.mountIndex, lastPlacedIndex);
    } else {
      patch.push({
        type: PLACEMENT,
        newVChild,
        mountIndex: index,
      });
    }
  });
  // 获取需要移动的元素
  let moveChildren = patch
    .filter((action) => action.type === MOVE)
    .map((action) => action.oldVChild);
  // 遍历完成后在map中留下的元素就是没有被复用到的元素，需要全部删除
  Object.values(keyedOldMap)
    .concat(moveChildren)
    .forEach((oldVChild) => {
      let currentDOM = findDOM(oldVChild);
      parentDOM.removeChild(currentDOM);
    });
  patch.forEach((action) => {
    let { type, oldVChild, newVChild, mountIndex } = action;
    let childNodes = parentDOM.childNodes; // 真实DOM节点集合
    if (type === PLACEMENT) {
      let newDOM = createDOM(newVChild); // 根据新的虚拟DOM创建真实DOM
      let childNode = childNodes[mountIndex]; // 获取原来老的DOM中的对应的索引处的真实DOM
      if (childNode) {
        parentDOM.insertBefore(newDOM, childNode);
      } else {
        parentDOM.appendChild(newDOM);
      }
    } else if (type === MOVE) {
      let oldDOM = findDOM(oldVChild);
      let childNode = childNodes[mountIndex]; // 获取原来老的DOM中的对应的索引处的真实DOM
      if (childNode) {
        parentDOM.insertBefore(oldDOM, childNode);
      } else {
        parentDOM.appendChild(oldDOM);
      }
    }
  });
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
  createPortal: render,
};

export default ReactDOM;
