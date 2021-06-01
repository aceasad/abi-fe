import {
  AudioMutedOutlined,
  DeleteOutlined,
  SendOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Button, Form, Input, Menu } from 'antd';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import Loading from 'components/shared-components/Loading';
import { useToggleRasaActivity } from 'queries/shared';
import React, { Fragment, useCallback, useEffect, useRef } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  getMoreSingleChatMessages,
  getSingleChat,
  toggleRasaActivity,
} from 'redux/actions/Chats';
import {
  makeSelectSingleChat,
  makeSelectSingleChatInfo,
} from 'redux/selectors/Chats';
import {
  addDividers,
  formatMessageForSocketSend,
  generateKey,
} from 'utils/helpers';
import ChatContentBody from './ChatContentBody';
import messages from './messages';

const Conversation = ({
  conversationId,
  isMenuVisible = true,
  title,
  showTitle = true,
  BackAction = false,
  socket,
  isSocketOpen,
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
    if (!loading) {
      scrollToBottom();
    }
  }, [loading, items]);

  // useEffect(() => {
  //   nextRef.current = { next };
  // }, [next]);

  // TO-DO - Add lazy load
  // useLazyLoad(
  //   '#single-chat-scroll div',
  //   handleGetMoreSingleMessages,
  //   [loading],
  //   () => nextRef.current.next,
  //   false
  // );

  const onSend = ({ newMessage }) => {
    if (newMessage) {
      newMessage && socket.send(formatMessageForSocketSend(newMessage, id));
    }
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
      <ChatContentFooter onSend={onSend} isSocketOpen={isSocketOpen} />
    </div>
  );
};

export default Conversation;
