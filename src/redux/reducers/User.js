import {
  SET_USERS,
  SET_USERS_LOADING,
  SET_USERS_PAGE,
  SET_USER_SINGLE,
  SET_SINGLE_USER_LOADING,
  SET_SINGLE_USER,
} from '../constants/User';
import { produce } from 'immer';
import { baseState } from 'constants/ClinicConstants';

/* eslint-disable default-case */
const user = (state = { ...baseState, singleLoading: false }, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_USERS:
        draft.items = action.payload.results;
        draft.count = action.payload.count;
        break;
      case SET_USERS_PAGE:
        draft.page = action.payload;
        break;
      case SET_USER_SINGLE:
        draft.single = action.payload;
        break;
      case SET_USERS_LOADING:
        draft.loading = action.payload;
        break;
      case SET_SINGLE_USER_LOADING:
        draft.singleLoading = action.payload;
        break;
      case SET_SINGLE_USER:
        draft.single = action.payload;
        break;
    }
  });

export default user;
