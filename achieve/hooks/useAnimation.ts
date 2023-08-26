import { useState } from "react";
function useAnimation(initialClassName: string, activeClassName: string) {
  const [className, setClassName] = useState(initialClassName);
  function start() {
    if (className === initialClassName) {
      setClassName(`${initialClassName} ${activeClassName}`);
    } else {
      setClassName(`${initialClassName}`);
    }
  }
  return [className, start];
}
export default useAnimation;
