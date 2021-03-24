import React from 'react';
import IntlMessage from '../IntlMessage';

const LocaleString = ({ isLocaleOn, localeKey }) => {
  const setLocale = (isLocaleOn, localeKey) =>
    isLocaleOn ? <IntlMessage id={localeKey} /> : localeKey.toString();

  return setLocale(isLocaleOn, localeKey);
};

export default LocaleString;
