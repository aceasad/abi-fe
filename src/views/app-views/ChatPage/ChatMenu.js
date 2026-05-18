import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { Input } from 'antd';
import { SearchOutlined, MessageOutlined, WhatsAppOutlined } from '@ant-design/icons';
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import { useIntl } from 'react-intl';
import messages from './messages';
import {
  chatListItemStyle,
  getDateFormatByCountry,
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
import { makeSelectClinic } from 'redux/selectors/Clinic';
import { useDebounce, useLazyLoad } from 'utils/hooks';
import Scrollbars from 'react-custom-scrollbars';
import {
  CHAT_FILTERS,
  FILTER_ATTRIBUTES,
  buildPatientLocationFilterOptions,
  getPatientLocationDescription,
} from 'constants/ChatConstants';
import dayjs from 'utils/dayjs';
import ConversationFilters from './ConversationFilters';

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
  const trimmedQuery = query.trim();
  const isSearching = trimmedQuery.length > 0;

  const nextRef = useRef(null);
  const menuRef = useRef(null);
  const scrollHeightRef = useRef(0);

  const { items, next, loading, scrollDown } = useSelector(
    makeSelectAllChatsInfo
  );
  const clinic = useSelector(makeSelectClinic());
  const { PASProvider } = useSelector((state) => state.auth.user || {});
  const showPatientLocationFilter =
    PASProvider?.toLowerCase() !== 'emis';
  const shortDateFormat = getDateFormatByCountry(clinic?.country).replace(
    'YYYY',
    'YY'
  );

  const [activeFilters, setActiveFilters] = useState([]);

  useEffect(() => {
    if (!showPatientLocationFilter) {
      setActiveFilters((prev) =>
        prev.filter((f) => f.attribute !== FILTER_ATTRIBUTES.LOCATION)
      );
    }
  }, [showPatientLocationFilter]);

  // The existing backend filter param is a single string. When multiple status
  // values are selected we send the first one; the rest is a future migration
  // (see plan: extend payload to { query, status, location_id }).
  const statusFilter = useMemo(() => {
    const statusEntry = activeFilters.find(
      (f) => f.attribute === FILTER_ATTRIBUTES.STATUS
    );
    return statusEntry && statusEntry.values.length > 0
      ? statusEntry.values[0]
      : CHAT_FILTERS.ALL;
  }, [activeFilters]);

  useEffect(() => {
    if (query === debouncedSearch) {
      if (trimmedQuery) {
        dispatch(searchConversations({ query: trimmedQuery, filter: statusFilter }));
      } else {
        dispatch(getAllChatsInfo(statusFilter));
      }
    }
  }, [dispatch, query, statusFilter, debouncedSearch]);

  useEffect(() => {
    if (props.triggerSearchConversations) {
      if (trimmedQuery) {
        dispatch(searchConversations({ query: trimmedQuery, filter: statusFilter }));
      } else {
        dispatch(getAllChatsInfo(statusFilter));
      }
      dispatch(clearTriggerSearchConversations());
    }
  }, [dispatch, query, statusFilter, props.triggerSearchConversations]);

  useEffect(() => {
    nextRef.current = next;
  }, [next]);

  const handleGetMoreChatsInfo = useCallback(
    () => {
      if (isSearching) {
        return;
      }
      dispatch(getMoreChatsInfo({ filter: statusFilter }));
    },
    [dispatch, statusFilter, isSearching]
  );

  useLazyLoad(
    '#chat-menu-scroll div',
    handleGetMoreChatsInfo,
    [loading, isSearching],
    () => !!nextRef.current && !isSearching
  );

  const openChat = (id) => {
    dispatch(setConversationToRead(id));
    history.push(`${match.url}/${id}`);
    // Close mobile drawer if the function is provided
    if (props.closeMobileDrawer) {
      props.closeMobileDrawer();
    }
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

  useEffect(() => {
    if (scrollDown) {
      stopScroll();
    }
    if (menuRef.current) {
      scrollHeightRef.current = menuRef.current.getScrollHeight();
    }
  }, [items]);

  const patientLocationOptions = useMemo(
    () => buildPatientLocationFilterOptions(items),
    [items]
  );

  const locationFilter = showPatientLocationFilter
    ? activeFilters.find((f) => f.attribute === FILTER_ATTRIBUTES.LOCATION)
    : null;
  const visibleItems = locationFilter
    ? items.filter((item) =>
      locationFilter.values.includes(
        getPatientLocationDescription(item.patient?.home_location)
      )
    )
    : items;

  return (
    <div className="chat-menu">
      <div className="chat-menu-toolbar">
        <Input
          style={{ width: '100%', maxWidth: '100%' }}
          placeholder={formatMessage(messages.searchPlaceholder)}
          prefix={<SearchOutlined />}
          allowClear
          value={query}
          onChange={searchOnChange}
        />
      </div>
      <div className="chat-menu-toolbar chat-menu-filter-bar">
        <ConversationFilters
          value={activeFilters}
          onChange={setActiveFilters}
          showPatientLocationFilter={showPatientLocationFilter}
          patientLocationOptions={patientLocationOptions}
        />
      </div>
      <div className="chat-menu-list">
        <Scrollbars id="chat-menu-scroll" ref={menuRef} autoHide={false}>
          {visibleItems.map((item, index) => {
            const statusColor = getStatusColor(item.patient.conversation_status);
            const lastMessageText = item.last_message?.text || '';
            const lastMessageCreatedAt = item.last_message?.created_at;

            return (
              <div
                key={`chat-item-${item.patient.id}${index}`}
                onClick={() => openChat(item.patient.id)}
                className={chatListItemStyle(
                  visibleItems.length,
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

                {/* Patient info and message - with max-width to prevent overflow */}
                <div style={{
                  flex: 1,
                  minWidth: 0, // Important: allows flex item to shrink below content size
                  paddingRight: '12px'
                }}>
                  <div style={{
                    fontWeight: 'bold',
                    fontSize: '14px',
                    marginBottom: '2px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {item.patient.full_name}
                    {item.patient.communication_channel === 'sms' &&
                      <MessageOutlined style={{ marginLeft: '6px', color: '#1890ff', fontSize: '13px' }} />}
                    {item.patient.communication_channel === 'whatsapp' &&
                      <WhatsAppOutlined style={{ marginLeft: '6px', color: '#25D366', fontSize: '13px' }} />}
                    {item.patient.is_in_emergency_situation &&
                      <span style={{ marginLeft: '6px', color: '#FF474C' }}>⚠</span>}
                    {item.patient.is_human_required &&
                      <span style={{ marginLeft: '6px', color: '#18D9C5' }}>👤</span>}
                  </div>
                  <div
                    className="text-muted"
                    style={{
                      fontSize: '14px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {(() => {
                      const words = lastMessageText.split(' ');
                      return words.slice(0, 8).join(' ');
                    })()}
                  </div>
                </div>

                {/* Date - fixed width to ensure alignment */}
                <div style={{
                  width: '60px', // Fixed width for consistent alignment
                  flexShrink: 0,
                  textAlign: 'right',
                  fontSize: '12px',
                  color: '#888'
                }}>
                  {lastMessageCreatedAt ?
                    dayjs(lastMessageCreatedAt).format(shortDateFormat) :
                    ''}
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
