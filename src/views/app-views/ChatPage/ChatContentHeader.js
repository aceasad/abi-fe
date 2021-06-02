import {
  AudioMutedOutlined,
  DeleteOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Checkbox, Menu } from 'antd';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import { useToggleRasaActivity } from 'queries/shared';
import React, { Fragment } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { toggleRasaActivity } from 'redux/actions/Chats';
import { makeSelectSingleChatInfo } from 'redux/selectors/Chats';
import messages from './messages';

const ChatContentHeader = ({
  showTitle,
  chatLoading,
  isMenuVisible,
  BackAction,
}) => {
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const { mutate, isLoading } = useToggleRasaActivity();

  const { chatInfo } = useSelector(makeSelectSingleChatInfo);

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
    chatInfo && (
      <div className="chat-content-header">
        {showTitle && <h4 className="mb-0">{chatInfo.patient.full_name}</h4>}
        {!chatLoading && (
          <Checkbox
            key={`checkbox-rasa-x`}
            defaultChecked={chatInfo.patient.is_rasa_paused}
            disabled={isLoading}
            onChange={() =>
              mutate(chatInfo.patient.id, {
                onSuccess: () =>
                  dispatch(toggleRasaActivity(chatInfo.patient.id)),
              })
            }
          >
            {formatMessage(messages.rasaPaused)}
          </Checkbox>
        )}
        {isMenuVisible && (
          <div>
            <EllipsisDropdown menu={renderMenu} />
          </div>
        )}
        {BackAction && <BackAction />}
      </div>
    )
  );
};

export default ChatContentHeader;
