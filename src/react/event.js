import { updateQueue } from "./Component";

/**
 *
 * @export
 * @param {*} dom 要绑定事件的DOM 元素 button
 * @param {*} eventType 事件类型 onclick
 * @param {*} handler 事件处理函数 handleClick
 */
export function addEvent(dom, eventType, handler) {
  let store;
  // 保证dom上有store属性，初始值是一个空对象, store 是一个自定义属性
  if (dom.store) {
    store = dom.store;
  } else {
    store = dom.store = {};
  }

  // 虽然没有给每个子DOM绑定事件，但是事件处理函数还是保存在子DOM上
  store[eventType] = handler; // dom.store['onclick'] = handlerClick
  // 从17开始，我们不再把事件委托给document. 而是委托给容器了 div#root

  if (!document[eventType]) {
    document[eventType] = dispatchEvent;
  }
}

// 合成事件的统一代理函数
function dispatchEvent(event) {
  let { target, type } = event; // button click
  let eventType = `on${type}`; // onclick

  // 创建合成事件对象
  let syntheticEvent = createSyntheticEvent(event);

  updateQueue.isBatchingUpdate = true; // 1. 事件函数执行前先设置批量更新模式为true

  // 在此我们要模拟React事件的冒泡
  while (target) {
    let { store } = target;
    let handler = store && store[eventType];
    handler && handler(syntheticEvent); // handler①
    target = target.parentNode; // 向上冒泡
  }

  updateQueue.isBatchingUpdate = false;
  updateQueue.batchUpdate();
}

/**
 * 为什么React不把原生事件对象直接传给事件处理函数 handler① 呢
 * 1. 为了不同浏览器间的兼容性
 * @param {*} nativeEvent
 */
function createSyntheticEvent(nativeEvent) {
  let syntheticEvent = {};
  // copy 原生事件对象的属性到 syntheticEvent
  for (const key in nativeEvent) {
    syntheticEvent[key] = nativeEvent[key];
  }
  // 扩展添加的属性
  syntheticEvent.nativeEvent = nativeEvent;
  syntheticEvent.preventDefault = preventDefault;
  syntheticEvent.stopPropagation = stopPropagation;
  return syntheticEvent;
}

/**
 * 阻止默认事件
 *
 * @param {*} event
 */
function preventDefault(event) {
  if (!event) {
    window.event.returnValue = false;
  }
  if (event.preventDefault) {
    event.preventDefault();
  }
}

function stopPropagation(event) {
  if (event.stopPropagation) {
    event.stopPropagation();
  } else {
    // IE
    event.cancelBubble = true;
  }
}
