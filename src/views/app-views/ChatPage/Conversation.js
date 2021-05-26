import React, { Fragment, useEffect, useRef } from 'react';
import { Avatar, Divider, Input, Form, Button, Menu } from 'antd';
import {
  SendOutlined,
  AudioMutedOutlined,
  UserOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { Scrollbars } from 'react-custom-scrollbars';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import { MESSAGE_TYPE, MESSAGE_FROM } from 'constants/ChatConstants';
import { useIntl } from 'react-intl';
import messages from './messages';
import { useParams } from 'react-router-dom';
import {
  addDividers,
  formatMessagesTimestampDate,
  formatMessagesTimestampMinutes,
  generateDividerMessage,
  generateKey,
  isSameDay,
  singleChatMessageStyle,
} from 'utils/helpers';
import { useDispatch, useSelector } from 'react-redux';
import {
  getMoreSingleChatMessages,
  getSingleChat,
  toggleRasaActivity,
} from 'redux/actions/Chats';
import {
  makeSelectSingleChat,
  makeSelectSingleChatInfo,
} from 'redux/selectors/Chats';
import Loading from 'components/shared-components/Loading';
import { useLazyLoad } from 'utils/hooks';
import { useCallback } from 'react';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import { useToggleRasaActivity } from 'queries/shared';
import ChatContentBody from './ChatContentBody';

const Conversation = ({
  conversationId,
  isMenuVisible = true,
  title,
  showTitle = true,
  BackAction = false,
}) => {
  const formRef = useRef();
  const chatBodyRef = useRef(null);
  const nextRef = useRef(null);
  const params = useParams();

  const id = parseInt(params.id || conversationId);
  const { items, loading, next } = useSelector(makeSelectSingleChat);
  const { chatInfo } = useSelector(makeSelectSingleChatInfo);

  const { formatMessage } = useIntl();
  const dispatch = useDispatch();

  useEffect(() => {
    getConversation(id);
  }, [params.id]);

  const handleGetMoreSingleMessages = useCallback(
    () => dispatch(getMoreSingleChatMessages({ patientId: params.id })),
    [params, dispatch]
  );
  const getConversation = (patientId) => {
    dispatch(getSingleChat({ patientId }));
  };

  const scrollToBottom = () => {
    chatBodyRef.current && chatBodyRef.current.scrollToBottom();
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatBodyRef.current]);

  useEffect(() => {
    nextRef.current = { next };
  }, [next]);

  // TO-DO - Add lazy load
  // useLazyLoad(
  //   '#single-chat-scroll div',
  //   handleGetMoreSingleMessages,
  //   [loading],
  //   () => nextRef.current.next,
  //   false
  // );

  const onSend = (values) => {
    // TO-DO
  };

  const { mutate, isLoading } = useToggleRasaActivity();

  const chatContentHeader = (name, isRasaPaused) => (
    <div className="chat-content-header">
      {showTitle && <h4 className="mb-0">{name}</h4>}
      <Checkbox
        key={`checkbox-rasa-${generateKey()}`}
        defaultChecked={isRasaPaused}
        disabled={isLoading}
        onChange={() =>
          mutate(id, { onSuccess: () => dispatch(toggleRasaActivity(id)) })
        }
      >
        {formatMessage(messages.rasaPaused)}
      </Checkbox>
      {isMenuVisible && (
        <div>
          <EllipsisDropdown menu={renderMenu} />
        </div>
      )}
      {BackAction && <BackAction />}
    </div>
  );

  const chatContentBody = (messages, next, patientPicture) => {
    return messages ? (
      <ChatContentBody
        messages={addDividers(messages, next)}
        patientPicture={patientPicture}
      />
    ) : null;
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
      {chatContentHeader(
        title ? title : chatInfo?.patient?.full_name,
        chatInfo?.patient.is_rasa_paused
      )}
      <div className="chat-content-body">
        <Scrollbars
          key={generateKey()}
          ref={chatBodyRef}
          autoHide={false}
          id="single-chat-scroll"
        >
          {loading ? (
            <Loading />
          ) : (
            chatContentBody(items, next, chatInfo && chatInfo.patient.picture)
          )}
        </Scrollbars>
      </div>
      {chatContentFooter()}
    </div>
  );
};

export default Conversation;
