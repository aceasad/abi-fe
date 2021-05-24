import { createSelector } from 'reselect';
import reducers from '../reducers';

const selectChatsDomain = (state) => state.chats || reducers;

const makeSelectAllChatsInfoRequestData = () =>
  createSelector(selectChatsDomain, (substate) => ({
    next: substate.next,
    page: substate.page,
    count: substate.count,
  }));

const makeSelectSingleChatRequestData = () =>
  createSelector(selectChatsDomain, (substate) => ({
    next: substate.single.next,
    page: substate.single.page,
    count: substate.single.count,
  }));

const makeSelectAllChatsInfo = () =>
  createSelector(selectChatsDomain, (substate) => ({
    items: substate.items,
    loading: substate.loading,
    next: substate.next,
  }));

const makeSelectSingleChat = () =>
  createSelector(selectChatsDomain, (substate) => ({
    items: substate.single.items,
    loading: substate.single.loading,
  }));

const makeSelectSingleChatInfo = (patientId) =>
  createSelector(selectChatsDomain, (substate) => ({
    chatInfo: substate.items.find((item) => item.patient.id === patientId),
  }));

export {
  makeSelectAllChatsInfoRequestData,
  makeSelectSingleChatRequestData,
  makeSelectAllChatsInfo,
  makeSelectSingleChat,
  makeSelectSingleChatInfo,
};
