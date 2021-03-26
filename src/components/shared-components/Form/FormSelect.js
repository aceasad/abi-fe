import React from 'react';
import { Menu, Dropdown, Form, Select } from 'antd';
import { CaretDownOutlined } from '@ant-design/icons';
import messages from 'views/app-views/StaffPage/messages';
import { useIntl } from 'react-intl';
import { ErrorMessage } from 'formik';

const { Option } = Select;

const FormSelect = ({
  defaultOption,
  options,
  form: { setFieldValue, setFieldTouched },
  field,
  label,
  optionField,
  placeholder,
  errorTexts,
  name,
}) => {
  const { formatMessage } = useIntl();

  const placeholderText = placeholder || formatMessage(messages.selectOption);

  const handleSelected = (value) => {
    setFieldValue(field.name, value);
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
    <Form.Item label={label}>
      <Select
        placeholder={
          defaultOption ? defaultOption[optionField] : placeholderText
        }
        onChange={handleSelected}
        onClick={() => setFieldTouched(field.name, true)}
      >
        {options.map((item) => (
          <Option key={item.id} value={item.id}>
            {item[optionField]}
          </Option>
        ))}
      </Select>
      <div className="authentication-error">
        <ErrorMessage name={field.name}>
          {errorTexts
            ? (msg) => formatMessage(msg, errorTexts)
            : defaultErrorMessage}
        </ErrorMessage>
      </div>
    </Form.Item>
  );
};

FormSelect.defaultProps = {
  options: [],
  errorTexts: false,
};

export default FormSelect;
