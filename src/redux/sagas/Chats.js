import { all, call, fork, put, select, takeEvery } from 'redux-saga/effects';
import {
  addMoreToAllChatsInfo,
  addMoreToSingleChat,
  setAllChatsInfo,
  setAllChatsInfoLoading,
  setSingleChat,
  setSingleChatLoading,
  setConversationToRead,
} from 'redux/actions/Chats';
import {
  GET_ALL_CHATS_INFO,
  GET_MORE_CHATS_INFO,
  GET_MORE_SINGLE_CHAT_MESSAGES,
  GET_SINGLE_CHAT,
  SEARCH_CONVERSATIONS,
  SET_CONVERSATION_TO_READ,
} from 'redux/constants/Chats';
import {
  makeSelectAllChatsInfoRequestData,
  makeSelectSingleChatRequestData,
} from 'redux/selectors/Chats';
import chatService from 'services/ChatService';

export function* getSingleChat({ payload }) {
  try {
    yield put(setSingleChatLoading(true));
    const { data } = yield call(chatService.getSingleChat, payload.patientId);
    yield put(setSingleChat(data));
    yield call(payload.afterEffect);
  } catch (err) {
  } finally {
    yield put(setSingleChatLoading(false));
  }
}

export function* getMoreSingleChatMessages({ payload }) {
  try {
    yield put(setSingleChatLoading(true));
    const { next } = yield select(makeSelectSingleChatRequestData());
    if (next) {
      const { data } = yield call(
        chatService.getSingleChat,
        payload.patientId,
        next
      );
      yield put(addMoreToSingleChat(data));
    }
  } catch (err) {
  } finally {
    yield put(setSingleChatLoading(false));
  }
}

export function* getAllChatsInfo() {
  try {
    yield put(setAllChatsInfoLoading(true));
    const { data } = yield call(chatService.getAllChatInformation);
    yield put(setAllChatsInfo(data));
  } catch (err) {
  } finally {
    yield put(setAllChatsInfoLoading(false));
  }
}

export function* getMoreChatsInfo() {
  try {
    yield put(setAllChatsInfoLoading(true));
    const { next } = yield select(makeSelectAllChatsInfoRequestData());
    if (next) {
      const { data } = yield call(chatService.getAllChatInformation, next);
      yield put(addMoreToAllChatsInfo(data));
    }
  } catch (err) {
  } finally {
    yield put(setAllChatsInfoLoading(false));
  }
}

export function* searchConversations({ payload }) {
  try {
    yield put(setAllChatsInfoLoading(true));
    const { data } = yield call(
      payload
        ? chatService.searchConversations
        : chatService.getAllChatInformation,
      payload
    );
    yield put(setAllChatsInfo(data));
  } catch {
  } finally {
    yield put(setAllChatsInfoLoading(false));
  }
}

export function* setConversationMessagesRead({ payload }) {
  try {
    yield call(chatService.markConversationAsRead, payload);
  } catch {
  } finally {
  }
}

export function* chatsSaga() {
  yield takeEvery(GET_SINGLE_CHAT, getSingleChat);
  yield takeEvery(GET_ALL_CHATS_INFO, getAllChatsInfo);
  yield takeEvery(GET_MORE_CHATS_INFO, getMoreChatsInfo);
  yield takeEvery(GET_MORE_SINGLE_CHAT_MESSAGES, getMoreSingleChatMessages);
  yield takeEvery(SET_CONVERSATION_TO_READ, setConversationMessagesRead);
  yield takeEvery(SEARCH_CONVERSATIONS, searchConversations);
}

export default function* rootSaga() {
  yield all([fork(chatsSaga)]);
}
