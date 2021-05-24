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
import {
  formatMessagesTimestampDate,
  formatMessagesTimestampMinutes,
  isSameDay,
  singleChatMessageStyle,
} from 'utils/helpers';
import { useDispatch, useSelector } from 'react-redux';
import { getSingleChat } from 'redux/actions/Chats';
import {
  makeSelectSingleChat,
  makeSelectSingleChatInfo,
} from 'redux/selectors/Chats';
import Loading from 'components/shared-components/Loading';

const Conversation = ({
  conversationId,
  isMenuVisible = true,
  title,
  showTitle = true,
  BackAction = false,
}) => {
  const formRef = useRef();
  const chatBodyRef = useRef();
  const params = useParams();

  const id = parseInt(params.id || conversationId);
  const [info, setInfo] = useState({});
  const [messageList, setMessageList] = useState([]);
  const { items, loading } = useSelector(makeSelectSingleChat());
  const { chatInfo } = useSelector(makeSelectSingleChatInfo(id));

  const { formatMessage } = useIntl();
  const dispatch = useDispatch();

  useEffect(() => {
    getConversation(id);
    scrollToBottom();
  }, [params.id]);

  useEffect(() => {
    setMessageList(items);
    scrollToBottom();
  }, [items]);

  useEffect(() => {
    setInfo(chatInfo);
    scrollToBottom();
  }, [chatInfo]);

  const getConversation = (currentId) => {
    dispatch(
      getSingleChat({ patientId: currentId, afterEffect: scrollToBottom })
    );
  };

  const scrollToBottom = () => {
    chatBodyRef.current && chatBodyRef.current.scrollToBottom();
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatBodyRef.current]);

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
      {showTitle && <h4 className="mb-0">{name}</h4>}
      {isMenuVisible && (
        <div>
          <EllipsisDropdown menu={renderMenu} />
        </div>
      )}
      {BackAction && <BackAction />}
    </div>
  );

  const generateDividerMessage = (date) => {
    return {
      created_at: formatMessagesTimestampDate(date),
      type: 'DIVIDER',
      id: 'divider',
    };
  };

  const addDividers = (messages) => {
    if (messages.length === 1) {
      return [generateDividerMessage(messages[0].created_at), ...messages];
    }
    const added =
      messages.length &&
      messages.reduce((acc, item) => {
        if (acc.length) {
          if (isSameDay(acc[acc.length - 1].created_at, item.created_at)) {
            return [...acc, item];
          } else {
            return [...acc, generateDividerMessage(item.created_at), item];
          }
        } else {
          if (isSameDay(acc.created_at, item.created_at)) {
            return [acc, item];
          } else {
            return [acc, generateDividerMessage(item.created_at), item];
          }
        }
      });
    return added;
  };

  const chatContentBody = (messages) => {
    const messagesWithDividers = addDividers(messages);
    return (
      <div className="chat-content-body">
        <Scrollbars ref={chatBodyRef} autoHide>
          {messagesWithDividers &&
            messagesWithDividers.map((message, index) => (
              <div
                key={`msg-${message.id}-${index}`}
                className={singleChatMessageStyle(message)}
              >
                {message?.type === 'DIVIDER' ? (
                  <Divider>{message.created_at}</Divider>
                ) : !message.is_answer ? (
                  <div className="mr-2">
                    <Avatar src={info && info.patient.picture} />
                  </div>
                ) : null}
                {message.text ? (
                  <div className={`bubble`}>
                    <div className="bubble-wrapper">
                      <span>{message.text}</span>
                    </div>
                    <span>
                      {formatMessagesTimestampMinutes(message.created_at)}
                    </span>
                  </div>
                ) : null}
              </div>
            ))}
        </Scrollbars>
      </div>
    );
  };

  const chatContentFooter = () => (
    <div className="chat-content-footer">
      <Form name="msgInput" ref={formRef} onFinish={onSend} className="w-100">
        <Form.Item name="newMessage" className="mb-0">
          <Input
            autoComplete="off"
            placeholder={formatMessage(messages.typeAMessagePlaceholder)}
            suffix={
              <div className="d-flex align-items-center">
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
      {chatContentHeader(title ? title : info?.patient?.full_name)}
      {loading ? <Loading /> : chatContentBody(messageList, id)}
      {chatContentFooter()}
    </div>
  );
};

export default Conversation;
