import { createSelector } from 'reselect';
import reducers from '../reducers';
import { PASSWORD_STATUSES } from 'constants/UserConstants';

const selectUsersDomain = (state) => state.auth || reducers;

const makeSelectCurrentUser = () =>
  createSelector(selectUsersDomain, (substate) => substate.user);

const makeSelectIsAuthenticated = () =>
  createSelector(selectUsersDomain, (substate) => Boolean(substate.token));

const makeSelectLoginDetails = () =>
  createSelector(selectUsersDomain, (substate) => ({
    loading: substate.loading,
    message: substate.message,
    showMessage: substate.showMessage,
    token: substate.token,
  }));

const maskeSelectIsPasswordCreateRequired = () =>
  createSelector(
    selectUsersDomain,
    ({ user }) =>
      user?.password_changed_status === PASSWORD_STATUSES.NOT_CHANGED ||
      user?.password_changed_status === PASSWORD_STATUSES.EXPIRED
  );

const makeIsSendEmailUser = () =>
  createSelector(selectUsersDomain, (substate) => substate.isSent);

const makeIsResetPassword = () =>
  createSelector(selectUsersDomain, (substate) => substate.isReset);

export {
  makeSelectCurrentUser,
  makeSelectIsAuthenticated,
  makeSelectLoginDetails,
  maskeSelectIsPasswordCreateRequired,
  makeIsSendEmailUser,
  makeIsResetPassword,
};
