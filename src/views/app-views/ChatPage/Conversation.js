import React, { useEffect, useRef, useState } from 'react';
import ChatData from 'assets/data/chat.data.json';
import { Avatar, Divider, Input, Form, Button, Menu } from 'antd';
import {
  FileOutlined,
  SendOutlined,
  PaperClipOutlined,
  SmileOutlined,
  AudioMutedOutlined,
  UserOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { Scrollbars } from 'react-custom-scrollbars';
import Flex from 'components/shared-components/Flex';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import { MESSAGE_TYPE, MESSAGE_FROM } from 'constants/ChatConstants';
import { useIntl } from 'react-intl';
import messages from './messages';
import { useParams } from 'react-router-dom';

const Conversation = () => {
  const formRef = useRef();
  const chatBodyRef = useRef();
  const params = useParams();

  const id = parseInt(params.id);
  const [info, setInfo] = useState({});
  const [msgList, setMsgList] = useState([]);

  const { formatMessage } = useIntl();

  useEffect(() => {
    getConversation(id);
    scrollToBottom();
  }, [params.id]);

  const getConversation = (currentId) => {
    const data = ChatData.filter((chat) => chat.id === currentId);
    setInfo(data[0]);
    setMsgList(data[0].msg);
  };

  const getMsgType = (obj) => {
    switch (obj.msgType) {
      case MESSAGE_TYPE.TEXT:
        return <span>{obj.text}</span>;
      case MESSAGE_TYPE.IMAGE:
        return <img src={obj.text} alt={obj.text} />;
      case MESSAGE_TYPE.FILE:
        return (
          <Flex alignItems="center" className="msg-file">
            <FileOutlined className="font-size-md" />
            <span className="ml-2 font-weight-semibold text-link pointer">
              <u>{obj.text}</u>
            </span>
          </Flex>
        );
      default:
        return null;
    }
  };

  const scrollToBottom = () => {
    chatBodyRef.current.scrollToBottom();
  };

  const onSend = (values) => {
    if (values.newMsg) {
      const newMsgData = {
        avatar: '',
        from: MESSAGE_FROM.ME,
        msgType: MESSAGE_TYPE.TEXT,
        text: values.newMsg,
        time: '',
      };
      formRef.current.setFieldsValue({
        newMsg: '',
      });
      setMsgList([...msgList, newMsgData]);
    }
  };

  const emptyClick = (e) => {
    e.preventDefault();
  };

  const chatContentHeader = (name) => (
    <div className="chat-content-header">
      <h4 className="mb-0">{name}</h4>
      <div>
        <EllipsisDropdown menu={renderMenu} />
      </div>
    </div>
  );

  const chatContentBody = (messages, id) => (
    <div className="chat-content-body">
      <Scrollbars ref={chatBodyRef} autoHide>
        {messages.map((message, i) => (
          <div
            key={`msg-${id}-${i}`}
            className={`msg ${
              message.msgType === MESSAGE_TYPE.DATE ? 'datetime' : ''
            } ${
              message.from === MESSAGE_FROM.OPPOSITE
                ? 'msg-recipient'
                : message.from === MESSAGE_FROM.ME
                ? 'msg-sent'
                : ''
            }`}
          >
            {message.avatar ? (
              <div className="mr-2">
                <Avatar src={message.avatar} />
              </div>
            ) : null}
            {message.text ? (
              <div className={`bubble ${!message.avatar ? 'ml-5' : ''}`}>
                <div className="bubble-wrapper">{getMsgType(message)}</div>
              </div>
            ) : null}
            {message.msgType === MESSAGE_TYPE.DATE ? (
              <Divider>{message.time}</Divider>
            ) : null}
          </div>
        ))}
      </Scrollbars>
    </div>
  );

  const chatContentFooter = () => (
    <div className="chat-content-footer">
      <Form name="msgInput" ref={formRef} onFinish={onSend} className="w-100">
        <Form.Item name="newMsg" className="mb-0">
          <Input
            autoComplete="off"
            placeholder={formatMessage(messages.typeAMessagePlaceholder)}
            suffix={
              <div className="d-flex align-items-center">
                <a
                  href="/#"
                  className="text-dark font-size-lg mr-3"
                  onClick={emptyClick}
                >
                  <SmileOutlined />
                </a>
                <a
                  href="/#"
                  className="text-dark font-size-lg mr-3"
                  onClick={emptyClick}
                >
                  <PaperClipOutlined />
                </a>
                <Button
                  shape="circle"
                  type="primary"
                  size="small"
                  onClick={onSend}
                  htmlType="submit"
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

  const renderMenu = () => {
    return (
      <Menu>
        <Menu.Item key="0">
          <UserOutlined />
          <span>{formatMessage(messages.userInfo)}</span>
        </Menu.Item>
        <Menu.Item key="1">
          <AudioMutedOutlined />
          <span>{formatMessage(messages.muteChat)}</span>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="3">
          <DeleteOutlined />
          <span>{formatMessage(messages.deleteChat)}</span>
        </Menu.Item>
      </Menu>
    );
  };

  return (
    <div className="chat-content">
      {chatContentHeader(info.name)}
      {chatContentBody(msgList, id)}
      {chatContentFooter()}
    </div>
  );
};

export default Conversation;
