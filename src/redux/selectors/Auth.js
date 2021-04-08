import { createSelector } from 'reselect';
import reducers from '../reducers';
import { PASSWORD_STATUSES } from 'constants/UserConstants';

const selectAuthDomain = (state) => state.auth || reducers;

const makeSelectCurrentUser = () =>
  createSelector(selectAuthDomain, (substate) => substate.user);

const makeSelectIsAuthenticated = () =>
  createSelector(selectAuthDomain, (substate) => Boolean(substate.token));

const makeSelectLoginDetails = () =>
  createSelector(selectAuthDomain, (substate) => ({
    loading: substate.loading,
    message: substate.message,
    showMessage: substate.showMessage,
    token: substate.token,
  }));

const maskeSelectIsPasswordCreateRequired = () =>
  createSelector(
    selectAuthDomain,
    ({ user }) =>
      user?.password_changed_status === PASSWORD_STATUSES.NOT_CHANGED ||
      user?.password_changed_status === PASSWORD_STATUSES.EXPIRED
  );

const makeSelectIsForceClinicRequired = () =>
  createSelector(
    selectAuthDomain,
    ({ user }) =>
      user?.password_changed_status === PASSWORD_STATUSES.CHANGED &&
      user.first_login &&
      user.is_organization_owner
  );

const makeIsSendEmailUser = () =>
  createSelector(selectAuthDomain, (substate) => substate.isSent);

const makeIsResetPassword = () =>
  createSelector(selectAuthDomain, (substate) => substate.isReset);

const makeSelectLoading = () =>
  createSelector(selectAuthDomain, (substate) => substate.loading);

const makeSelectIsOrganizationOwner = () =>
  createSelector(selectAuthDomain, ({ user }) => user?.is_organization_owner);

export {
  makeSelectLoading,
  makeSelectCurrentUser,
  makeSelectIsAuthenticated,
  makeSelectLoginDetails,
  maskeSelectIsPasswordCreateRequired,
  makeSelectIsForceClinicRequired,
  makeIsSendEmailUser,
  makeIsResetPassword,
  makeSelectIsOrganizationOwner,
};
