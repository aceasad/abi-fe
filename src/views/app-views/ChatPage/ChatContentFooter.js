import { ArrowUpOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import React, { useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import { makeSelectSingleChatInfo } from 'redux/selectors/Chats';
import WebSocketClient from 'services/WebSocketClient';

const { TextArea } = Input;

const ChatContentFooter = ({ onSend }) => {
  const [form] = Form.useForm();
  const { name } = useSelector(state => state.auth.user);

  const handleSend = (values) => {
    const messageText = values?.newMessage?.trim();
    if (!messageText) {
      return;
    }

    const shouldStampUserName =
      !!chatInfo?.patient?.is_rasa_paused;
    const finalMessage = shouldStampUserName && name
      ? `${messageText} - ${name}`
      : messageText;

    form.resetFields(['newMessage']);
    onSend({ ...values, newMessage: finalMessage });
    textAreaRef.current.focus();
  };
  const textAreaRef = useRef(null);

  const { chatInfo } = useSelector(makeSelectSingleChatInfo);
  const isSocketOpen = WebSocketClient.isConnected();

  const generatePlaceholderText = (
    isSocketOpen,
    isRasaPaused
  ) => {
    if (!isRasaPaused) {
      return "Please pause Asa to send a message";
    } else if (!isSocketOpen) {
      return "Reconnecting...";
    } else {
      return "Type a message...";
    }
  };

  const isDisabled = useMemo(() => {
    return (
      !chatInfo?.patient?.is_rasa_paused ||
      !isSocketOpen
    );
  }, [chatInfo, isSocketOpen]);

  return (
    <div className="chat-content-footer">
      <Form form={form} name="msgInput" onFinish={handleSend} className="w-100">
        <Form.Item name="newMessage" className="mb-0">
          <TextArea
            className="chat-message-input"
            autoComplete="off"
            placeholder={generatePlaceholderText(
              isSocketOpen,
              chatInfo?.patient?.is_rasa_paused
            )}
            disabled={isDisabled}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                form.submit();
              }
            }}
            ref={textAreaRef}
          />
        </Form.Item>
        <Button
          className="chat-send-button"
          type="primary"
          onClick={onSend}
          htmlType="submit"
          disabled={isDisabled}
        >
          <ArrowUpOutlined style={{ fontSize: 19 }} />
        </Button>
      </Form>
    </div>
  );
};

export default ChatContentFooter;
