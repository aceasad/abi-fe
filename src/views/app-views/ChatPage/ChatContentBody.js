import { Avatar, Divider, Tooltip } from 'antd';
import { WarningOutlined } from '@ant-design/icons';
import { MESSAGE_TYPE, MESSAGE_ROLE } from 'constants/ChatConstants';
import React, { useRef, useEffect } from 'react';
import {
  formatMessagesTimestampMinutes,
  shouldRenderChatListItem,
  singleChatMessageStyle,
} from 'utils/helpers';

const FAILED_STATUSES = new Set(['FAILED', 'FLOOD_ERROR']);

const ROLE_LABELS = {
  [MESSAGE_ROLE.ASA]: 'Asa',
  [MESSAGE_ROLE.SYSTEM]: 'System',
  [MESSAGE_ROLE.STAFF]: 'Staff',
  [MESSAGE_ROLE.PATIENT]: 'Patient',
};

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
    if (!message.text?.trim()) return null;

    const isFailed = FAILED_STATUSES.has(message.status);
    const failedLabel = message.status === 'FLOOD_ERROR' ? 'Flood error' : 'Failed to deliver';
    const roleLabel = ROLE_LABELS[message.role];

    return (
      <div className="bubble" style={isFailed ? { opacity: 0.75 } : undefined}>
        <div className="bubble-wrapper">
          {roleLabel && (
            <div style={{ fontSize: 11, fontWeight: 600, opacity: 0.8, marginBottom: 2 }}>
              {roleLabel}
            </div>
          )}
          <span style={{ whiteSpace: 'pre-wrap' }}>{message.text}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end' }}>
          <span>{formatMessagesTimestampMinutes(message.created_at)}</span>
          {isFailed && (
            <Tooltip title={failedLabel}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 3,
                color: '#ff4d4f',
                fontSize: 11,
                fontWeight: 500,
              }}>
                <WarningOutlined style={{ fontSize: 11 }} />
                Failed
              </span>
            </Tooltip>
          )}
        </div>
      </div>
    );
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
