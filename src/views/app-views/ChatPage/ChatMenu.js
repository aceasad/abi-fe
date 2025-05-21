import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Badge, Input, Select } from 'antd';
import AvatarStatus from 'components/shared-components/AvatarStatus';
import { COLOR_1 } from 'constants/ChartConstant';
import { SearchOutlined } from '@ant-design/icons';
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import { useIntl } from 'react-intl';
import messages from './messages';
import {
  chatListItemStyle,
  formatMessageTimestamp,
  removeLeadingZeroFromTime,
} from 'utils/helpers';
import {
  getAllChatsInfo,
  getMoreChatsInfo,
  setConversationToRead,
  searchConversations,
  clearTriggerSearchConversations,
} from 'redux/actions/Chats';
import { useDispatch, useSelector } from 'react-redux';
import { makeSelectAllChatsInfo } from 'redux/selectors/Chats';
import { useDebounce, useLazyLoad } from 'utils/hooks';
import Scrollbars from 'react-custom-scrollbars';
import { CHAT_FILTERS, MESSAGE_STATUS } from 'constants/ChatConstants';
import { Option } from 'antd/lib/mentions';

const ChatMenu = (props) => {

  const getStatusColor = (status) => {
    if (status === 'RESCHEDULED' || status === 'BOOKED' || status === 'REMINDED') {
      return '#18D9C5'; // Green
    } else if (status === 'ASKED_QUESTION' || status === 'RESCHEDULING' || status === 'CANCELLING' || status === 'BOOKING' || status === 'INVITED' || status === 'INCOMPLETE' || status === 'SCREENED_ELSEWHERE' || status === 'HUMAN_INTERVENTION' || status === 'SNOOZED') {
      return '#FFBF00'; // Yellow
    } else if (status === 'CANCELLED' || status === 'NO_RESPONSE' || status === 'INACTIVE' || status === 'INCOMPLETE' || status === 'OPT_OUT' || status === 'DECLINED' || status === 'EMERGENCY_SITUATION') {
      return '#FF474C'; // Red
    } else if (status === 'FAILED') {
      return '#100101'; // Black
    } else {
      return '#E880FF'; // Default color
    }
  };
  const history = useHistory();
  const location = useLocation();
  const match = useRouteMatch();
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();

  const currentChatID = parseInt(location.pathname.match(/\/([^/]+)\/?$/)[1]);
  const [query, setQuery] = useState('');
  const debouncedSearch = useDebounce(query, 500);

  const nextRef = useRef(null);
  const menuRef = useRef(null);
  const scrollHeightRef = useRef(0);

  const { items, next, loading, scrollDown } = useSelector(
    makeSelectAllChatsInfo
  );

  const CONVERSATION_FILTERS = [
    {
      label: formatMessage(messages.allFilter),
      value: CHAT_FILTERS.ALL,
    },
    {
      label: formatMessage(messages.humanInterventionRequiredFilter),
      value: CHAT_FILTERS.HUMAN_INTERVENTION_REQUIRED,
    },
    {
      label: formatMessage(messages.inEmergencySituationFilter),
      value: CHAT_FILTERS.IN_EMERGENCY_SITUATION,
    },
    {
      label: formatMessage(messages.inDeclinedFilter),
      value: CHAT_FILTERS.DECLINED,
    },
    {
      label: formatMessage(messages.bookedFilter),
      value: CHAT_FILTERS.BOOKED,
    },
    {
      label: formatMessage(messages.rescheduleFilter),
      value: CHAT_FILTERS.RESCHEDULED,
    },
    {
      label: formatMessage(messages.cancelledFilter),
      value: CHAT_FILTERS.CANCELLED,
    },
    {
      label: formatMessage(messages.noResponseFilter),
      value: CHAT_FILTERS.NO_RESPONSE,
    },
    {
      label: formatMessage(messages.askedQuestionFilter),
      value: CHAT_FILTERS.ASKED_QUESTION,
    },
    {
      label: formatMessage(messages.inSnoozedFilter),
      value: CHAT_FILTERS.SNOOZED,
    },
    {
      label: formatMessage(messages.inRemindedFilter),
      value: CHAT_FILTERS.REMINDED,
    },
    {
      label: formatMessage(messages.inInvitedFilter),
      value: CHAT_FILTERS.INVITED,
    },
    {
      label: formatMessage(messages.inIncompleteFilter),
      value: CHAT_FILTERS.INCOMPLETE,
    },
    {
      label: formatMessage(messages.inScreenedElsewhereFilter),
      value: CHAT_FILTERS.SCREENED_ELSEWHERE,
    },
    {
      label: formatMessage(messages.inFailedFilter),
      value: CHAT_FILTERS.FAILED,
    }

  ];

  const [filter, setFilter] = useState(CONVERSATION_FILTERS[0].value);

  useEffect(() => {
    // this will trigger initial data load
    if (query === debouncedSearch) {
      dispatch(searchConversations({ query, filter }));
    }
  }, [dispatch, query, filter, debouncedSearch]);

  useEffect(() => {
    // this will trigger triggered data load
    if (props.triggerSearchConversations) {
      dispatch(searchConversations({ query, filter }));
      dispatch(clearTriggerSearchConversations());
    }
  }, [dispatch, query, filter, props.triggerSearchConversations]);

  useEffect(() => {
    nextRef.current = next;
  }, [next]);

  const handleGetMoreChatsInfo = useCallback(
    () => dispatch(getMoreChatsInfo()),
    [dispatch]
  );

  useLazyLoad(
    '#chat-menu-scroll div',
    handleGetMoreChatsInfo,
    [loading],
    () => !!nextRef.current
  );

  const openChat = (id) => {
    dispatch(setConversationToRead(id));
    history.push(`${match.url}/${id}`);
  };

  const searchOnChange = (e) => {
    setQuery(e.target.value);
  };

  const stopScroll = () => {
    menuRef.current &&
      menuRef.current.getScrollHeight() - scrollHeightRef.current > 2 &&
      menuRef.current.scrollTop(
        menuRef.current.getScrollHeight() - scrollHeightRef.current
      );
  };

  const handleFilterChange = (selected) => {
    setFilter(selected);
    setQuery('');
    dispatch(getAllChatsInfo(selected));
  };

  useEffect(() => {
    if (scrollDown) {
      stopScroll();
    }
    scrollHeightRef.current = menuRef.current.getScrollHeight();
  }, [items]);

  return (
    <div className="chat-menu">
      <div className="chat-menu-toolbar">
        <Select
          value={filter}
          onChange={handleFilterChange}
          style={{ width: '100%' }}
        >
          {CONVERSATION_FILTERS.map((item, index) => (
            <Option key={index} value={item.value}>
              {item.label}
            </Option>
          ))}
        </Select>
      </div>
      <div className="chat-menu-toolbar">
        <Input
          placeholder={formatMessage(messages.searchPlaceholder)}
          onChange={searchOnChange}
          value={query}
          prefix={<SearchOutlined className="font-size-lg mr-2" />}
        />
      </div>
      <div className="chat-menu-list">
        <Scrollbars id="chat-menu-scroll" ref={menuRef} autoHide={false}>
          {items.map((item, index) => {
            const statusColor = getStatusColor(item.patient.conversation_status);

            return (
              <div
                key={`chat-item-${item.patient.id}${index}`}
                onClick={() => openChat(item.patient.id)}
                className={chatListItemStyle(
                  items.length,
                  item.patient.id,
                  index,
                  currentChatID
                )}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  padding: '12px 16px'
                }}
              >
                {/* Status indicator dot - larger and more prominent */}
                <div
                  className="status-indicator"
                  style={{
                    width: '14px',
                    height: '14px',
                    borderRadius: '50%',
                    backgroundColor: statusColor,
                    marginRight: '14px',
                    marginTop: '4px',
                    flexShrink: 0
                  }}
                />

                {/* Wrapper for patient info/message and date */}
                <div style={{ display: 'flex', justifyContent: 'space-between', flex: 1 }}>
                  {/* Patient info and message */}
                  <div style={{ flex: 1, paddingRight: '12px' }}>
                    <div style={{
                      fontWeight: 'bold',
                      fontSize: '14px',
                      marginBottom: '2px'
                    }}>
                      {item.patient.full_name}
                      {item.patient.is_in_emergency_situation &&
                        <span style={{ marginLeft: '6px', color: '#FF474C' }}>⚠</span>}
                      {item.patient.is_human_required &&
                        <span style={{ marginLeft: '6px', color: '#18D9C5' }}>👤</span>}
                    </div>
                    <div
                      className="text-muted"
                      style={{
                        fontSize: '13px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {(() => {
                        const text = item.last_message.text || "";
                        const words = text.split(" ");
                        return words.slice(0, 8).join(" ");
                      })()}
                    </div>
                  </div>

                  {/* Date */}
                  <div style={{
                    flexShrink: 0,
                    textAlign: 'right',
                    fontSize: '12px',
                    color: '#888'
                  }}>
                    {item.last_message.created_at ?
                      new Date(item.last_message.created_at)
                        .toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: '2-digit',
                          year: '2-digit'
                        }).replace(/\//g, '/') :
                      ''}
                  </div>
                </div>
              </div>
            );
          })}
        </Scrollbars>
      </div>
    </div>
  );
};

export default ChatMenu;
