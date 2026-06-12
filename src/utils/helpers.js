import { WS_CHAT_URL, WS_NOTIFICATION_URL } from 'constants/ApiConstant';
import { MESSAGE_TYPE, MESSAGE_STATUS } from 'constants/ChatConstants';
import { MONTH_FORMAT_MM, YEAR_FORMAT_YYYY } from 'constants/DateConstant';
import { COUNTRY_CODES } from 'constants/CountryCodesConstants';
import dayjs from './dayjs';
import { NO_SHOW_SCORE_THRESHOLD } from './constants';
import { Typography } from 'antd';
import { getStaffDetails } from 'redux/actions/Staff';

export const prepareFormData = (obj) =>
  Object.keys(obj).reduce((accumulator, currentValue) => {
    accumulator.append(camelCaseToSnakeCase(currentValue), obj[currentValue]);
    return accumulator;
  }, new FormData());

export const camelCaseToSnakeCase = (str) =>
  str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

export const filterEmptyObjectFeilds = (obj) =>
  Object.keys(obj).reduce(
    (accumulator, key) =>
      obj[key] !== '' ? { ...accumulator, [key]: obj[key] } : accumulator,
    {}
  );

export const mapNullObjectFeildsToString = (obj) =>
  Object.keys(obj).reduce(
    (accumulator, key) => ({
      ...accumulator,
      [key]: obj[key] === null ? '' : obj[key],
    }),
    {}
  );

export const mapEmptyStingObjectFeildsToNull = (obj) =>
  Object.keys(obj).reduce(
    (accumulator, key) => ({
      ...accumulator,
      [key]: obj[key] === '' ? null : obj[key],
    }),
    {}
  );

const SORTED_COUNTRY_CODE_IDS = [
  ...new Set(COUNTRY_CODES.map(({ id }) => id)),
].sort((a, b) => b.length - a.length);

export const normalizeLocalPhoneNumber = (phoneNumber) => {
  if (phoneNumber == null || phoneNumber === '') {
    return '';
  }

  const digits = String(phoneNumber).replace(/\D/g, '');
  if (!digits) {
    return '';
  }

  return digits.startsWith('0') ? digits.slice(1) : digits;
};

export const joinPhoneNumberWithCountryCode = (countryCode, localPhoneNumber) =>
  `${countryCode || ''}${normalizeLocalPhoneNumber(localPhoneNumber)}`;

export const splitPhoneNumberByCountryCode = (fullPhoneNumber) => {
  const emptyResult = { country_code: '', phone_number: '' };

  if (!fullPhoneNumber) {
    return emptyResult;
  }

  const digits = String(fullPhoneNumber).replace(/\D/g, '');
  if (!digits) {
    return emptyResult;
  }

  const matchedCountryCode = SORTED_COUNTRY_CODE_IDS.find(
    (countryCode) =>
      digits.startsWith(countryCode) && digits.length > countryCode.length
  );

  if (matchedCountryCode) {
    return {
      country_code: matchedCountryCode,
      phone_number: normalizeLocalPhoneNumber(
        digits.slice(matchedCountryCode.length)
      ),
    };
  }

  return {
    country_code: '',
    phone_number: normalizeLocalPhoneNumber(digits),
  };
};

export const chatListItemStyle = (
  chatListLength,
  currentItemId,
  currentItemIndex,
  selectedItemId
) => {
  const lastItem = currentItemIndex === chatListLength - 1 ? 'last' : '';
  const selectedItem = currentItemId === selectedItemId ? 'selected' : '';

  return `chat-menu-list-item ${lastItem} ${selectedItem}`;
};

export const singleChatMessageStyle = (message) => {
  const messageTypeStyle =
    message?.type === MESSAGE_TYPE.DIVIDER ? 'datetime' : '';
  const messageFromStyle = message.is_answer ? 'msg-sent' : 'msg-recipient';
  return `msg ${messageTypeStyle} ${messageFromStyle}`;
};

export const filterNumberInput = (e) =>
  (e.keyCode === 69 ||
    e.keyCode === 189 ||
    e.keyCode === 190 ||
    e.keyCode === 187) &&
  e.preventDefault();

export const prepareAppointmentData = (values) => {
  if (
    values.hasOwnProperty('missing_reason') &&
    values.missing_reason === undefined
  ) {
    delete values['missing_reason'];
  }
  if (!values.hasOwnProperty('missing_reason')) {
    delete values['missing_reason_details'];
  }

  if (
    values.hasOwnProperty('cancellation_reason') &&
    values.cancellation_reason === undefined
  ) {
    delete values['cancellation_reason'];
  }
  if (!values.hasOwnProperty('cancellation_reason')) {
    delete values['cancellation_reason_details'];
  }

  let { date, time, patient, price, ...otherValues } = values;
  const startDatetime = dayjs(`${date} ${time}`, 'DD/MM/YYYY HH:mm').format(
    'YYYY-MM-DDTHH:mm'
  );

  patient = parseInt(patient);
  price = parseFloat(price);
  const preparedData = prepareFormData({
    ...otherValues,
    patient,
    price,
    startDatetime,
  });

  return preparedData;
};

export const getYearAndMonth = (date) => {
  const dayjsDate = dayjs(date);
  return {
    year: dayjsDate.format(YEAR_FORMAT_YYYY),
    month: dayjsDate.format(MONTH_FORMAT_MM),
  };
};

export const convertDateTimeStringToUtcString = (
  datetime,
  inputFormat,
  outputFormat
) => dayjs(datetime, inputFormat).utc().format(outputFormat);

export const formHasError = (fields, errors) =>
  fields.some((fieldName) => !!errors[fieldName]);

export const generateKey = () => Math.random().toString(36).substring(7);

export const formatMessageTimestamp = (timestamp, country = '') => {
  const dayjsDate = dayjs(timestamp).local();
  const isSame = dayjs().local().isSame(dayjsDate, 'd');
  return dayjsDate.format(isSame ? 'h:mm' : getDateFormatByCountry(country));
};

export const formatMessagesTimestampMinutes = (timestamp) =>
  dayjs(timestamp).local().format('h:mm a');

export const isSameDay = (timestamp1, timestamp2) =>
  dayjs(timestamp1).local().isSame(dayjs(timestamp2).local(), 'd');

export const formatMessagesTimestampDate = (timestamp, country = '') =>
  dayjs(timestamp).local().format(getDateFormatByCountry(country));

export const generateDividerMessage = (date, country = '') => {
  const formattedDate = formatMessagesTimestampDate(date, country);
  return {
    created_at: formattedDate,
    type: MESSAGE_TYPE.DIVIDER,
    id: `divider-${formattedDate}-${dayjs(date).valueOf()}`,
  };
};

export const isDisplayableChatMessage = (message) => {
  if (!message || message.type === MESSAGE_TYPE.DIVIDER) {
    return false;
  }
  return Boolean(message.text?.trim());
};

export const shouldRenderChatListItem = (message) =>
  message?.type === MESSAGE_TYPE.DIVIDER || isDisplayableChatMessage(message);

// hasMoreMessages - if there is more messages on BE for lazy load
// If there is no more messages to load -> add date divider as first element
export const addDividers = (messages, hasMoreMessages, country = '') => {
  const displayableMessages = messages.filter(isDisplayableChatMessage);
  if (!displayableMessages.length) {
    return [];
  }
  if (displayableMessages.length === 1) {
    return [
      generateDividerMessage(displayableMessages[0].created_at, country),
      ...displayableMessages,
    ];
  }
  const added = displayableMessages.reduce((acc, item) => {
    if (acc.length) {
      if (isSameDay(acc[acc.length - 1].created_at, item.created_at)) {
        return [...acc, item];
      } else {
        return [...acc, generateDividerMessage(item.created_at, country), item];
      }
    } else {
      return [item];
    }
  }, []);

  if (!hasMoreMessages && added.length) {
    return [generateDividerMessage(added[0].created_at, country), ...added];
  }
  return added;
};

export const createWebsocketUrl = (token) => {
  return `${WS_CHAT_URL}?token=${token.access}`;
};

export const createWebsocketNotificationUrl = (token) => {
  return `${WS_NOTIFICATION_URL}?token=${token.access}`;
}

export const formatMessageForSocketSend = (text, patientId) =>
  JSON.stringify({ text, patient_id: patientId });

export const parseReceivedEvent = (event) => JSON.parse(event.data);

export const isTimestampInTheLast24Hours = (timestamp) => {
  const oneDayAgo = dayjs().local().subtract(24, 'hours');
  return dayjs(timestamp).local().isSameOrAfter(oneDayAgo);
};

export const updateChatMenuItems = (
  selectedChat,
  newMessagePayload,
  chatMenuItems,
  isChatOpen
) => {
  const lastMessage = {
    id: newMessagePayload.id,
    text: newMessagePayload.text,
    created_at: newMessagePayload.created_at,
    status: isChatOpen ? MESSAGE_STATUS.READ : newMessagePayload.status,
    is_answer: newMessagePayload.is_answer,
  };

  return selectedChat
    ? [
      {
        patient: selectedChat.patient,
        last_message: lastMessage,
      },
      ...chatMenuItems.filter(
        (item) => item.patient.id !== selectedChat.patient.id
      ),
    ]
    : [
      {
        patient: newMessagePayload.patient,
        last_message: lastMessage,
      },
      ...chatMenuItems,
    ];
};

export const updateConversation = (conversation, newMessagePayload) => {
  return {
    ...conversation,
    items: [...conversation.items, newMessagePayload],
    count: conversation.count + 1,
    offset: conversation.offset + 1,
    scrollDown: true,
  };
};

export const getNoShowScore = (data) => Number(data?.no_show_score || '0');

export const RenderPredictionText = (data) => {
  const likelyToBeMissed =
    "Likely to be missed";
  const likelyToBeAttended =
    "Likely to be attended";

  const noShowScore = getNoShowScore(
    data && data.hasOwnProperty('no_show_score')
      ? data
      : { no_show_score: data }
  );

  const predictionText =
    noShowScore >= NO_SHOW_SCORE_THRESHOLD
      ? likelyToBeMissed
      : likelyToBeAttended;
  return (
    <Typography.Text
      type={predictionText === likelyToBeMissed ? 'danger' : 'success'}
    >
      {predictionText}
    </Typography.Text>
  );
};

export const getSafe = (fn, defaultValue) => {
  try {
    return fn();
  } catch (err) {
    return defaultValue;
  }
};

export const removeLeadingZeroFromTime = (time) => {
  if (time && time[0] === '0') {
    return time.slice(1);
  }
  return time;
};

const US_COUNTRY_IDENTIFIERS = new Set([
  'us',
  'usa',
  'unitedstates',
  'america',
  'unitedstatesofamerica',
]);

export const isUsCountry = (country = '') => {
  const normalizedCountry = String(country)
    .trim()
    .toLowerCase()
    .replace(/[^a-z]/g, '');
  if (!normalizedCountry) return false;
  if (US_COUNTRY_IDENTIFIERS.has(normalizedCountry)) return true;
  return (
    normalizedCountry.startsWith('us') ||
    normalizedCountry.includes('unitedstates') ||
    normalizedCountry.includes('america')
  );
};

export const getClinicTimezone = (clinic) =>
  clinic?.timezone ||
  (isUsCountry(clinic?.country) ? 'America/New_York' : 'Europe/London');

export const getDateFormatByCountry = (country = '') =>
  isUsCountry(country) ? 'MM/DD/YYYY' : 'DD/MM/YYYY';

export const formatDateByCountry = (
  dateValue,
  country = '',
  inputFormats = []
) => {
  if (!dateValue) {
    return '';
  }

  let parsedDate = null;

  // Try each input format strictly first to avoid ambiguous parsing
  if (inputFormats.length) {
    for (const fmt of inputFormats) {
      const attempt = dayjs(dateValue, fmt, true);
      if (attempt.isValid()) {
        parsedDate = attempt;
        break;
      }
    }
  }

  // Fall back to dayjs default parsing only if no strict format matched
  if (!parsedDate || !parsedDate.isValid()) {
    parsedDate = dayjs(dateValue);
  }

  return parsedDate.isValid()
    ? parsedDate.format(getDateFormatByCountry(country))
    : dateValue;
};

export const formatDateTimeByCountry = (
  dateTimeValue,
  country = '',
  timeFormat = 'hh:mm A',
  inputFormats = []
) => {
  if (!dateTimeValue) {
    return '';
  }

  let parsedDateTime = dayjs(dateTimeValue);
  if (!parsedDateTime.isValid() && inputFormats.length) {
    parsedDateTime = dayjs(dateTimeValue, inputFormats, true);
  }
  if (!parsedDateTime.isValid() && inputFormats.length) {
    parsedDateTime = dayjs(dateTimeValue, inputFormats);
  }
  if (!parsedDateTime.isValid()) {
    return dateTimeValue;
  }

  parsedDateTime = parsedDateTime.local();
  const formattedDate = parsedDateTime.format(getDateFormatByCountry(country));
  const formattedTime = parsedDateTime.format(timeFormat);
  return `${formattedDate} ${formattedTime}`.trim();
};

export const formatTimeTo12Hour = (time) => {
  if (!time) return '';
  const match = /^(\d{1,2}):(\d{2})(?:\s*([aApP][mM]))?$/.exec(
    String(time).trim()
  );
  if (!match) return time;

  const hour = Number(match[1]);
  const minute = match[2];
  const meridiem = match[3]?.toLowerCase();

  if (meridiem && hour >= 1 && hour <= 12) {
    return `${hour}:${minute} ${meridiem}`;
  }

  if (Number.isNaN(hour) || hour < 0 || hour > 23) {
    return time;
  }

  const suffix = hour >= 12 ? 'pm' : 'am';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minute} ${suffix}`;
};

export const formatTimeByCountry = (time, country = '') => {
  if (!time) return '';
  return isUsCountry(country) ? formatTimeTo12Hour(time) : time;
};

export const formatSectionDateTimeByCountry = (section, country = '') => {
  if (!section?.date || !section?.time) {
    return '';
  }

  const formattedDate = formatDateByCountry(section.date, country, [
    'DD/MM/YYYY',
    'D/M/YYYY',
    'MM/DD/YYYY',
    'M/D/YYYY',
    'YYYY-MM-DD',
  ]);
  const formattedTime = isUsCountry(country)
    ? formatTimeTo12Hour(section.time)
    : section.time;

  return `${formattedDate} ${formattedTime}`.trim();
};
