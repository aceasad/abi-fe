import { useEffect, useRef, useState } from 'react';
import { message } from 'antd';

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

export const useSocket = ({
  url,
  onmessage = () => {},
  onopen = () => {},
  errorMessage,
}) => {
  const socket = useRef();
  const [socketOpen, setSocketOpen] = useState(false);
  useEffect(() => {
    try {
      socket.current = new WebSocket(url);
      socket.current.onmessage = onmessage;
      socket.current.onopen = onopen;
      socket.current.onclose = () => {
        // TO DO - Reconnect if it's not unmount
        setSocketOpen(false);
        socket.current = null;
        message.warning(errorMessage);
      };

      setSocketOpen(true);
    } catch (e) {
      setSocketOpen(false);
      socket.current = null;
      message.warning(errorMessage);
    }
    return () => {
      if (socket.current) socket.current.close();
    };
  }, []);

  return [socket.current, socketOpen];
};
