import React, { useEffect, useRef, useState } from 'react';
import ChatData from 'assets/data/chat.data.json';
import { Badge, Input } from 'antd';
import AvatarStatus from 'components/shared-components/AvatarStatus';
import { COLOR_1 } from 'constants/ChartConstant';
import { SearchOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import { useIntl } from 'react-intl';
import messages from './messages';
import { chatListItemStyle, formatMessageTimestamp } from 'utils/helpers';
import { getAllChatsInfo, getMoreChatsInfo } from 'redux/actions/Chats';
import { useDispatch, useSelector } from 'react-redux';
import { makeSelectAllChatsInfo } from 'redux/selectors/Chats';
import Loading from 'components/shared-components/Loading';
import { useLazyLoad } from 'utils/hooks';
import Scrollbars from 'react-custom-scrollbars';

const ChatMenu = ({ match, location }) => {
  const history = useHistory();
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();

  const nextRef = useRef(null);

  const id = parseInt(location.pathname.match(/\/([^/]+)\/?$/)[1]);

  const { items, next } = useSelector(makeSelectAllChatsInfo());

  useEffect(() => {
    nextRef.current = { next };
  }, [next]);

  useLazyLoad(
    '#chat-menu-scroll div',
    () => {
      dispatch(getMoreChatsInfo());
    },
    [],
    () => nextRef.current.next
  );

  const openChat = (id) => {
    history.push(`${match.url}/${id}`);
  };

  const searchOnChange = (e) => {
    // TO-DO - Elastic Search
  };

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
          {items.map((item, index) => {
            return (
              <div
                key={`chat-item-${item.patient.id}`}
                onClick={() => openChat(item.patient.id)}
                className={chatListItemStyle(items.length - 1, item, index, id)}
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
                  {!item?.unread ? (
                    <span></span>
                  ) : (
                    <Badge
                      count={item.unread}
                      style={{ backgroundColor: COLOR_1 }}
                    />
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

export default React.memo(ChatMenu);
