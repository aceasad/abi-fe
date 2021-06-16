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
import { updateChatMenuItems, updateConversation } from 'utils/helpers';

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
          items: action.payload.results.items.reverse(),
          count: action.payload.count,
          next: action.payload.next,
          page:
            Math.floor(action.payload.count / CHAT_MESSAGES_PAGINATION_LIMIT) +
            1,
          offset: action.payload.results.items.length,
          chatInfo: {
            patient: action.payload.results.items[0].patient,
            isSendEnabled: action.payload.results.is_conversation_enabled,
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
        draft.scrollDown = false;
        break;
      case SET_ALL_CHATS_INFO_LOADING:
        draft.loading = action.payload;
        break;
      case ADD_MORE_TO_SINGLE_CHAT:
        draft.single = {
          ...state.single,
          items: [
            ...action.payload.results.items.reverse(),
            ...state.single.items,
          ],
          count: action.payload.count,
          next: action.payload.next,
          page:
            Math.floor(action.payload.count / CHAT_MESSAGES_PAGINATION_LIMIT) +
            1,
          offset:
            action.payload.results.items.length + state.single.items.length,
          scrollDown: false,
        };
        break;
      case ADD_MORE_TO_ALL_CHATS_INFO:
        draft.items = [...state.items, ...action.payload.results];
        draft.count = action.payload.count;
        draft.next = action.payload.next;
        draft.page =
          Math.floor(action.payload.count / ALL_CHATS_PAGINATION_LIMIT) + 1;
        draft.offset = action.payload.results.length + state.offset;
        draft.scrollDown = true;
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
        draft.single = {
          ...state.single,
          chatInfo: {
            patient: {
              ...state.single.chatInfo.patient,
              is_rasa_paused: !state.single.chatInfo.patient.is_rasa_paused,
            },
          },
        };
        break;
      case ADD_ONE_MESSAGE: {
        const foundChat = state.items.find(
          (item) => item.patient.id === action.payload.patient.id
        );
        // conversation already in Redux Store
        if (foundChat) {
          // is this conversation active
          if (state.single.chatInfo.patient.id === foundChat.patient.id) {
            draft.single = updateConversation(state.single, action.payload);
            draft.items = updateChatMenuItems(
              foundChat,
              action.payload,
              state.items,
              true
            );
            // if conversation is not active
          } else {
            draft.items = updateChatMenuItems(
              foundChat,
              action.payload,
              state.items,
              false
            );
          }
          // Conversation is not in redux yet --> create new conversation
        } else {
          draft.items = updateChatMenuItems(null, action.payload, state.items);
          draft.count = state.count + 1;
          draft.offset = state.offset + 1;
        }
        break;
      }
    }
  });

export default chats;
