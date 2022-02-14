import React from "../react";

/**
 * 让Child 支持memo
 *
 * @param {*} { data, handleClick }
 * @return {*}
 */
function Child({ data, handleClick }) {
  console.log("Child render");
  return <button onClick={handleClick}>{data.number}</button>;
}
let MemoChild = React.memo(Child);
function App() {
  console.log("App render");
  const [number, setNumber] = React.useState(0);
  const [name, setName] = React.useState("shdulu");
  const data = React.useMemo(() => ({ number }), [number]);
  const handleClick = React.useCallback(() => setNumber(number + 1), [number]);
  return (
    <div>
      <p>{number}</p>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <MemoChild data={data} handleClick={handleClick} />
    </div>
  );
}

export default App;
