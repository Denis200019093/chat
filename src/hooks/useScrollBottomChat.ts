import { useCallback, useRef, useState, useEffect } from "react";

const useScrollBottomChat = (trigger: unknown) => {
  const [showScrollButton, setShowScrollButton] = useState<boolean>(false);

  const chatScrollRef = useRef<HTMLDivElement | null>(null);

  const handleScroll = useCallback(() => {
    if (
      chatScrollRef.current &&
      chatScrollRef.current.scrollHeight -
        (chatScrollRef.current.scrollTop + chatScrollRef.current.clientHeight) >
        200
    ) {
      setShowScrollButton(true);
    } else {
      setShowScrollButton(false);
    }
  }, []);

  useEffect(() => {
    chatScrollRef.current?.addEventListener("scroll", handleScroll);

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      chatScrollRef.current?.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  useEffect(() => {
    if (!showScrollButton && chatScrollRef.current)
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
  }, [showScrollButton, trigger]);

  return {
    chatScrollRef,
  };
};

export default useScrollBottomChat;
