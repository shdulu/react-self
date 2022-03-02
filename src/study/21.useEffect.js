import React from "../react";

function Counter() {
  const [number, setNumber] = React.useState(0);
  React.useEffect(() => {
    console.log("开启定时器");
    const timer = setInterval(() => {
      setNumber((number) => number + 1);
    }, 1000);
    // 在下次执行 useEffect 之前执行 return
    return () => {
      console.log("销毁定时器");
      // clearInterval(timer)
    };
  }, []);
  return <div>{number}</div>;
}

export default Counter;
