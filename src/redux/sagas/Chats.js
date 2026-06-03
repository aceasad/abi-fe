import { ALL_CHATS_PAGINATION_LIMIT } from 'constants/ApiConstant';
import { CHAT_FILTERS } from 'constants/ChatConstants';
import { all, call, fork, put, select, takeEvery } from 'redux-saga/effects';
import {
  addMoreToAllChatsInfo,
  addMoreToSingleChat,
  setAllChatsInfo,
  setAllChatsInfoLoading,
  clearSingleChatMessages,
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
  makeSelectChatsPageSize,
  makeSelectSingleChatInfo,
  makeSelectSingleChatRequestData,
} from 'redux/selectors/Chats';
import chatService from 'services/ChatService';

export function* getSingleChat({ payload }) {
  try {
    if (!payload.patientId || isNaN(payload.patientId) || payload.patientId <= 0) {
      console.warn('Invalid patientId provided to getSingleChat:', payload.patientId);
      return;
    }

    yield put(setSingleChatLoading(true));
    yield put(clearSingleChatMessages());
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

    if (!chatInfo?.patient?.id || isNaN(chatInfo.patient.id) || chatInfo.patient.id <= 0) {
      console.warn('Invalid patient.id provided to getMoreSingleChatMessages:', chatInfo?.patient?.id);
      return;
    }

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
    const pageSize =
      (yield select(makeSelectChatsPageSize)) || ALL_CHATS_PAGINATION_LIMIT;
    const filter =
      typeof payload === 'string' ? payload : payload?.filter ?? CHAT_FILTERS.ALL;
    const { data } = yield call(
      chatService.getAllChatInformation,
      0,
      pageSize,
      filter
    );
    yield put(setAllChatsInfo(data));
  } catch (err) {
  } finally {
    yield put(setAllChatsInfoLoading(false));
  }
}

export function* getMoreChatsInfo({ payload }) {
  try {
    yield put(setAllChatsInfoLoading(true));
    const { offset, pageSize } = yield select(
      makeSelectAllChatsInfoRequestData
    );
    const limit = pageSize || ALL_CHATS_PAGINATION_LIMIT;
    const filter = payload?.filter ?? CHAT_FILTERS.ALL;
    const query = payload?.query?.trim();
    const { data } = query
      ? yield call(
          chatService.searchConversations,
          { query, filter, offset },
          limit
        )
      : yield call(chatService.getAllChatInformation, offset, limit, filter);
    yield put(addMoreToAllChatsInfo(data));
  } catch (err) {
  } finally {
    yield put(setAllChatsInfoLoading(false));
  }
}

export function* searchConversations({ payload }) {
  try {
    yield put(setAllChatsInfoLoading(true));
    const hasQuery = !!(payload && payload.query && payload.query.trim());
    const pageSize =
      (yield select(makeSelectChatsPageSize)) || ALL_CHATS_PAGINATION_LIMIT;
    const { data } = hasQuery
      ? yield call(chatService.searchConversations, payload, pageSize)
      : yield call(
          chatService.getAllChatInformation,
          0,
          pageSize,
          payload?.filter ?? CHAT_FILTERS.ALL
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
