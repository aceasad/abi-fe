import { SendOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import React, { useMemo } from 'react';
import { useIntl } from 'react-intl';
import messages from './messages';
import { useSelector } from 'react-redux';
import { makeSelectSingleChatInfo } from 'redux/selectors/Chats';
import WebSocketClient from 'services/WebSocketClient';

const ChatContentFooter = ({ onSend }) => {
  const { formatMessage } = useIntl();
  const [form] = Form.useForm();
  const handleSend = (values) => {
    form.resetFields(['newMessage']);
    onSend(values);
  };

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
          <Input
            autoComplete="off"
            placeholder={generatePlaceholderText(
              isSocketOpen,
              !!chatInfo?.isSendEnabled,
              chatInfo?.patient.is_rasa_paused
            )}
            disabled={isDisabled}
            suffix={
              <div className="d-flex align-items-center">
                <Button
                  shape="circle"
                  type="primary"
                  size="small"
                  onClick={onSend}
                  htmlType="submit"
                  disabled={isDisabled}
                >
                  <SendOutlined />
                </Button>
              </div>
            }
          />
        </Form.Item>
      </Form>
    </div>
  );
};

export default ChatContentFooter;
