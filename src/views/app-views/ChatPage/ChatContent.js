import { URL_PREFIX_PATH } from 'configs/AppConfig';
import React, { useMemo } from 'react';
import { Route, Switch, useRouteMatch, useHistory } from 'react-router-dom';
import Conversation from './Conversation';
import { useSelector } from 'react-redux';
import { makeSelectAllChatsInfo } from 'redux/selectors/Chats';

const ChatContent = () => {
  const match = useRouteMatch();
  const history = useHistory();
  const { items } = useSelector(makeSelectAllChatsInfo);

  // If no conversation is selected and we have conversations, redirect to the first one
  React.useEffect(() => {
    if (match.isExact && items.length > 0) {
      history.replace(`${match.url}/${items[0].patient.id}`);
    }
  }, [match.isExact, items, history, match.url]);

  return useMemo(
    () => (
      <Switch>
        <Route path={`${match.url}/:id`} component={Conversation} />
        <Route path={`${match.url}`} component={Conversation} />
      </Switch>
    ),
    [match]
  );
};

export default ChatContent;