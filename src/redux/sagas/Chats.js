import { ALL_CHATS_PAGINATION_LIMIT } from 'constants/ApiConstant';
import { all, call, fork, put, select, takeEvery } from 'redux-saga/effects';
import {
  addMoreToAllChatsInfo,
  addMoreToSingleChat,
  setAllChatsInfo,
  setAllChatsInfoLoading,
  setSingleChat,
  setSingleChatLoading,
} from 'redux/actions/Chats';
import {
  GET_ALL_CHATS_INFO,
  GET_MORE_CHATS_INFO,
  GET_MORE_SINGLE_CHAT_MESSAGES,
  GET_SINGLE_CHAT,
  SEARCH_CONVERSATIONS,
  SEND_MASS_INVITE,
} from 'redux/constants/Chats';
import {
  makeSelectAllChatsInfoRequestData,
  makeSelectSingleChatInfo,
  makeSelectSingleChatRequestData,
} from 'redux/selectors/Chats';
import chatService from 'services/ChatService';

export function* getSingleChat({ payload }) {
  try {
    yield put(setSingleChatLoading(true));
    const { data } = yield call(chatService.getSingleChat, payload.patientId);
    yield put(setSingleChat(data));
  } catch (err) {
  } finally {
    yield put(setSingleChatLoading(false));
  }
}

export function* getMoreSingleChatMessages() {
  try {
    yield put(setSingleChatLoading(true));
    const { offset } = yield select(makeSelectSingleChatRequestData);
    const { chatInfo } = yield select(makeSelectSingleChatInfo);
    const { data } = yield call(
      chatService.getSingleChat,
      chatInfo.patient.id,
      offset
    );
    yield put(addMoreToSingleChat(data));
  } catch (err) {
  } finally {
    yield put(setSingleChatLoading(false));
  }
}

export function* getAllChatsInfo({ payload }) {
  try {
    yield put(setAllChatsInfoLoading(true));
    const { data } = yield call(
      chatService.getAllChatInformation,
      0,
      ALL_CHATS_PAGINATION_LIMIT,
      payload
    );
    yield put(setAllChatsInfo(data));
  } catch (err) {
  } finally {
    yield put(setAllChatsInfoLoading(false));
  }
}

export function* getMoreChatsInfo() {
  try {
    yield put(setAllChatsInfoLoading(true));
    const { offset } = yield select(makeSelectAllChatsInfoRequestData);
    const { data } = yield call(chatService.getAllChatInformation, offset);
    yield put(addMoreToAllChatsInfo(data));
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

export function* sendMassInvite({ payload }) {
  try {
    yield call(chatService.sendMassInvite, payload);
  } catch {
  } finally {
  }
}

export function* chatsSaga() {
  yield takeEvery(GET_SINGLE_CHAT, getSingleChat);
  yield takeEvery(GET_ALL_CHATS_INFO, getAllChatsInfo);
  yield takeEvery(GET_MORE_CHATS_INFO, getMoreChatsInfo);
  yield takeEvery(GET_MORE_SINGLE_CHAT_MESSAGES, getMoreSingleChatMessages);
  yield takeEvery(SEARCH_CONVERSATIONS, searchConversations);
  yield takeEvery(SEND_MASS_INVITE, sendMassInvite);
}

export default function* rootSaga() {
  yield all([fork(chatsSaga)]);
}
