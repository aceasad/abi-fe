import React from 'react';
import InnerAppLayout from 'layouts/inner-app-layout';
import ChatContent from './ChatContent';
import ChatMenu from './ChatMenu';
import { Button, PageHeader } from 'antd';
import { useIntl } from 'react-intl';
import messages from './messages';

const Chat = (props) => {
  const { formatMessage } = useIntl();
  return (
    <>
      <PageHeader
        className="p-0 mb-4"
        title={formatMessage(messages.conversationsTitle)}
        extra={[
          <Button type="primary">
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
