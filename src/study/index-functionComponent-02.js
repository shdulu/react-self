/**
 * 函数组件是一个普通的函数
 * 1. 接收一个props属性对象作为参数，且仅能返回一个React元素
 * 2. 组件名称首字符必须大写， React通过首字符是否大写来判断是否为原生DOM节点
 * 3. 组件需要先定义在使用
 *
 * 在React能够管理的范围内比如事件函数，比如说生命周期函数里面都是异步的，批量，除此之外像setTimeout
 * 原生事件里都是同步的
 */
function FunctionComponent(props) {
  return (
    <div className="title" style={{ color: "red" }}>
      {props.name} Hello world!
    </div>
  );
}
const ele2 = <FunctionComponent name="shdulu"></FunctionComponent>;
console.log("ele2", ele2);
