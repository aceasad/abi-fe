import { createSelector } from "reselect";
import reducers from "../reducers";

const selectUsersDomain = (state) => state.auth || reducers;

const makeSelectCurrentUser = () =>
  createSelector(selectUsersDomain, (substate) => substate.user);

const makeSelectIsAuthenticated = () =>
  createSelector(selectUsersDomain, (substate) => Boolean(substate.token));

export { makeSelectCurrentUser, makeSelectIsAuthenticated };
