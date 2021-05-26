import { useEffect, useState } from 'react';

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
