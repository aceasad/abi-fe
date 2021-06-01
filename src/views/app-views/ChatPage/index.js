import { Button, PageHeader } from 'antd';
import InnerAppLayout from 'layouts/inner-app-layout';
import React, { useMemo } from 'react';
import { useIntl } from 'react-intl';
import ChatContent from './ChatContent';
import ChatMenu from './ChatMenu';
import messages from './messages';
import { useSocket } from 'utils/hooks';
import { useDispatch, useSelector } from 'react-redux';
import { makeSelectLoginDetails } from 'redux/selectors/Auth';
import { createWebsocketUrl, parseReceivedEvent } from 'utils/helpers';
import { addOneMessage } from 'redux/actions/Chats';

const Chat = () => {
  const { formatMessage } = useIntl();

  const { token } = useSelector(makeSelectLoginDetails());

  const dispatch = useDispatch();

  const socketUrl = createWebsocketUrl(token);

  const handleReceiveMessage = (event) => {
    const parsedMessage = parseReceivedEvent(event);
    dispatch(addOneMessage(parsedMessage));
  };

  const [socket, socketOpen] = useSocket({
    url: socketUrl,
    onmessage: (e) => {
      handleReceiveMessage(e);
    },
    onopen: (e) => {
      console.log('open');
    },
  });

  // TO-DO
  // ne razumem zasto moram sa useMemo
  // bez useMemo se ova komponenta rerenderuje svaki put kad promenim chat
  // a ne menjaju joj se props (NEMA PROPS!!)
  // takodje, parent komponenta od ove komponente (AppViews) se NE re-renderuje!!!
  // WTF
  return (
    <>
      <PageHeader
        className="p-0 mb-4"
        title={formatMessage(messages.conversationsTitle)}
        extra={[
          <Button type="primary" key="mass-invites-button">
            {formatMessage(messages.conversationsMassInvites)}
          </Button>,
        ]}
      />

      <div className="chat">
        <InnerAppLayout
          sideContent={<ChatMenu />}
          mainContent={
            <ChatContent socket={socket} isSocketOpen={socketOpen} />
          }
          sideContentWidth={450}
          sideContentGutter={false}
          border
        />
      </div>
    </>
  );
};

export default Chat;
