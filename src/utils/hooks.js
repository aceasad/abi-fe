import { useEffect, useRef, useState } from 'react';

export const useDebounce = (value, timeout) => {
  let [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    let timeoutId = setTimeout(() => {
      setDebouncedValue(value);
    }, timeout);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [value, timeout]);

  return debouncedValue;
};

export const useLazyLoad = (
  selector,
  action,
  dependencies = [],
  checkAdditionalConditions = () => true,
  isScrollDown = true
) => {
  useEffect(() => {
    const element = document.querySelector(selector);
    const handleScroll = () => {
      if (
        isScrollDown &&
        element.scrollHeight - element.scrollTop <= element.clientHeight &&
        checkAdditionalConditions()
      )
        action();
      else if (
        !isScrollDown &&
        element.scrollTop === 0 &&
        checkAdditionalConditions()
      ) {
        action();
      }
    };

    element.addEventListener('scroll', handleScroll, false);

    return () => {
      element.removeEventListener('scroll', handleScroll, false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
};

export const useSocket = ({ url, onmessage = () => {}, onopen = () => {} }) => {
  const socket = useRef();

  useEffect(() => {
    try {
      socket.current = new WebSocket(url);
      socket.current.onmessage = onmessage;
      socket.current.onopen = onopen;
      socket.current.onclose = () => {
        // TO DO - Reconnect if it's not unmount
      };
    } catch {}
    return () => {
      if (socket) socket.current.close();
    };
  }, []);

  return socket.current;
};
