import { useState, useRef, useEffect } from "react";

const useScrollBottom = (deps?: React.DependencyList, smooth?: boolean) => {
  const blockRef = useRef<HTMLDivElement | null>(null);

  // useEffect(() => {
  //   const elem = blockRef.current;

  //   const isScrolledToBottom =
  //     elem && elem.scrollHeight - elem.scrollTop === elem.clientHeight;

  //   if (elem && (isScrolledToBottom || elem.scrollTop === 0)) {
  //     elem.scrollTop = elem.scrollHeight;
  //   }
  // }, [deps]);

  useEffect(() => {
    if (blockRef.current) {
      blockRef.current.scrollTop = blockRef.current.scrollHeight;
    }
  }, [deps]);

  return blockRef;
};

export default useScrollBottom;
