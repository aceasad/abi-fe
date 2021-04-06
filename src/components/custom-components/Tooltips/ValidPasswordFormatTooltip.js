import React from 'react';
import messages from './messages';
import { useIntl } from 'react-intl';
import { passwordMinLength } from 'constants/Validation';

const ValidPasswordFormatTooltip = () => {
  const { formatMessage } = useIntl();
  return (
    <div>
      <div>
        {formatMessage(messages.minimumCharacters, { min: passwordMinLength })}
      </div>
      <div>{formatMessage(messages.upperAndLowerMixture)}</div>
      <div>{formatMessage(messages.lettersAndNumberMixture)}</div>
      <div>{formatMessage(messages.specialCharacters)}</div>
      <div>{formatMessage(messages.specialCharactersExcluded)}</div>
    </div>
  );
};

export default ValidPasswordFormatTooltip;
