import { createSelector } from "reselect";
import reducers from "../reducers";

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
    token: substate.token
  }));

export {
  makeSelectCurrentUser,
  makeSelectIsAuthenticated,
  makeSelectLoginDetails
};
