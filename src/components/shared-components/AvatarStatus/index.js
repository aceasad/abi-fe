import React from 'react';
import PropTypes from 'prop-types';
import { Avatar } from 'antd';

const renderAvatar = (props) => {
  return (
    <Avatar {...props} className={`ant-avatar-${props.type}`}>
      {props.text}
    </Avatar>
  );
};

const getStatusColor = (status) => {
  console.log('status', status);
  if (status === 'RESCHEDULED' || status === 'BOOKED' || status === 'REMINDED') {
    return '#18D9C5'; // Green
  } else if (status === 'ASKED_QUESTION' || status === 'RESCHEDULING' || status === 'CANCELLING' || status === 'BOOKING' || status === 'INVITED' || status === 'INCOMPLETE' || status === 'SCREENED_ELSEWHERE' || status === 'HUMAN_INTERVENTION' || status === 'SNOOZED') {
    return '#FFBF00'; // Yellow
  } else if (status === 'CANCELLED' || status === 'NO_RESPONSE' || status === 'INACTIVE' || status === 'INCOMPLETE' || status === 'OPT_OUT' || status === 'DECLINED' || status === 'EMERGENCY_SITUATION') {
    return '#FF474C'; // Red
  } else {
    return '#E880FF'; // Default color
  }
};

export const AvatarStatus = (props) => {
  const {
    name,
    suffix,
    subTitle,
    id,
    type,
    src,
    icon,
    size,
    shape,
    gap,
    text,
    is_human_required,
    is_in_emergency_situation,
    is_in_opt_out_situation,
    communication_status,
    onNameClick,
  } = props;

  let blinkClass = '';
  let nameWithSuffix = name;
  let nameWrapper = <span>{nameWithSuffix}</span>;
  if (is_human_required) {
    // nameWithSuffix = `${chatInfo.patient.full_name} - Requested to speak to human`;
    blinkClass = ' blink-human-required';
    nameWrapper = <span>{nameWithSuffix}</span>;
  }
  // override human is required as more important
  if (is_in_emergency_situation) {
    // nameWithSuffix = `${chatInfo.patient.full_name} - In emergency situation`;
    blinkClass = ' blink-in-emergency-situation';
    nameWrapper = <span>{nameWithSuffix}&nbsp;&#9888;</span>;
  }
  if (is_in_opt_out_situation) {
    blinkClass = ' blink-in-opt-out';
    nameWrapper = <span>{nameWithSuffix}&nbsp;&#9888;</span>;
  }

  const statusDot = (
    <span
      style={{
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        backgroundColor: getStatusColor(communication_status),
        display: 'inline-block',
        marginLeft: '6px'
      }}
    />
  );

  return (
    <div className="avatar-status d-flex align-items-center">
      {renderAvatar({ icon, src, type, size, shape, gap, text })}
      <div className="ml-2">
        <div>
          {onNameClick ? (
            <div
              onClick={() => onNameClick({ name, subTitle, src, id })}
              className={`avatar-status-name clickable${blinkClass}`}
            >
              {nameWrapper}
              {statusDot}
            </div>
          ) : (
            <div className={`avatar-status-name${blinkClass}`}>
              {nameWrapper}
              {statusDot}
            </div>
          )}
          <span>{suffix}</span>
        </div>
        <div className="text-muted avatar-status-subtitle">{subTitle}</div>
      </div>
    </div>
  );
};

AvatarStatus.propTypes = {
  name: PropTypes.string,
  src: PropTypes.string,
  type: PropTypes.string,
  onNameClick: PropTypes.func,
  communication_status: PropTypes.string,
};

export default AvatarStatus;
