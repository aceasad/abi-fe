import { createRoot } from "react-dom/client";
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import './index.css';
import './assets/less/styles/styles.less';
import LanguageProvider from 'containers/LanguageProvider';
import { translationMessages } from './i18n';
import { Provider } from 'react-redux';
import store, { history } from 'redux/store';
import { ConnectedRouter } from 'connected-react-router';

const MOUNT_NODE = document.getElementById('root');

const render = (messages) => {
  const root = createRoot(MOUNT_NODE);

  root.render(<Provider store={store}>
    <ConnectedRouter history={history}>
      <LanguageProvider messages={messages}>
        <App />
      </LanguageProvider>
    </ConnectedRouter>
  </Provider>);
};

render(translationMessages);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
