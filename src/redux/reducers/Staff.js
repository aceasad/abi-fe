import { SET_STAFF, SET_STAFF_PAGE } from '../constants/Staff';
import produce from 'immer';

const initialState = {
  staff: [],
  count: 0,
  page: 1,
};

/* eslint-disable default-case */
const staff = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_STAFF:
        draft.staff = action.payload.results;
        draft.count = action.payload.count;
        break;
      case SET_STAFF_PAGE:
        draft.page = action.payload;
        break;
    }
  });

export default staff;
