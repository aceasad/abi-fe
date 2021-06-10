import { createSelector } from 'reselect';
import reducers from '../reducers';

const selectChatsDomain = (state) => state.chats || reducers;

const makeSelectAllChatsInfoRequestData = createSelector(
  selectChatsDomain,
  (substate) => ({
    next: substate.next,
    page: substate.page,
    count: substate.count,
    offset: substate.offset,
  })
);

const makeSelectSingleChatRequestData = createSelector(
  selectChatsDomain,
  (substate) => ({
    next: substate.single.next,
    page: substate.single.page,
    count: substate.single.count,
    offset: substate.single.offset,
  })
);

const makeSelectAllChatsInfo = createSelector(
  selectChatsDomain,
  (substate) => ({
    items: substate.items,
    loading: substate.loading,
    next: substate.next,
    scrollDown: substate.scrollDown,
  })
);

const makeSelectSingleChat = createSelector(selectChatsDomain, (substate) => ({
  items: substate.single.items,
  loading: substate.single.loading,
  next: substate.single.next,
  scrollDown: substate.single.scrollDown,
}));

const makeSelectSingleChatInfo = createSelector(
  selectChatsDomain,
  (substate) => ({
    chatInfo: substate.single.chatInfo,
  })
);

export {
  makeSelectAllChatsInfoRequestData,
  makeSelectSingleChatRequestData,
  makeSelectAllChatsInfo,
  makeSelectSingleChat,
  makeSelectSingleChatInfo,
};
