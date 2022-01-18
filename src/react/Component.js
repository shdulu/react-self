class Component {
  static isReactComponent = true;
  constructor(props) {
    this.props = props;
  }
}

export { Component };

// 因为函数组件和类组件都会在编译 后成为函数
// 为了区分类组件和函数组件，给类组件的类型加一个静态属性 isReactComponent = true
// 子类继承父类不但继承实例方法也会继承静态方法
