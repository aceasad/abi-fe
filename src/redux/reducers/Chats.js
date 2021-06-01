import produce from 'immer';
import { chatBaseState } from 'constants/ChatConstants';
import {
  ADD_MORE_TO_ALL_CHATS_INFO,
  ADD_MORE_TO_SINGLE_CHAT,
  ADD_ONE_MESSAGE,
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
  ...chatBaseState,
  single: (({ single, ...rest }) => rest)({ ...chatBaseState, chatInfo: null }),
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
          offset: action.payload.results.length,
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
        draft.offset = action.payload.results.length;
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
      case ADD_ONE_MESSAGE: {
        const foundChat = state.items.find(
          (item) => item.patient.id === action.payload.patient.id
        );
        // conversation already in REDUX
        if (foundChat) {
          // is this conversation active
          if (state.single.chatInfo.patient.id === foundChat.patient.id) {
            draft.single = {
              ...state.single,
              items: [...state.single.items, action.payload],
              count: state.single.count + 1,
              page: 1,
              next: null,
              offset: state.single.offset + 1,
            };
            // DISPATCHUJ AKCIJU DA SETUJE STATUS PORUKE NA 'READ' i UPDATE-UJ TO U last_message da ne bi izlazio indikator za unread

            // if conversation is not active
          } else {
            draft.items = [
              {
                patient: foundChat.patient,
                last_message: {
                  id: action.payload.id,
                  text: action.payload.text,
                  created_at: action.payload.created_at,
                  status: action.payload.status,
                  is_answer: action.payload.is_answer,
                },
              },
              ...state.items.filter(
                (item) => item.patient.id !== foundChat.patient.id
              ),
            ];
          }
          // Conversation is not in redux yet --> create new conversation
        } else {
          draft.items = [
            {
              patient: action.payload.patient,
              last_message: {
                id: action.payload.id,
                text: action.payload.text,
                created_at: action.payload.created_at,
                status: action.payload.status,
                is_answer: action.payload.is_answer,
              },
            },
            ...state.items,
          ];
        }
        break;
      }
    }
  });

export default chats;
