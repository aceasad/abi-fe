import React, { useMemo } from 'react';
import { Route, Switch } from 'react-router-dom';
import Conversation from './Conversation';

const ConversationEmpty = () => (
  <div className="chat-content-empty">
    <div className="text-center">
      <img src="/img/others/img-11.png" alt="Start a Conversation" />
      <h1 className="font-weight-light">Start a conversation</h1>
    </div>
  </div>
);

const ChatContent = ({ socket, isSocketOpen }) => {
  const match = useRouteMatch();
  return useMemo(
    () => (
      <Switch>
        <Route
          path={`${match.url}/:id`}
          component={() => (
            <Conversation socket={socket} isSocketOpen={isSocketOpen} />
          )}
        />
        <Route path={`${match.url}`} component={ConversationEmpty} />
      </Switch>
    ),
    [match, isSocketOpen]
  );
};

export default ChatContent;
