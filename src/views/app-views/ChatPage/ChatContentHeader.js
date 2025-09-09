import {
  AudioMutedOutlined,
  DeleteOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Menu } from 'antd';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import React, { Fragment } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { makeSelectSingleChatInfo } from 'redux/selectors/Chats';
import messages from './messages';
import { setPatientShowMessages } from 'redux/actions/Patient';
import { ROUTES } from 'routes';

const ChatContentHeader = ({
  showTitle,
  chatLoading,
  isMenuVisible,
  BackAction,
}) => {
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
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
  ];

  const renderMenu = (patient_id) => {
    const menuItems = menuOptions.map((menu, index) => ({
      key: index.toString(),
      icon: <menu.Icon />,
      label: formatMessage(menu.message),
      onClick: menu.onClick ? ({ domEvent }) => menu.onClick(domEvent)(patient_id) : null,
    }));

    return {
      items: menuItems
    };
  };

  let nameWithSuffix = chatInfo?.patient?.full_name;
  let nameWrapper = <span>{nameWithSuffix}</span>;

  if (chatInfo?.patient?.is_in_emergency_situation) {
    nameWrapper = <span>{nameWithSuffix}&nbsp;&#9888;</span>;
  }
  if (chatInfo?.patient?.is_in_opt_out_situation) {
    nameWrapper = <span>{nameWithSuffix}&nbsp;&#9888;</span>;
  }

  return (
    chatInfo && (
      <div className="chat-content-header">
        {showTitle && (
          <h4
            onClick={(e) => {
              e.stopPropagation();
              goToPatientShowMessages({ id: chatInfo.patient.id });
            }}
            className="mb-0 cursor-pointer"
          >
            {nameWrapper}
          </h4>
        )}
        {isMenuVisible && (
          <div>
            <EllipsisDropdown menu={renderMenu(chatInfo?.patient?.id)} />
          </div>
        )}
        {BackAction && <BackAction />}
      </div>
    )
  );
};

export default ChatContentHeader;