import produce from 'immer';
import { baseState } from 'constants/ClinicConstants';
import {
  ADD_MORE_TO_ALL_CHATS_INFO,
  ADD_MORE_TO_SINGLE_CHAT,
  SET_ALL_CHATS_INFO,
  SET_ALL_CHATS_INFO_LOADING,
  SET_CONVERSATION_TO_READ,
  SET_SINGLE_CHAT,
  SET_SINGLE_CHAT_LOADING,
  TOGGLE_RASA_ACTIVITY,
} from 'redux/constants/Chats';
import {
  ALL_CHATS_PAGINATION_LIMIT,
  CHAT_MESSAGES_PAGINATION_LIMIT,
} from 'constants/ApiConstant';
import { MESSAGE_STATUS } from 'constants/ChatConstants';

const initialState = {
  ...baseState,
  single: (({ single, ...rest }) => rest)({ ...baseState, chatInfo: null }),
};

/* eslint-disable default-case */
const chats = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_SINGLE_CHAT:
        draft.single = {
          ...state.single,
          items: action.payload.results.reverse(),
          count: action.payload.count,
          next: action.payload.next,
          page:
            Math.floor(action.payload.count / CHAT_MESSAGES_PAGINATION_LIMIT) +
            1,
          chatInfo: {
            patient: state.items.find(
              (item) => item.patient.id === action.payload.results[0].patient
            ).patient,
          },
        };
        break;
      case SET_SINGLE_CHAT_LOADING:
        draft.single = {
          ...state.single,
          loading: action.payload,
        };
        break;
      case SET_ALL_CHATS_INFO:
        draft.items = action.payload.results;
        draft.count = action.payload.count;
        draft.next = action.payload.next;
        draft.page =
          Math.floor(action.payload.count / ALL_CHATS_PAGINATION_LIMIT) + 1;
        break;
      case SET_ALL_CHATS_INFO_LOADING:
        draft.loading = action.payload;
        break;
      case ADD_MORE_TO_SINGLE_CHAT:
        draft.single = {
          ...state.single,
          items: [...action.payload.results.reverse(), ...state.single.items],
          count: action.payload.count,
          next: action.payload.next,
          page:
            Math.floor(action.payload.count / CHAT_MESSAGES_PAGINATION_LIMIT) +
            1,
        };
        break;
      case ADD_MORE_TO_ALL_CHATS_INFO:
        draft.items = [...state.items, ...action.payload.results];
        draft.count = action.payload.count;
        draft.next = action.payload.next;
        draft.page =
          Math.floor(action.payload.count / ALL_CHATS_PAGINATION_LIMIT) + 1;
        break;
      case SET_CONVERSATION_TO_READ:
        draft.items = state.items.map((item) =>
          item.patient.id === action.payload
            ? {
                patient: item.patient,
                last_message: {
                  ...item.last_message,
                  status: MESSAGE_STATUS.READ,
                },
              }
            : item
        );
        break;
      case TOGGLE_RASA_ACTIVITY:
        draft.items = state.items.map((item) => {
          return item.patient.id === action.payload
            ? {
                patient: {
                  ...item.patient,
                  is_rasa_paused: !item.patient.is_rasa_paused,
                },
                last_message: item.last_message,
              }
            : item;
        });
        break;
    }
  });

export default chats;
