import { message } from 'antd';
import { push } from 'connected-react-router';
import httpService from './HttpService';
import store from 'redux/store';
import { signOutSuccess } from 'redux/actions/Auth';
import { ROUTES } from 'routes';
import { clearLocalStorage } from 'utils/localStorage';

const LOG = '[SessionTeardown]';

let closeWebSockets = () => {};

/** Called from WebSocketClient so teardown can close sockets without a circular import. */
export function registerWebSocketCloser(fn) {
  closeWebSockets = typeof fn === 'function' ? fn : () => {};
  console.info(`${LOG} WebSocket closer registered`);
}

/**
 * Clears client session: live connections, local storage, Authorization header, Redux auth.
 * Optionally warns the user and navigates to login (soft navigation via redux-router).
 */
export function teardownSession({
  warningMessage,
  navigateToLogin = true,
} = {}) {
  const hasStored = Boolean(
    typeof localStorage !== 'undefined' && localStorage.getItem('token')
  );
  const hasRedux = Boolean(store.getState()?.auth?.token);
  if (!hasStored && !hasRedux) {
    console.info(`${LOG} teardown skipped (already no session in storage or Redux)`);
    return;
  }

  console.info(`${LOG} teardown starting`, {
    hasStored,
    hasRedux,
    navigateToLogin,
    showWarning: Boolean(warningMessage),
  });

  closeWebSockets();
  clearLocalStorage();
  httpService.removeHeaders(['Authorization']);
  store.dispatch(signOutSuccess());
  console.info(`${LOG} storage cleared, Authorization header removed, SIGNOUT_SUCCESS dispatched`);
  if (warningMessage) {
    message.warning(warningMessage);
  }
  if (navigateToLogin) {
    store.dispatch(push(ROUTES.LOGIN));
    console.info(`${LOG} navigate ->`, ROUTES.LOGIN);
  }
  console.info(`${LOG} teardown complete`);
}
