import React, { Fragment, useEffect, useRef, useState } from 'react';
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
import { singleChatMessageStyle } from 'utils/helpers';

const Conversation = () => {
  const formRef = useRef();
  const chatBodyRef = useRef();
  const params = useParams();

  const id = parseInt(params.id);
  const [info, setInfo] = useState({});
  const [messageList, setMessageList] = useState([]);

  const { formatMessage } = useIntl();

  useEffect(() => {
    getConversation(id);
    scrollToBottom();
  }, [params.id]);

  const getConversation = (currentId) => {
    const data = ChatData.filter((chat) => chat.id === currentId);
    setInfo(data[0]);
    setMessageList(data[0].msg);
  };

  const getMessageType = ({ msgType, text }) => {
    switch (msgType) {
      case MESSAGE_TYPE.TEXT:
        return <span>{text}</span>;
      case MESSAGE_TYPE.IMAGE:
        return <img src={text} alt={text} />;
      case MESSAGE_TYPE.FILE:
        return (
          <Flex alignItems="center" className="msg-file">
            <FileOutlined className="font-size-md" />
            <span className="ml-2 font-weight-semibold text-link pointer">
              <u>{text}</u>
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
    if (values.newMessage) {
      const newMessageData = {
        avatar: '',
        from: MESSAGE_FROM.ME,
        msgType: MESSAGE_TYPE.TEXT,
        text: values.newMessage,
        time: '',
      };
      formRef.current.setFieldsValue({
        newMessage: '',
      });
      setMessageList([...messageList, newMessageData]);
    }
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
        {messages.map((message, index) => (
          <div
            key={`msg-${id}-${index}`}
            className={singleChatMessageStyle(message)}
          >
            {message.avatar ? (
              <div className="mr-2">
                <Avatar src={message.avatar} />
              </div>
            ) : null}
            {message.text ? (
              <div className={`bubble ${!message.avatar ? 'ml-5' : ''}`}>
                <div className="bubble-wrapper">{getMessageType(message)}</div>
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
        <Form.Item name="newMessage" className="mb-0">
          <Input
            autoComplete="off"
            placeholder={formatMessage(messages.typeAMessagePlaceholder)}
            suffix={
              <div className="d-flex align-items-center">
                <button className="text-dark font-size-lg mr-3">
                  <SmileOutlined />
                </button>
                <button className="text-dark font-size-lg mr-3">
                  <PaperClipOutlined />
                </button>
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

  const menuOptions = [
    { Icon: UserOutlined, message: messages.userInfo, shouldDivide: false },
    {
      Icon: AudioMutedOutlined,
      message: messages.muteChat,
      shouldDivide: true,
    },
    {
      Icon: DeleteOutlined,
      message: messages.deleteChat,
      shouldDivide: false,
    },
  ];

  const renderMenu = () => {
    return (
      <Menu>
        {menuOptions.map((menu, index) => (
          <Fragment>
            <Menu.Item key={index.toString()}>
              <menu.Icon />
              <span>{formatMessage(menu.message)}</span>
            </Menu.Item>
            {menu.shouldDivide && <Menu.Divider />}
          </Fragment>
        ))}
      </Menu>
    );
  };

  return (
    <div className="chat-content">
      {chatContentHeader(info.name)}
      {chatContentBody(messageList, id)}
      {chatContentFooter()}
    </div>
  );
};

export default Conversation;
