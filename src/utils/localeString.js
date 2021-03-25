import IntlMessage from 'components/util-components/IntlMessage';

const localeString = (isLocaleOn, localeKey) =>
  isLocaleOn ? <IntlMessage id={localeKey} /> : localeKey.toString();

export default localeString;
