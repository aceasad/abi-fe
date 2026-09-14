import React, { useEffect } from 'react';
import Modal from 'antd/lib/modal/Modal';
import Form from 'antd/lib/form/Form';
import { Field, Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { Typography } from 'antd';
import FormSelect from 'components/custom-components/Form/FormSelect';
import FormTextArea from 'components/custom-components/Form/FormTextArea';
import { getAppointmentCancellationReasons } from 'redux/actions/Appointment';
import { makeSelectAppointmentCancellationReasons } from 'redux/selectors/Appointment';

const { Paragraph } = Typography;

// Same reason + details form as CalendarPage/CancelAppointment, applied to every selected
// appointment at once. Cancelling the appointment cancels its ride(s) on the backend.
const CancelAppointmentsModal = ({
  appointmentIds,
  handleClose,
  handleConfirm,
  loading,
}) => {
  const dispatch = useDispatch();
  const { appointmentCancellationReasons } = useSelector(
    makeSelectAppointmentCancellationReasons()
  );

  useEffect(() => {
    if (!appointmentCancellationReasons?.length) {
      dispatch(getAppointmentCancellationReasons());
    }
  }, [dispatch, appointmentCancellationReasons?.length]);

  const count = appointmentIds.length;

  return (
    <Formik
      initialValues={{
        cancellation_reason: '',
        cancellation_reason_details: '',
      }}
      onSubmit={(values) =>
        handleConfirm({
          cancellation_reason: values.cancellation_reason,
          cancellation_reason_details: values.cancellation_reason_details.length
            ? values.cancellation_reason_details
            : null,
        })
      }
    >
      {({ values, handleSubmit }) => (
        <Modal
          open
          title={
            count > 1
              ? `Cancel ${count} appointments and their rides`
              : 'Cancel appointment and ride'
          }
          okText="Confirm"
          cancelText="Cancel"
          onCancel={handleClose}
          okButtonProps={{
            disabled: !values.cancellation_reason || loading,
            danger: true,
          }}
          confirmLoading={loading}
          onOk={handleSubmit}
        >
          <Paragraph type="secondary">
            {count > 1
              ? `This cancels ${count} appointments and every booked ride on them.`
              : 'This cancels the appointment and every booked ride on it.'}
          </Paragraph>
          <Form layout="vertical">
            <Field
              component={FormSelect}
              name="cancellation_reason"
              options={appointmentCancellationReasons}
              defaultOption={values.cancellation_reason}
              optionField="name"
              label="Why did the patient cancel the appointment?"
              errorTexts={{ label: 'Reason' }}
              required
            />
            <Field
              component={FormTextArea}
              name="cancellation_reason_details"
              rows={4}
              label="Cancellation details"
            />
          </Form>
        </Modal>
      )}
    </Formik>
  );
};

export default CancelAppointmentsModal;
