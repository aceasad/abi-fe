import React from 'react';

export const beforeRoute = {
  action: () => {},
  setContext: () => {},
  proceed: false,
};

export const BeforeRouteContext = React.createContext(beforeRoute);
