import { SET_STAFF } from '../constants/Staff';
import produce from 'immer';

const initTheme = {
  staff: [],
};

/* eslint-disable default-case */
const theme = (state = initTheme, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_STAFF:
        draft.staff = action.payload;
        break;
    }
  });

export default theme;
