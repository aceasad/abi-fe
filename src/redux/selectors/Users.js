import { DEFAULT_PAGINATION_LIMIT } from 'constants/ApiConstant';
import { createSelector } from 'reselect';
import reducers from '../reducers';

const selectUsersDomain = (state) => state.user || reducers;

const makeSelectUsers = () =>
  createSelector(selectUsersDomain, (substate) => ({
    users: substate.items,
    page: substate.page,
    count: substate.count,
    loading: substate.loading,
  }));

const makeSelectUsersPage = () =>
  createSelector(selectUsersDomain, (substate) => substate.page);

const makeSelectSingleUserLoading = () =>
  createSelector(selectUsersDomain, (substate) => substate.singleLoading);

const makeSelectSingleUser = () =>
  createSelector(selectUsersDomain, (substate) => ({
    user: substate.single,
    loading: substate.singleLoading,
  }));

const makeSelectLastOnThePage = () =>
  createSelector(selectUsersDomain, ({ page, count }) => ({
    isLast: page !== 1 && count - 1 <= (page - 1) * DEFAULT_PAGINATION_LIMIT,
    page,
  }));

export {
  makeSelectUsers,
  makeSelectUsersPage,
  makeSelectSingleUserLoading,
  makeSelectSingleUser,
  makeSelectLastOnThePage,
};
