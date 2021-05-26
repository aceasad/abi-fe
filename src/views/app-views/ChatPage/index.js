import React, { useEffect } from 'react';
import InnerAppLayout from 'layouts/inner-app-layout';
import ChatContent from './ChatContent';
import ChatMenu from './ChatMenu';
import { Button, PageHeader } from 'antd';
import { useIntl } from 'react-intl';
import messages from './messages';
import { useDispatch, useSelector } from 'react-redux';
import { makeSelectAllChatsInfo } from 'redux/selectors/Chats';
import { getAllChatsInfo } from 'redux/actions/Chats';
import Loading from 'components/shared-components/Loading';

const Chat = (props) => {
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllChatsInfo());
  }, []);

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
          sideContent={<ChatMenu {...props} />}
          mainContent={<ChatContent {...props} />}
          sideContentWidth={450}
          sideContentGutter={false}
          border
        />
      </div>
    </>
  );
};

export default Chat;
