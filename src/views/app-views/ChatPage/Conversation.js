import React, { useEffect, useRef } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getMoreSingleChatMessages, getSingleChat } from 'redux/actions/Chats';
import {
  makeSelectSingleChat,
  makeSelectSingleChatInfo,
} from 'redux/selectors/Chats';
import { makeSelectClinic } from 'redux/selectors/Clinic';
import { addDividers, formatMessageForSocketSend } from 'utils/helpers';
import { MailOutlined, MessageOutlined } from '@ant-design/icons';
import ChatContentBody from './ChatContentBody';
import ChatContentFooter from './ChatContentFooter';
import ChatContentHeader from './ChatContentHeader';
import ChatStatusIndicators from './ChatStatusIndicators';
import WebSocketClient from 'services/WebSocketClient';
import { useLazyLoad } from 'utils/hooks';
import { triggerSearchConversations } from 'redux/actions/Chats';
import patientService from 'services/PatientService';

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
  const clinic = useSelector(makeSelectClinic());

  const dispatch = useDispatch();

  useEffect(() => {
    // Only make the API call if id is a valid number (not NaN)
    if (!isNaN(id) && id > 0) {
      getConversation(id);
    }
  }, [params.id, conversationId]);

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



  // Let's modify this to handle the scroll position before updating the ref
  useEffect(() => {
    if (!chatBodyRef.current) return;

    const currentScrollTop = chatBodyRef.current.getScrollTop();
    const currentScrollHeight = chatBodyRef.current.getScrollHeight();

    // Update the ref
    nextRef.current = next;

    // Maintain scroll position after ref update
    requestAnimationFrame(() => {
      if (chatBodyRef.current) {
        const newScrollHeight = chatBodyRef.current.getScrollHeight();
        const heightDifference = newScrollHeight - currentScrollHeight;
        if (heightDifference > 0) {
          chatBodyRef.current.scrollTop(currentScrollTop + heightDifference);
        }
      }
    });
  }, [next]);

  const onSend = ({ newMessage }) => {
    // Only send message if id is valid and newMessage exists
    if (newMessage && !isNaN(id) && id > 0) {
      WebSocketClient.sendMessage(formatMessageForSocketSend(newMessage, id));
    }
  };

  const handleOnClickMarkHumanRequiredResolved = async (patient_id) => {
    // Validate patient_id before making API calls
    if (!patient_id || isNaN(patient_id) || patient_id <= 0) {
      console.warn('Invalid patient_id provided to handleOnClickMarkHumanRequiredResolved:', patient_id);
      return;
    }
    
    await patientService.markConversationHumanNotRequired(patient_id);
    dispatch(triggerSearchConversations());
    getConversation(patient_id);
  };

  const handleOnClickMarkInEmergencySituationResolved = async (patient_id) => {
    // Validate patient_id before making API calls
    if (!patient_id || isNaN(patient_id) || patient_id <= 0) {
      console.warn('Invalid patient_id provided to handleOnClickMarkInEmergencySituationResolved:', patient_id);
      return;
    }
    
    await patientService.markConversationNotInEmergencySituation(patient_id);
    dispatch(triggerSearchConversations());
    getConversation(patient_id);
  };

  const handleOnClickOptBackIn = async (patient_id) => {
    if (!patient_id || isNaN(patient_id) || patient_id <= 0) {
      console.warn('Invalid patient_id provided to handleOnClickOptBackIn:', patient_id);
      return;
    }

    await patientService.unmarkConversationOptOutSituation(patient_id);
    dispatch(triggerSearchConversations());
    getConversation(patient_id);
  };

  const renderEmptyConversation = () => {
    if (loading || !chatInfo?.patient) return null;
    const hasMessages = items && items.length > 0;
    if (hasMessages) return null;

    const isNotYetInvited = chatInfo.patient.conversation_status === null;

    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        padding: '40px 24px',
        textAlign: 'center',
        color: '#8c8c8c',
      }}>
        <div style={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          backgroundColor: isNotYetInvited ? '#f0f0ff' : '#f5f5f5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 16,
          fontSize: 28,
          color: isNotYetInvited ? '#5d4ebf' : '#bfbfbf',
        }}>
          {isNotYetInvited ? <MailOutlined /> : <MessageOutlined />}
        </div>
        <div style={{
          fontWeight: 600,
          fontSize: 15,
          color: isNotYetInvited ? '#5d4ebf' : '#595959',
          marginBottom: 6,
        }}>
          {isNotYetInvited ? 'Patient not yet invited' : 'No messages yet'}
        </div>
        <div style={{ fontSize: 13, maxWidth: 260, lineHeight: 1.6 }}>
          {isNotYetInvited
            ? 'This patient has been added but has not been sent an invitation yet. No conversation has started.'
            : 'No messages have been exchanged with this patient yet.'}
        </div>
      </div>
    );
  };

  // Updated chatContentBody function to pass all required props
  const chatContentBody = (messages, next, patientPicture) =>
    messages ? (
      <ChatContentBody
        key={id}
        messages={addDividers(messages, next, clinic?.country)}
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
          renderThumbVertical={({ style, ...props }) => (
            <div
              {...props}
              style={{
                ...style,
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                borderRadius: '4px',
                width: '6px',
              }}
            />
          )}
          renderTrackVertical={({ style, ...props }) => (
            <div
              {...props}
              style={{
                ...style,
                backgroundColor: 'rgba(0, 0, 0, 0.05)',
                width: '6px',
                right: 0,
                bottom: 2,
                top: 2,
                borderRadius: '4px',
              }}
            />
          )}
        >
          {chatInfo?.patient &&
            chatContentBody(items, next, chatInfo.patient.picture)}
          {renderEmptyConversation()}
        </Scrollbars>
      </div>
      <ChatStatusIndicators
        chatLoading={loading}
        onClickMarkHumanRequiredResolved={handleOnClickMarkHumanRequiredResolved}
        onClickMarkInEmergencySituationResolved={handleOnClickMarkInEmergencySituationResolved}
        onClickOptBackIn={handleOnClickOptBackIn}
      />
      <ChatContentFooter onSend={onSend} />
    </div>
  );
};

export default Conversation;