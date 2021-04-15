import React, { useEffect } from 'react';
import Modal from 'antd/lib/modal/Modal';
import { useIntl } from 'react-intl';
import { Field, Formik } from 'formik';
import messages from './messages';
import FormRadio from 'components/custom-components/Form/FormRadio';
import FormSelect from 'components/custom-components/Form/FormSelect';
import Form from 'antd/lib/form/Form';
import FormTextArea from 'components/custom-components/Form/FormTextArea';
import { endAppointmentSchema } from 'utils/validations';
import { useDispatch, useSelector } from 'react-redux';
import { endAppointemnt, getMissingReasons } from 'redux/actions/Appointment';
import {
  makeSelectMissingReasons,
  makeSelectSingleAppointmentLoading,
} from 'redux/selectors/Appointment';
import { message } from 'antd';

const prepareData = (values) => {
  const missing_reason_details = values.missing_reason_details.length
    ? values.missing_reason_details
    : null;
  return {
    ...values,
    missing_reason: values.attended ? null : values.missing_reason,
    missing_reason_details: values.attended ? null : missing_reason_details,
  };
};

const EndAppointment = ({ handleClose, id }) => {
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();

  const missingReasons = useSelector(makeSelectMissingReasons());

  const loading = useSelector(makeSelectSingleAppointmentLoading());

  const afterEnd = () => {
    message.success(formatMessage(messages.endSuccess));
    handleClose();
  };

  const handleSubmit = (values) => {
    dispatch(
      endAppointemnt({
        id,
        data: prepareData(values),
        missing_reason: missingReasons.find(
          (missingReason) => missingReason.id === values.missing_reason
        ),
        afterEnd,
      })
    );
  };

  useEffect(() => {
    dispatch(getMissingReasons());
  }, []);

  const options = [
    { id: true, name: formatMessage(messages.yes) },
    { id: false, name: formatMessage(messages.no) },
  ];

  return (
    <Formik
      initialValues={{
        attended: true,
        missing_reason: '',
        missing_reason_details: '',
      }}
      onSubmit={handleSubmit}
      validationSchema={endAppointmentSchema}
    >
      {({ values, handleSubmit, isValid }) => (
        <Modal
          visible
          title={formatMessage(messages.endAppointment)}
          okText={formatMessage(messages.confirm)}
          cancelText={formatMessage(messages.cancel)}
          onCancel={handleClose}
          okButtonProps={{ disabled: !isValid || loading }}
          onOk={handleSubmit}
        >
          <Form layout="vertical">
            {formatMessage(messages.attendedQuestion)}
            <Field
              name="attended"
              component={FormRadio}
              options={options}
              optionField="name"
            />
            {!values.attended && (
              <div>
                <Field
                  component={FormSelect}
                  name="missing_reason"
                  options={missingReasons}
                  optionField="name"
                  label={formatMessage(messages.missingReason)}
                  errorTexts={{ label: formatMessage(messages.reason) }}
                  required
                />
                <Field
                  component={FormTextArea}
                  name="missing_reason_details"
                  rows={4}
                  label={formatMessage(messages.details)}
                />
              </div>
            )}
          </Form>
        </Modal>
      )}
    </Formik>
  );
};

export default EndAppointment;
