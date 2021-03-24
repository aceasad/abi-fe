import {
  SET_STAFF,
  SET_STAFF_PAGE,
  SET_STAFF_LOADING,
} from '../constants/Staff';
import produce from 'immer';

const initTheme = {
  staff: [],
  count: 0,
  page: 1,
  loading: false,
};

/* eslint-disable default-case */
const theme = (state = initTheme, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_STAFF:
        draft.staff = action.payload.results;
        draft.count = action.payload.count;
        break;
      case SET_STAFF_PAGE:
        draft.page = action.payload;
        break;
      case SET_STAFF_LOADING:
        draft.loading = action.payload;
        break;
    }
  });

export default theme;
