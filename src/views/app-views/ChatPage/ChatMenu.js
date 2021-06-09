import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useCallback,
} from 'react';
import ChatData from 'assets/data/chat.data.json';
import { Badge, Input } from 'antd';
import AvatarStatus from 'components/shared-components/AvatarStatus';
import { COLOR_1 } from 'constants/ChartConstant';
import { SearchOutlined } from '@ant-design/icons';
import {
  useHistory,
  useLocation,
  useParams,
  useRouteMatch,
} from 'react-router-dom';
import { useIntl } from 'react-intl';
import messages from './messages';
import { chatListItemStyle, formatMessageTimestamp } from 'utils/helpers';
import {
  getAllChatsInfo,
  getMoreChatsInfo,
  setConversationToRead,
  searchConversations,
} from 'redux/actions/Chats';
import { useDispatch, useSelector } from 'react-redux';
import { makeSelectAllChatsInfo } from 'redux/selectors/Chats';
import Loading from 'components/shared-components/Loading';
import { useDebounce, useLazyLoad } from 'utils/hooks';
import Scrollbars from 'react-custom-scrollbars';
import { MESSAGE_STATUS } from 'constants/ChatConstants';

const ChatMenu = () => {
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

  useEffect(() => {
    // this will trigger iniitial data load
    if (query === debouncedSearch) {
      dispatch(searchConversations(query));
    }
  }, [debouncedSearch]);

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
      menuRef.current.scrollTop(
        menuRef.current.getScrollHeight() - scrollHeightRef.current
      );
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
        <Input
          placeholder={formatMessage(messages.searchPlaceholder)}
          onChange={searchOnChange}
          prefix={<SearchOutlined className="font-size-lg mr-2" />}
        />
      </div>
      <div className="chat-menu-list">
        <Scrollbars id="chat-menu-scroll" ref={menuRef}>
          {items.map((item, index) => {
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
              >
                <AvatarStatus
                  src={item.patient.picture}
                  name={item.patient.full_name}
                  subTitle={item.last_message.text}
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
            );
          })}
        </Scrollbars>
      </div>
    </div>
  );
};

export default ChatMenu;
