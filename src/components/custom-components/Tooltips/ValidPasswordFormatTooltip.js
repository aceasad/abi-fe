import React from 'react';
import { interpolate } from 'utils/interpolate';
import messages from './messages';
import { passwordMinLength } from 'constants/Validation';

const ValidPasswordFormatTooltip = () => {
  return (
    <div>
      <div>
        {interpolate(messages.minimumCharacters, { min: passwordMinLength })}
      </div>
      <div>{messages.upperAndLowerMixture}</div>
      <div>{messages.lettersAndNumberMixture}</div>
      <div>{messages.specialCharacters}</div>
      <div>{messages.specialCharactersExcluded}</div>
    </div>
  );
};

export default ValidPasswordFormatTooltip;
