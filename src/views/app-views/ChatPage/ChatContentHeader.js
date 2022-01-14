import {
  AudioMutedOutlined,
  DeleteOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Checkbox, Menu } from 'antd';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import { useToggleRasaActivity } from 'queries/shared';
import React, { Fragment, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { toggleRasaActivity } from 'redux/actions/Chats';
import { makeSelectSingleChatInfo } from 'redux/selectors/Chats';
import messages from './messages';
import { setPatientShowMessages } from 'redux/actions/Patient';
import { ROUTES } from 'routes';
import { useHistory } from 'react-router-dom';

const ChatContentHeader = ({
  showTitle,
  chatLoading,
  isMenuVisible,
  BackAction,
  onClickMarkResolved,
}) => {
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const { mutate, isLoading } = useToggleRasaActivity();

  const { chatInfo } = useSelector(makeSelectSingleChatInfo);

  const history = useHistory();
  const goToPatientShowMessages = (data) => {
    dispatch(setPatientShowMessages(data));
    history.push(ROUTES.PATIENTS);
  };

  const menuOptions = [
    {
      Icon: UserOutlined,
      message: messages.userInfo,
      shouldDivide: false,
      onClick: (domEvent) => {
        return (id) => {
          domEvent.stopPropagation();
          goToPatientShowMessages({ id });
        };
      },
    },
    // {
    //   Icon: AudioMutedOutlined,
    //   message: messages.muteChat,
    //   shouldDivide: true,
    // },
    // {
    //   Icon: DeleteOutlined,
    //   message: messages.deleteChat,
    //   shouldDivide: false,
    // },
  ];

  const [resolveClicked, setResolveClicked] = useState(false);

  const onClickMarkResolvedWrapper = (patient_id) => {
    setResolveClicked(true);
    onClickMarkResolved(patient_id);
  };

  const renderMenu = (patient_id) => {
    return (
      <Menu>
        {menuOptions.map((menu, index) => (
          <Fragment>
            <Menu.Item
              key={index.toString()}
              onClick={
                menu.onClick
                  ? ({ domEvent }) => menu.onClick(domEvent)(patient_id)
                  : null
              }
            >
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
        {showTitle && (
          <h4
            onClick={(e) => {
              e.stopPropagation();
              goToPatientShowMessages({ id: chatInfo.patient.id });
            }}
            className={`mb-0 cursor-pointer${
              chatInfo.patient.is_human_required ? ' blink' : ''
            }`}
          >
            {chatInfo.patient.full_name}
          </h4>
        )}
        {!chatLoading && chatInfo.patient.is_human_required && (
          <Checkbox
            key="checkbox-human-resolve"
            defaultChecked={false}
            disabled={isLoading || resolveClicked}
            onChange={() => onClickMarkResolvedWrapper(chatInfo.patient.id)}
          >
            {formatMessage(messages.markResolved)}
          </Checkbox>
        )}
        {!chatLoading && (
          <Checkbox
            key="checkbox-rasa-x"
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
            <EllipsisDropdown menu={renderMenu(chatInfo.patient.id)} />
          </div>
        )}
        {BackAction && <BackAction />}
      </div>
    )
  );
};

export default ChatContentHeader;
