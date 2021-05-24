import {
  ADD_MORE_TO_ALL_CHATS_INFO,
  ADD_MORE_TO_SINGLE_CHAT,
  GET_ALL_CHATS_INFO,
  GET_MORE_CHATS_INFO,
  GET_MORE_SINGLE_CHAT_MESSAGES,
  GET_SINGLE_CHAT,
  SET_ALL_CHATS_INFO,
  SET_ALL_CHATS_INFO_LOADING,
  SET_SINGLE_CHAT,
  SET_SINGLE_CHAT_LOADING,
} from 'redux/constants/Chats';

export const getSingleChat = (payload) => ({
  type: GET_SINGLE_CHAT,
  payload,
});

export const setSingleChat = (payload) => ({
  type: SET_SINGLE_CHAT,
  payload,
});

export const getAllChatsInfo = (payload) => ({
  type: GET_ALL_CHATS_INFO,
  payload,
});

export const setAllChatsInfo = (payload) => ({
  type: SET_ALL_CHATS_INFO,
  payload,
});

export const setSingleChatLoading = (payload) => ({
  type: SET_SINGLE_CHAT_LOADING,
  payload,
});

export const setAllChatsInfoLoading = (payload) => ({
  type: SET_ALL_CHATS_INFO_LOADING,
  payload,
});

export const addMoreToAllChatsInfo = (payload) => ({
  type: ADD_MORE_TO_ALL_CHATS_INFO,
  payload,
});

export const addMoreToSingleChat = (payload) => ({
  type: ADD_MORE_TO_SINGLE_CHAT,
  payload,
});

export const getMoreChatsInfo = () => ({
  type: GET_MORE_CHATS_INFO,
});

export const getMoreSingleChatMessages = (payload) => ({
  type: GET_MORE_SINGLE_CHAT_MESSAGES,
  payload,
});
