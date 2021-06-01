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
import { useHistory } from 'react-router-dom';
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

const ChatMenu = ({ match, location }) => {
  const history = useHistory();
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();

  const nextRef = useRef(null);

  const handleGetMoreChatsInfo = useCallback(
    () => dispatch(getMoreChatsInfo()),
    [dispatch]
  );

  const [query, setQuery] = useState('');

  const id = parseInt(location.pathname.match(/\/([^/]+)\/?$/)[1]);

  const { items, next, loading } = useSelector(makeSelectAllChatsInfo);

  const debouncedSearch = useDebounce(query, 500);

  useEffect(() => {
    dispatch(getAllChatsInfo());
  }, []);

  useEffect(() => {
    nextRef.current = { next };
  }, [next]);

  // TO-DO -> lazy load
  // useLazyLoad(
  //   '#chat-menu-scroll div',
  //   handleGetMoreChatsInfo,
  //   [loading],
  //   () => nextRef.current.next
  // );

  const openChat = (id) => {
    dispatch(setConversationToRead(id));
    history.push(`${match.url}/${id}`);
  };

  const searchOnChange = (e) => {
    setQuery(e.target.value);
  };

  useEffect(() => {
    if (query === debouncedSearch) {
      dispatch(searchConversations(query));
    }
  }, [debouncedSearch]);

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
        <Scrollbars id="chat-menu-scroll">
          {loading ? (
            <Loading />
          ) : (
            items.map((item, index) => {
              return (
                <div
                  key={`chat-item-${item.patient.id}${index}`}
                  onClick={() => openChat(item.patient.id)}
                  className={chatListItemStyle(
                    items.length - 1,
                    item.patient.id,
                    index,
                    id
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
            })
          )}
        </Scrollbars>
      </div>
    </div>
  );
};

export default ChatMenu;
