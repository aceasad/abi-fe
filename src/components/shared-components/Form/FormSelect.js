import React from 'react';
import { Menu, Dropdown } from 'antd';
import { CaretDownOutlined } from '@ant-design/icons';
import messages from 'views/app-views/StaffPage/messages';
import { useIntl } from 'react-intl';
import { ErrorMessage } from 'formik';

const FormSelect = ({
  defaultOption,
  options,
  form: { setFieldValue, setFieldTouched },
  field,
  label,
  optionField,
  placeholder,
  errorTexts,
}) => {
  const { formatMessage } = useIntl();

  const placeholderLabel = placeholder || formatMessage(messages.selectOption);

  const handleSelected = ({ key }) => {
    setFieldValue(field.name, key);
  };

  const menu = (
    <Menu onClick={handleSelected}>
      {options.map((item) => (
        <Menu.Item key={item.id}>{item[optionField]}</Menu.Item>
      ))}
    </Menu>
  );

  const defaultErrorMessage = (msg) =>
    formatMessage(msg, {
      label,
    });

  return (
    <div>
      {label && <label>{label}</label>}
      <Dropdown
        overlay={menu}
        trigger={['click']}
        onClick={() => setFieldTouched(field.name, true)}
      >
        <span>
          {defaultOption ? defaultOption[optionField] : placeholderLabel}{' '}
          <CaretDownOutlined />
        </span>
      </Dropdown>
      <ErrorMessage name={field.name}>
        {errorTexts
          ? (msg) => formatMessage(msg, errorTexts)
          : defaultErrorMessage}
      </ErrorMessage>
    </div>
  );
};

FormSelect.defaultProps = {
  options: [],
  errorTexts: false,
};

export default FormSelect;
