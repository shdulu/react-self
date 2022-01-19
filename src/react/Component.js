import { compareTwoVdom } from "./react-dom";
class Updater {
  constructor(classInstance) {
    this.classInstance = classInstance;
    this.penddingStates = [];
  }
  addState(partialState) {
    this.penddingStates.push(partialState);
    this.emitUpdate();
  }
  emitUpdate() {
    this.updateComponent();
  }
  updateComponent() {
    let { classInstance, penddingStates } = this;
    if (penddingStates.length > 0) {
      shouldUpdate(classInstance, this.getState());
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
function shouldUpdate(classInstance, nextState) {
  classInstance.state = nextState; // 先把新状态赋给类的实例的this.state 上去
  classInstance.forceUpdate(); // 让类的实例强行更新
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
    let oldDOM = oldRenderVdom.dom; // 获取老的真实DOM
    let newRenderVdom = this.render();
    compareTwoVdom(oldDOM.parentNode, oldRenderVdom, newRenderVdom);
    this.oldRenderVdom = newRenderVdom;
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
