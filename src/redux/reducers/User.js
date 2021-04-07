import { SET_USERS } from '../constants/User';
import produce from 'immer';

const initialState = {};
/* eslint-disable default-case */
const user = (state = {}, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_USERS:
        draft.users = action.payload.results;
        draft.count = action.payload.count;
        break;
    }
  });

export default user;
