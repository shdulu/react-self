let isBatchingUpdate = false;
let state = { number: 0 };
let updateQueue = [];

function setState(newState) {
  if (isBatchingUpdate) {
    updateQueue.push(newState);
  } else {
    state = newState;
  }
}

const handleChick = () => {
  setState({ number: state.number + 1 });
  console.log(state.number);
  setState({ number: state.number + 1 });
  console.log(state.number);
  setTimeout(() => {
    setState({ number: state.number + 1 });
    console.log(state.number);
    setState({ number: state.number + 1 });
    console.log(state.number);
  });
};

function batchedUpdate(fn) {
  isBatchingUpdate = true; // 进入批量模式
  fn();
  debugger
  isBatchingUpdate = false; // 推出批量更新模式
  updateQueue.forEach((newState) => {
    state = newState;
  });
  updateQueue.length = 0;
}
debugger
batchedUpdate(handleChick);
