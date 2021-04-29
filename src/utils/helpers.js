import { MESSAGE_TYPE, MESSAGE_FROM } from 'constants/ChatConstants';
import { MONTH_FORMAT_MM, YEAR_FORMAT_YYYY } from 'constants/DateConstant';
import moment from 'moment';

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

export const chatListItemStyle = (
  chatListLength,
  currentItem,
  currentItemIndex,
  selectedItemId
) => {
  const lastItem = currentItemIndex === chatListLength - 1 ? 'last' : '';
  const selectedItem = currentItem.id === selectedItemId ? 'selected' : '';

  return `chat-menu-list-item ${lastItem} ${selectedItem}`;
};

export const singleChatMessageStyle = (message) => {
  const messageTypeStyle =
    message.msgType === MESSAGE_TYPE.DATE ? 'datetime' : '';
  const messageFromStyle =
    message.from === MESSAGE_FROM.OPPOSITE
      ? 'msg-recipient'
      : message.from === MESSAGE_FROM.ME
      ? 'msg-sent'
      : '';

  return `msg ${messageTypeStyle} ${messageFromStyle}`;
};

export const filterNumberInput = (e) =>
  (e.keyCode === 69 ||
    e.keyCode === 189 ||
    e.keyCode === 190 ||
    e.keyCode === 187) &&
  e.preventDefault();

export const prepareAppointmentData = (values) => {
  let { date, time, patient, price, ...otherValues } = values;
  const startDatetime = moment(`${date} ${time}`, 'DD-MMM-YYYY HH:mm').format(
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
  const momentDate = moment(date);
  return {
    year: momentDate.format(YEAR_FORMAT_YYYY),
    month: momentDate.format(MONTH_FORMAT_MM),
  };
};

export const convertDateTimeStringToUtcString = (
  datetime,
  inputFormat,
  outputFormat
) => moment(datetime, inputFormat).utc().format(outputFormat);

export const formHasError = (fields, errors) =>
  fields.some((fieldName) => !!errors[fieldName]);

export const generateKey = () => Math.random().toString(36).substring(7);
