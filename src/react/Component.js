import { compareTwoVdom, findDOM } from "./react-dom";
export let updateQueue = {
  isBatchingUpdate: false, // 控制更新时同步还是异步的
  updaters: [], // 更新的数据队列 - 存放 Updater实例
  batchUpdate() {
    // 批量更新
    updateQueue.updaters.forEach((updater) => updater.updateComponent()); // 批量更新
    updateQueue.isBatchingUpdate = false; // 设置批量更新标识符
    updateQueue.updaters.length = 0; // 清空队列
  },
};
class Updater {
  constructor(classInstance) {
    this.classInstance = classInstance;
    this.penddingStates = [];
  }
  addState(partialState) {
    this.penddingStates.push(partialState);
    this.emitUpdate();
  }
  emitUpdate(nextProps) {
    this.nextProps = nextProps;
    if (updateQueue.isBatchingUpdate) {
      // 当前处于批量更新模式 - 把当前的更新实例存到更新队列
      updateQueue.updaters.push(this);
    } else {
      this.updateComponent();
    }
  }
  updateComponent() {
    let { nextProps, classInstance, penddingStates } = this;
    // 如果属性更新了或者状态变化了都会更新
    if (nextProps || penddingStates.length > 0) {
      shouldUpdate(classInstance, nextProps, this.getState());
    }
  }
  // 基于老状态和penddingStates获取新状态
  getState() {
    let { classInstance, penddingStates } = this;
    let { state } = classInstance; // 老状态
    penddingStates.forEach((nextState) => {
      if (typeof nextState === "function") {
        nextState = nextState(state);
      }
      state = { ...state, ...nextState };
    });
    penddingStates.length = 0;
    return state;
  }
}
function shouldUpdate(classInstance, nextProps, nextState) {
  let willUpdate = true;
  // 如果有shouldComponentUpdate方法，并且shouldComponentUpdate执行结果是false
  if (
    classInstance.shouldComponentUpdate &&
    !classInstance.shouldComponentUpdate(nextProps, nextState)
  ) {
    willUpdate = false;
  }
  if (willUpdate && classInstance.componentWillUpdate) {
    classInstance.componentWillUpdate();
  }
  if (nextProps) {
    classInstance.props = nextProps;
  }
  classInstance.state = nextState; // 先把新状态赋给类的实例的this.state 上去, 不管要不要更新赋值都要执行
  if (willUpdate) {
    classInstance.forceUpdate(); // 让类的实例强行更新
  }
}

class Component {
  static isReactComponent = true;
  constructor(props) {
    this.props = props;
    this.state = {};
    this.updater = new Updater(this);
  }
  setState(partialState) {
    this.updater.addState(partialState);
  }
  forceUpdate() {
    let oldRenderVdom = this.oldRenderVdom; // 获取老的虚拟DOM
    let oldDOM = findDOM(oldRenderVdom); // 获取老的真实DOM
    let newRenderVdom = this.render();
    // 此处的逻辑其实就是DOM-DIFF的逻辑 !!!
    compareTwoVdom(oldDOM.parentNode, oldRenderVdom, newRenderVdom);
    this.oldRenderVdom = newRenderVdom;
    if (this.componentDidUpdate) {
      this.componentDidUpdate(this.props, this.state);
    }
  }
}

export { Component };

// 因为函数组件和类组件都会在编译 后成为函数
// 为了区分类组件和函数组件，给类组件的类型加一个静态属性 isReactComponent = true
// 子类继承父类不但继承实例方法也会继承静态方法

/**
 * 更新原理
 * 1. 初次挂在的时候，已经在页面放置了一个div
 * 2. 更新的时候，使用新的状态，重新render返回新的虚拟dom， 在使用新的虚拟dom生成新的真实dom
 * 3. 用新的真实dom替换老的div就实现了更新
 *
 * */
