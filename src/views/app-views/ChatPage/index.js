import { Button, PageHeader } from 'antd';
import InnerAppLayout from 'layouts/inner-app-layout';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import ChatContent from './ChatContent';
import ChatMenu from './ChatMenu';
import messages from './messages';
import { useSocket } from 'utils/hooks';
import { useDispatch, useSelector } from 'react-redux';
import { makeSelectLoginDetails } from 'redux/selectors/Auth';
import { createWebsocketUrl, parseReceivedEvent } from 'utils/helpers';
import { addOneMessage } from 'redux/actions/Chats';
import MassInviteModal from './MassInviteModal';
import WebSocketClient from 'services/WebSocketClient';

const Chat = () => {
  const { formatMessage } = useIntl();

  const { token } = useSelector(makeSelectLoginDetails());

  const dispatch = useDispatch();

  const handleReceiveMessage = (event) => {
    const parsedMessage = parseReceivedEvent(event);
    dispatch(addOneMessage(parsedMessage));
  };

  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    WebSocketClient.isComponentMounted = true;
    return () => {
      WebSocketClient.isComponentMounted = false;
      WebSocketClient.closeConnection();
    };
  }, []);

  useEffect(() => {
    const socketUrl = createWebsocketUrl(token);
    if (token) {
      WebSocketClient.connect(socketUrl, () => {}, handleReceiveMessage);
      WebSocketClient.waitForConnection();
    }
  }, [token]);

  return (
    <>
      <PageHeader
        className="p-0 mb-4"
        title={formatMessage(messages.conversationsTitle)}
        extra={[
          <Button
            type="primary"
            key="mass-invites-button"
            onClick={() => setIsModalVisible(true)}
          >
            {formatMessage(messages.conversationsMassInvites)}
          </Button>,
        ]}
      />

      <div className="chat">
        <InnerAppLayout
          sideContent={<ChatMenu />}
          mainContent={<ChatContent />}
          sideContentWidth={450}
          sideContentGutter={false}
          border
        />
      </div>
      <MassInviteModal
        isModalVisible={isModalVisible}
        closeModal={setIsModalVisible}
      />
    </>
  );
};

export default Chat;
