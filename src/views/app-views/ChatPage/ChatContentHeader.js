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
  onClickMarkHumanRequiredResolved,
  onClickMarkInEmergencySituationResolved,
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

  const onClickMarkHumanRequiredResolvedWrapper = (patient_id) => {
    setResolveClicked(true);
    onClickMarkHumanRequiredResolved(patient_id);
  };

  const onClickMarkInEmergencySituationResolvedWrapper = (patient_id) => {
    setResolveClicked(true);
    onClickMarkInEmergencySituationResolved(patient_id);
  };

  const onClickMarkInOptOutWrapper = (patient_id) => {
    setResolveClicked(true);
    // onClickMarkInOptOutResolved(patient_id);
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

  const is_human_required_or_in_emergency_situation =
    chatInfo?.patient?.is_human_required ||
    chatInfo?.patient?.is_in_emergency_situation ||
    chatInfo?.patient?.is_in_opt_out_situation;

  let blinkClass = '';
  let nameWithSuffix = chatInfo?.patient?.full_name;
  let nameWrapper = <span>{nameWithSuffix}</span>;
  if (chatInfo?.patient?.is_human_required) {
    // nameWithSuffix = `${chatInfo.patient.full_name} - Requested to speak to human`;
    blinkClass = ' blink-human-required';
    nameWrapper = <span>{nameWithSuffix}</span>;
  }
  // override human is required as more important
  if (chatInfo?.patient?.is_in_emergency_situation) {
    // nameWithSuffix = `${chatInfo.patient.full_name} - In emergency situation`;
    blinkClass = ' blink-in-emergency-situation';
    nameWrapper = <span>{nameWithSuffix}&nbsp;&#9888;</span>;
  }
  if (chatInfo?.patient?.is_in_opt_out_situation) {
    // nameWithSuffix = `${chatInfo.patient.full_name} - In emergency situation`;
    blinkClass = 'blink-in-opt-out';
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
        {!chatLoading && chatInfo.patient.is_human_required && (
          <Checkbox
            key="checkbox-human-resolve"
            defaultChecked={false}
            disabled={isLoading || resolveClicked}
            onChange={() =>
              onClickMarkHumanRequiredResolvedWrapper(chatInfo.patient.id)
            }
          >
            {formatMessage(messages.contactedPatient)}
          </Checkbox>
        )}
        {!chatLoading && chatInfo.patient.is_in_emergency_situation && (
          <Checkbox
            key="checkbox-emergency-resolve"
            defaultChecked={false}
            disabled={isLoading || resolveClicked}
            onChange={() =>
              onClickMarkInEmergencySituationResolvedWrapper(
                chatInfo.patient.id
              )
            }
          >
            {formatMessage(messages.emergencyResolved)}
          </Checkbox>
        )}
        {!chatLoading && chatInfo.patient.is_in_opt_out_situation && (
          <Checkbox
            key="checkbox-optout-resolve"
            defaultChecked={false}
            disabled={isLoading || resolveClicked}
            onChange={() =>
              onClickMarkInOptOutWrapper(
                chatInfo.patient.id
              )
            }
          >
            {formatMessage(messages.optOut)}
          </Checkbox>
        )}

        {!chatLoading && (
          <Checkbox
            key="checkbox-rasa-x"
            defaultChecked={chatInfo?.patient?.is_rasa_paused}
            disabled={isLoading}
            onChange={() =>
              mutate(chatInfo.patient.id, {
                onSuccess: () =>
                  dispatch(toggleRasaActivity(chatInfo.patient.id)),
              })
            }
          >
            {formatMessage(
              chatInfo?.patient?.is_rasa_paused
                ? messages.unpauseAsa
                : messages.pauseAsa
            )}
          </Checkbox>
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
