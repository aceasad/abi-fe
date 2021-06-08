import { SendOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import React from 'react';
import { useIntl } from 'react-intl';
import messages from './messages';
import { useSelector } from 'react-redux';
import { makeSelectSingleChatInfo } from 'redux/selectors/Chats';

const ChatContentFooter = ({ onSend, isSocketOpen }) => {
  const { formatMessage } = useIntl();
  const [form] = Form.useForm();
  const handleSend = (values) => {
    form.resetFields(['newMessage']);
    onSend(values);
  };

  const { isSendEnabled } = useSelector(makeSelectSingleChatInfo);

  return (
    <div className="chat-content-footer">
      <Form form={form} name="msgInput" onFinish={handleSend} className="w-100">
        <Form.Item name="newMessage" className="mb-0">
          <Input
            autoComplete="off"
            placeholder={formatMessage(messages.typeAMessagePlaceholder)}
            disabled={!(isSocketOpen && !!isSendEnabled)}
            suffix={
              <div className="d-flex align-items-center">
                <Button
                  shape="circle"
                  type="primary"
                  size="small"
                  onClick={onSend}
                  htmlType="submit"
                  disabled={!(isSocketOpen && !!isSendEnabled)}
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
