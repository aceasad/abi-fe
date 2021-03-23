import React from "react";
import { ErrorMessage } from "formik";
import { Form, Input, Tooltip } from "antd";
import { useIntl } from "react-intl";

const FormField = ({
  form: { handleBlur, handleChange },
  field,
  labelComponent: Label,
  secureField,
  errorTexts,
  label,
  labelBlock,
  tooltipText,
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
  const defaultErrorMessage = (msg) =>
    formatMessage(msg, {
      label,
    });

  const FormItem = (
    <Form.Item
      className={labelBlock ? "label-block" : ""}
      label={getLabel()}
    >
      <InputField
        name={field.name}
        onChange={handleChange}
        onBlur={handleBlur}
        value={field.value}
        {...props}
      />
      <div className="authentication-error">
        <ErrorMessage name={field.name}>
          {errorTexts
            ? (msg) => formatMessage(msg, errorTexts)
            : defaultErrorMessage}
        </ErrorMessage>
      </div>
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
