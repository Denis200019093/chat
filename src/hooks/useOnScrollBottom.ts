import { useEffect, useState } from "react";

const useOnScrollToBottom = () => {
  const [atBottom, setBottom] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      const offsetHeight = document.documentElement.offsetHeight;
      const innerHeight = window.innerHeight;
      const scrollTop = document.documentElement.scrollTop;

      const hasReachedBottom = offsetHeight - (innerHeight + scrollTop) <= 10;

      setBottom(hasReachedBottom);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return atBottom;
};

export default useOnScrollToBottom;
