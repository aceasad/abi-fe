import '@ant-design/v5-patch-for-react-19';
import { createRoot } from "react-dom/client";
import React from 'react';
import App from './App';
import * as serviceWorker from './serviceWorker';
import './index.css';
import './assets/less/styles/styles.less';
import { Provider } from 'react-redux';
import store, { history } from 'redux/store';
import { ConnectedRouter } from 'connected-react-router';

const MOUNT_NODE = document.getElementById('root');

const root = createRoot(MOUNT_NODE);

root.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
