import { useState, useRef, useEffect } from "react";

const useScrollBottom = () => {
  const [isAtBottom, setIsAtBottom] = useState(false);

  const ref =
    useRef<HTMLDivElement>() as React.MutableRefObject<HTMLDivElement>;
  console.log(isAtBottom);

  useEffect(() => {
    if (isAtBottom && ref.current) {
      ref.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
      // setIsAtBottom(false);
    }
  }, [isAtBottom]);

  return {
    ref,
    setIsAtBottom,
  };
};

export default useScrollBottom;
