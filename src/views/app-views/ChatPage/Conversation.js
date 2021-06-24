import Loading from 'components/shared-components/Loading';
import React, { useCallback, useEffect, useRef, useState } from 'react';
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
import { useLazyLoad } from 'utils/hooks';

const Conversation = ({
  conversationId,
  isMenuVisible = true,
  showTitle = true,
  BackAction = false,
}) => {
  const chatBodyRef = useRef(null);
  const nextRef = useRef(null);
  const params = useParams();
  const scrollHeightRef = useRef(0);

  const id = parseInt(params.id || conversationId);
  const { items, loading, next, scrollDown } = useSelector(
    makeSelectSingleChat
  );
  const { chatInfo } = useSelector(makeSelectSingleChatInfo);

  const dispatch = useDispatch();

  useEffect(() => {
    getConversation(id);
  }, [params.id]);

  const handleGetMoreSingleMessages = () => {
    dispatch(getMoreSingleChatMessages());
  };
  const getConversation = (patientId) => {
    dispatch(getSingleChat({ patientId }));
  };

  const scrollToBottom = () => {
    chatBodyRef.current && chatBodyRef.current.scrollToBottom();
  };

  const stopScroll = () => {
    chatBodyRef.current &&
      chatBodyRef.current.scrollTop(
        chatBodyRef.current.getScrollHeight() - scrollHeightRef.current
      );
  };

  useEffect(() => {
    if (scrollDown) {
      scrollToBottom();
    } else {
      stopScroll();
    }
    scrollHeightRef.current = chatBodyRef.current.getScrollHeight();
  }, [items]);

  useEffect(() => {
    nextRef.current = next;
  }, [next]);

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

  useLazyLoad(
    '#single-chat-scroll div',
    handleGetMoreSingleMessages,
    [],
    () => !!nextRef.current,
    false
  );

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
          {chatInfo?.patient &&
            chatContentBody(items, next, chatInfo.patient.picture)}
        </Scrollbars>
      </div>
      <ChatContentFooter onSend={onSend} />
    </div>
  );
};

export default Conversation;
