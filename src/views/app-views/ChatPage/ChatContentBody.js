import { Avatar, Divider } from 'antd';
import { MESSAGE_TYPE } from 'constants/ChatConstants';
import React from 'react';
import {
  formatMessagesTimestampMinutes,
  singleChatMessageStyle,
} from 'utils/helpers';

const ChatContentBody = ({ messages, patientPicture }) => {
  const renderMessageContent = (message) => {
    return message.text ? (
      <div className={`bubble`}>
        <div className="bubble-wrapper">
          <span style={{ whiteSpace: 'pre-wrap' }}>{message.text}</span>
        </div>
        <span>{formatMessagesTimestampMinutes(message.created_at)}</span>
      </div>
    ) : null;
  };
  const renderSingleMessage = (message) => {
    if (message?.type === MESSAGE_TYPE.DIVIDER) {
      return <Divider>{message.created_at}</Divider>;
    } else {
      return message.is_answer ? null : (
        <div className="mr-2">
          <Avatar src={patientPicture} />
        </div>
      );
    }
  };
  return messages.map((message, index) => (
    <div
      key={`msg-${message.id}-${index}`}
      className={singleChatMessageStyle(message)}
    >
      {renderSingleMessage(message)}
      {renderMessageContent(message)}
    </div>
  ));
};

export default ChatContentBody;
