import { SendOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import React, { useMemo, useRef } from 'react';
import { useIntl } from 'react-intl';
import messages from './messages';
import { useSelector } from 'react-redux';
import { makeSelectSingleChatInfo } from 'redux/selectors/Chats';
import WebSocketClient from 'services/WebSocketClient';

const { TextArea } = Input;

const ChatContentFooter = ({ onSend }) => {
  const { formatMessage } = useIntl();
  const [form] = Form.useForm();
  const { name } = useSelector(state => state.auth.user);

  const handleSend = (values) => {
    form.resetFields(['newMessage']);
    values['newMessage'] = values['newMessage'] + ' - ' + name
    onSend(values);
    textAreaRef.current.focus();
  };
  const textAreaRef = useRef(null);

  const { chatInfo } = useSelector(makeSelectSingleChatInfo);
  const isSocketOpen = WebSocketClient.isConnected();

  const generatePlaceholderText = (
    isSocketOpen,
    isSendEnabled,
    isRasaPaused
  ) => {
    if (!isRasaPaused) {
      return formatMessage(messages.pauseRasaPlaceholder);
    } else if (!(isSocketOpen && !!isSendEnabled)) {
      return formatMessage(messages.chatDisabledPlaceholder);
    } else {
      return formatMessage(messages.typeAMessagePlaceholder);
    }
  };

  const isDisabled = useMemo(() => {
    return (
      !chatInfo?.patient.is_rasa_paused ||
      !(isSocketOpen && !!chatInfo?.isSendEnabled)
    );
  }, [chatInfo, isSocketOpen]);

  return (
    <div className="chat-content-footer">
      <Form form={form} name="msgInput" onFinish={handleSend} className="w-100">
        <Form.Item name="newMessage" className="mb-0">
          <TextArea
            autoComplete="off"
            placeholder={generatePlaceholderText(
              isSocketOpen,
              !!chatInfo?.isSendEnabled,
              chatInfo?.patient.is_rasa_paused
            )}
            disabled={isDisabled}
            style={{
              height: '100px',
              paddingRight: '50px',
            }}
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
          shape="circle"
          type="primary"
          size="small"
          onClick={onSend}
          htmlType="submit"
          disabled={isDisabled}
          style={{
            position: 'absolute',
            right: '100px',
            bottom: '70px',
          }}
        >
          <SendOutlined />
        </Button>
      </Form>
    </div>
  );
};

export default ChatContentFooter;
