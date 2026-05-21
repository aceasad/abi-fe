import React from 'react';
import { interpolate } from 'utils/interpolate';
import { passwordMinLength } from 'constants/Validation';

const ValidPasswordFormatTooltip = () => {
  return (
    <div>
      <div>
        {interpolate("At least {min} characters", { min: passwordMinLength })}
      </div>
      <div>{"A mixture of both uppercase and lowercase letters"}</div>
      <div>{"A mixture of letters and numbers"}</div>
      <div>{"Inclusion of at least one special character, e.g., ! @ # ? ]"}</div>
      <div>{"Note: do not use < or > in your password, as both can cause problems in Web browsers"}</div>
    </div>
  );
};

export default ValidPasswordFormatTooltip;
