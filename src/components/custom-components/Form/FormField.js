import React from 'react';
import { Form, Input, Tooltip } from 'antd';
import { useIntl } from 'react-intl';

const FormField = ({
  form: { handleBlur, handleChange, touched, errors },
  field,
  labelComponent: Label,
  secureField,
  errorTexts,
  label,
  labelBlock,
  tooltipText,
  required,
  numberField,
  ...props
}) => {
  const InputField = secureField ? Input.Password : Input;

  const { formatMessage } = useIntl();

  const getLabel = () => {
    if (Label) {
      return <Label />;
    }
    return label;
  };

  const defaultErrorMessage = () =>
    formatMessage(errors[field.name], {
      label,
    });

  const triggerError = () => touched[field.name] && errors[field.name];

  const showError = () =>
    triggerError() &&
    (errorTexts
      ? formatMessage(errors[field.name], errorTexts)
      : defaultErrorMessage());

  const FormItem = (
    <Form.Item
      validateStatus={triggerError() && 'error'}
      help={showError()}
      className={labelBlock ? 'label-block' : ''}
      label={getLabel()}
      required={required}
    >
      <InputField
        name={field.name}
        onChange={handleChange}
        onBlur={handleBlur}
        value={field.value}
        {...props}
      />
    </Form.Item>
  );

  return (
    <div>
      {Tooltip ? (
        <Tooltip placement="bottomRight" title={tooltipText}>
          {FormItem}
        </Tooltip>
      ) : (
        FormItem
      )}
    </div>
  );
};

export default FormField;
