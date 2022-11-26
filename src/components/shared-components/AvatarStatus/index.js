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

  return (
    <div className="avatar-status d-flex align-items-center">
      {renderAvatar({ icon, src, type, size, shape, gap, text })}
      <div className="ml-2">
        <div>
          {onNameClick ? (
            <div
              onClick={() => onNameClick({ name, subTitle, src, id })}
              className="avatar-status-name clickable"
            >
              {nameWrapper}
            </div>
          ) : (
            <div className="avatar-status-name">{nameWrapper}</div>
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
};

export default AvatarStatus;
