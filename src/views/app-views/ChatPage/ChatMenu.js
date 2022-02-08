import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Badge, Input, Select } from 'antd';
import AvatarStatus from 'components/shared-components/AvatarStatus';
import { COLOR_1 } from 'constants/ChartConstant';
import { SearchOutlined } from '@ant-design/icons';
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import { useIntl } from 'react-intl';
import messages from './messages';
import { chatListItemStyle, formatMessageTimestamp } from 'utils/helpers';
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
      label: formatMessage(messages.likelyToMissNextAppointmentFilter),
      value: CHAT_FILTERS.LIKELY_TO_MISS_NEXT_APPOINTMENT,
    },
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
          {items.map((item, index) => (
            <div
              key={`chat-item-${item.patient.id}${index}`}
              onClick={() => openChat(item.patient.id)}
              className={chatListItemStyle(
                items.length,
                item.patient.id,
                index,
                currentChatID
              )}
            >
              <AvatarStatus
                src={item.patient.picture}
                name={item.patient.full_name}
                subTitle={item.last_message.text}
                is_human_required={item.patient.is_human_required}
                is_in_emergency_situation={
                  item.patient.is_in_emergency_situation
                }
              />
              <div className="text-right">
                <div className="chat-menu-list-item-time">
                  {formatMessageTimestamp(item.last_message.created_at)}
                </div>
                {item?.last_message.status === MESSAGE_STATUS.SENT &&
                !item?.last_message.is_answer ? (
                  <Badge count={1} style={{ backgroundColor: COLOR_1 }} />
                ) : (
                  <span></span>
                )}
              </div>
            </div>
          ))}
        </Scrollbars>
      </div>
    </div>
  );
};

export default ChatMenu;
