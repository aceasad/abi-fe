import { Typography, Grid } from 'antd';
import { PageHeader } from '@ant-design/pro-components';
import InnerAppLayout from 'layouts/inner-app-layout';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import ChatContent from './ChatContent';
import ChatMenu from './ChatMenu';
import messages from './messages';
import { useDispatch, useSelector } from 'react-redux';
import { makeSelectLoginDetails } from 'redux/selectors/Auth';
import { createWebsocketUrl, parseReceivedEvent } from 'utils/helpers';
import { addOneMessage, resetChats } from 'redux/actions/Chats';
import WebSocketClient from 'services/WebSocketClient';
import authService from 'services/AuthService';
import { useMarkConversationAsRead } from 'queries/shared';
import { MESSAGE_STATUS } from 'constants/ChatConstants';
import { API_BASE_URL } from 'configs/AppConfig';
import utils from 'utils';

const { useBreakpoint } = Grid;

const Chat = () => {
  const { formatMessage } = useIntl();

  const { token } = useSelector(makeSelectLoginDetails());

  const { triggerSearchConversations } = useSelector((state) => state.chats);

  const dispatch = useDispatch();

  const { mutate } = useMarkConversationAsRead();

  const screens = utils.getBreakPoint(useBreakpoint());
  const isMobile = !screens.includes('lg');

  const handleReceiveMessage = (event) => {
    const parsedMessage = parseReceivedEvent(event);
    dispatch(addOneMessage(parsedMessage));
    if (
      parsedMessage.is_answer === 0 &&
      parsedMessage.status === MESSAGE_STATUS.SENT
    ) {
      mutate(parsedMessage.patient.id);
    }
  };

  useEffect(() => {
    WebSocketClient.isComponentMounted = true;
    return () => {
      WebSocketClient.isComponentMounted = false;
      WebSocketClient.closeConnection();
      dispatch(resetChats());
    };
  }, []);

  useEffect(() => {
    if (!token) return undefined;
    let cancelled = false;
    WebSocketClient.connect({
      getUrl: async () => {
        if (cancelled) return '';
        await authService.ensureFreshAccessTokenForSocket();
        const fresh = authService.getToken();
        if (!fresh?.access) throw new Error('Missing access token');
        return createWebsocketUrl(fresh);
      },
      onopen: () => {},
      onmessage: handleReceiveMessage,
    });
    WebSocketClient.waitForConnection();
    return () => {
      cancelled = true;
      // Do not call closeConnection here: the mount effect cleanup already closes once
      // on unmount. A second close would bump _connectGen twice and kill the next page’s
      // socket before onopen. Token changes are handled by connect() replacing the socket.
    };
  }, [token]);

  const [rasaHealthy, setRasaHealthy] = useState('');

  useEffect(() => {
    fetch(`${API_BASE_URL}/errors/rasa-health/`)
      .then((res) => setRasaHealthy(res.ok))
      .catch(() => setRasaHealthy(false));
  }, []);

  return (
    <>
      <PageHeader
        className="p-0 mb-4"
        title={
          isMobile ? (
            <Typography.Title level={3} className="mb-0" style={{ fontSize: '20px' }}>
              {`${formatMessage(messages.conversationsTitle)}${!rasaHealthy
                ? ': Communication with Asa AI is down for maintenance'
                : ''
                }`}
            </Typography.Title>
          ) : (
            ''
          )
        }
      />
      <div className="chat">
        <InnerAppLayout
          sideContent={
            <ChatMenu triggerSearchConversations={triggerSearchConversations} />
          }
          mainContent={<ChatContent />}
          sideContentWidth={450}
          sideContentGutter={true}
          border
        />
      </div>
    </>
  );
};

export default React.memo(Chat);
