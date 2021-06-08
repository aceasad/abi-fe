import Loading from 'components/shared-components/Loading';
import React, { useCallback, useEffect, useRef } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getMoreSingleChatMessages, getSingleChat } from 'redux/actions/Chats';
import {
  makeSelectSingleChat,
  makeSelectSingleChatInfo,
} from 'redux/selectors/Chats';
import { addDividers, formatMessageForSocketSend } from 'utils/helpers';
import ChatContentBody from './ChatContentBody';
import ChatContentFooter from './ChatContentFooter';
import ChatContentHeader from './ChatContentHeader';
import WebSocketClient from 'services/WebSocketClient';

const Conversation = ({
  conversationId,
  isMenuVisible = true,
  showTitle = true,
  BackAction = false,
}) => {
  const chatBodyRef = useRef(null);
  const params = useParams();

  const id = parseInt(params.id || conversationId);
  const { items, loading, next } = useSelector(makeSelectSingleChat);
  const { chatInfo } = useSelector(makeSelectSingleChatInfo);

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

  const onSend = ({ newMessage }) => {
    newMessage &&
      WebSocketClient.sendMessage(formatMessageForSocketSend(newMessage, id));
  };

  const chatContentBody = (messages, next, patientPicture) =>
    messages ? (
      <ChatContentBody
        messages={addDividers(messages, next)}
        patientPicture={patientPicture}
      />
    ) : null;

  return (
    <div className="chat-content">
      <ChatContentHeader
        showTitle={showTitle}
        chatLoading={loading}
        isMenuVisible={isMenuVisible}
        BackAction={BackAction}
      />
      <div className="chat-content-body">
        <Scrollbars
          key="chat-scrollbars"
          ref={chatBodyRef}
          autoHide={false}
          id="single-chat-scroll"
        >
          {loading ? (
            <Loading />
          ) : (
            chatContentBody(items, next, chatInfo.patient.picture)
          )}
        </Scrollbars>
      </div>
      <ChatContentFooter onSend={onSend} />
    </div>
  );
};

export default Conversation;
