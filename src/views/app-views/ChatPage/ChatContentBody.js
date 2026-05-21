import { Avatar, Divider } from 'antd';
import { MESSAGE_TYPE } from 'constants/ChatConstants';
import React, { useRef, useEffect } from 'react';
import {
  formatMessagesTimestampMinutes,
  shouldRenderChatListItem,
  singleChatMessageStyle,
} from 'utils/helpers';

const ChatContentBody = ({
  messages: chatMessages,
  patientPicture,
}) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, []);

  const renderMessageContent = (message) => {
    return message.text?.trim() ? (
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

  return (
    <div>
      {chatMessages.filter(shouldRenderChatListItem).map((message) => (
        <div
          key={`msg-${message.id || `${message.created_at}-${message.text || ''}-${message.type || ''}`}`}
          className={singleChatMessageStyle(message)}
        >
          {renderSingleMessage(message)}
          {renderMessageContent(message)}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatContentBody;
