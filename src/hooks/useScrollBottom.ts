import { useState, useRef, useEffect } from "react";

// const useScrollBottom = () => {
//   const [isAtBottom, setIsAtBottom] = useState(false);

//   const ref =
//     useRef<HTMLDivElement>() as React.MutableRefObject<HTMLDivElement>;
//   console.log(isAtBottom);

//   useEffect(() => {
//     if (isAtBottom && ref.current) {
//       ref.current.scrollIntoView({
//         behavior: "smooth",
//         block: "end",
//       });
//       setIsAtBottom(false);
//     }
//   }, [isAtBottom]);

//   return {
//     ref,
//     setIsAtBottom,
//   };
// };

const useScrollBottom = () => {
  const ref =
    useRef<HTMLDivElement>() as React.MutableRefObject<HTMLDivElement>;

  const scrollToBottom = () => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  };

  return {
    ref,
    scrollToBottom,
  };
};

export default useScrollBottom;
