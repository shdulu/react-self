### React 路由原理

- 不同的路径渲染不同组件
- 有两种实现方式
  - HashRouter：利用 hash 实现路由切换
  - BrowserRouter：利用 h5 Api 实现路由切换

### 基本路由使用和实现

### 实现 history

- HTML5 规范给我们提供了一个 history 接口
- HTML5 History API 包括 2 个方法：`history.pushState()`和`history.replaceState()`，和一个事件`window.onpopstate`

**pushState**
history.pushState(stateObject, title, url),包括三个参数

- 第一个参数用于存储该 url 对应的状态对象，该对象可在 onpopstate 事件中获取，也可在 history 对象中获取
- 第二个参数是标题，目前浏览器未实现
- 第三个参数则是设定的 url
  pushState() 函数向浏览器的历史堆栈压入一个 url 为设定值的记录，并改变历史堆栈的当前指针至栈顶

**1.2.1.2 replaceState**

- 该接口与 pushState 参数相同，含义也相同
- 唯一的区别在于 `replaceState`是替换浏览器历史堆栈的当前历史记录为设定的 url
- 需要主要的是 `replaceState`不会改动浏览器历史堆栈的当前指针

**1.2.1.3 onpopstate**

- 该事件是 window 的属性
- 该事件会在调用浏览器的前进、后退以及执行 `history.forward`,`history.back`,和`hsitory.go`触发，因为这些操作有一个共性，即修改了历史堆栈的当前指针
- 在不改变 document 的前提下，一旦当前指针改变则会触发`onpopstate`事件

### 实现正则匹配

### 实现 Switch

### 实现 Redirect

### 实现 Link

### 实现嵌套路由

### 实现受保护路由

### 实现 NavLink

### 实现 withRouter

### 实现 Prompt

### 实现 hooks
