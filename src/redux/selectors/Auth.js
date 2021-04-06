import { createSelector } from 'reselect';
import reducers from '../reducers';

const selectAuthDomain = (state) => state.auth || reducers;

const makeSelectLoading = () =>
  createSelector(selectAuthDomain, (substate) => substate.loading);

export { makeSelectLoading };
