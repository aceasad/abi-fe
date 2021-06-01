import { Button, PageHeader } from 'antd';
import InnerAppLayout from 'layouts/inner-app-layout';
import React, { useMemo } from 'react';
import { useIntl } from 'react-intl';
import ChatContent from './ChatContent';
import ChatMenu from './ChatMenu';
import messages from './messages';
import { useSocket } from 'utils/hooks';
import { WS_CHAT_URL } from 'constants/ApiConstant';

const Chat = () => {
  const { formatMessage } = useIntl();

  const socket = useSocket({
    url: WS_CHAT_URL,
    onmessage: (e) => {
      // TO DO
      console.log(e);
    },
  });

  // TO-DO
  // ne razumem zasto moram sa useMemo
  // bez useMemo se ova komponenta rerenderuje svaki put kad promenim chat
  // a ne menjaju joj se props (NEMA PROPS!!)
  // takodje, parent komponenta od ove komponente (AppViews) se NE re-renderuje!!!
  // WTF
  return useMemo(
    () => (
      <>
        {console.log('index RERENDER')}
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
            mainContent={<ChatContent />}
            sideContentWidth={450}
            sideContentGutter={false}
            border
          />
        </div>
      </>
    ),
    []
  );
};

export default Chat;
