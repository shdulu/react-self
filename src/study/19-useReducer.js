import React from "../react";

/**
 *
 *
 * @param {*} [state={ number: 0 }] 老状态
 * @param {*} action 动作对象
 * @return {*}
 */
function reducer(state = { number: 0 }, action) {
  switch (action.type) {
    case "ADD":
      return {
        number: state.number + 1,
      };
    case "MINUS":
      return {
        number: state.number - 1,
      };
    default:
      return state;
  }
}

function Counter() {
  const [state, dispatch] = React.useReducer(reducer, { number: 0 });
  return (
    <div>
      <p>{state.number}</p>
      <button onClick={() => dispatch({ type: "ADD" })}>+</button>
      <button onClick={() => dispatch({ type: "MINUS" })}>-</button>
    </div>
  );
}

export default Counter;
