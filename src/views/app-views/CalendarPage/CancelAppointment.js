import React, { useEffect } from 'react';
import Modal from 'antd/lib/modal/Modal';
import { Field, Formik } from 'formik';
import messages from './messages';
import FormSelect from 'components/custom-components/Form/FormSelect';
import Form from 'antd/lib/form/Form';
import FormTextArea from 'components/custom-components/Form/FormTextArea';
import { useDispatch, useSelector } from 'react-redux';
import {
  cancelAppointment,
  getAppointmentCancellationReasons,
} from 'redux/actions/Appointment';
import {
  makeSelectAppointmentCancellationReasons,
  makeSelectSingleAppointmentLoading,
} from 'redux/selectors/Appointment';
import { message } from 'antd';
import {
  APPOINTMENT_HISTORY,
  FROM_PATIENT_APPOINTMENTS,
  FROM_STAFF_APPOINTMENTS,
  SCHEDULED_APPOINTMENT,
} from 'constants/ClinicConstants';
import {
  getAppointmentHistory,
  getScheduledAppointments,
} from 'redux/actions/Patient';
import { HISTORY, SCHEDULED } from 'redux/reducers/Staff';
import { getAppointments } from 'redux/actions/Staff';

const prepareData = (values) => {
  const cancellation_reason_details = values.cancellation_reason_details.length
    ? values.cancellation_reason_details
    : null;
  return {
    ...values,
    cancellation_reason: values.cancellation_reason,
    cancellation_reason_details: cancellation_reason_details,
  };
};

const CancelAppointment = ({
  handleClose,
  id,
  patientId,
  appointment_type,
  staffId,
  cancelFrom = null,
}) => {
  const dispatch = useDispatch();

  const { appointmentCancellationReasons } = useSelector(
    makeSelectAppointmentCancellationReasons()
  );

  const loading = useSelector(makeSelectSingleAppointmentLoading());

  const afterCancel = () => {
    message.success(messages.cancelSuccess);
    if (cancelFrom === FROM_STAFF_APPOINTMENTS) {
      // eslint-disable-next-line default-case
      switch (appointment_type) {
        case HISTORY:
          dispatch(getAppointments({ id: staffId, field: HISTORY }));
          break;
        case SCHEDULED:
          dispatch(getAppointments({ id: staffId, field: SCHEDULED }));
          break;
      }
    } else if (cancelFrom === FROM_PATIENT_APPOINTMENTS) {
      switch (appointment_type) {
        case APPOINTMENT_HISTORY:
          dispatch(getAppointmentHistory({ id: patientId }));
          break;
        case SCHEDULED_APPOINTMENT:
          dispatch(getScheduledAppointments({ id: patientId }));
          break;
      }
    }

    handleClose();
  };

  const handleSubmit = (values) => {
    dispatch(
      cancelAppointment({
        id,
        data: prepareData(values),
        cancellation_reason: appointmentCancellationReasons.find(
          (cancellationReason) =>
            cancellationReason.id === values.cancellation_reason
        ),
        afterCancel,
      })
    );
  };

  useEffect(() => {
    if (!appointmentCancellationReasons?.length) {
      dispatch(getAppointmentCancellationReasons());
    }
  }, [dispatch, appointmentCancellationReasons?.length]);

  return (
    <Formik
      initialValues={{
        cancellation_reason: '',
        cancellation_reason_details: '',
      }}
      onSubmit={handleSubmit}
    >
      {({ values, handleSubmit, isValid }) => (
        <Modal
          open
          title={messages.cancelAppointment}
          okText={messages.confirm}
          cancelText={messages.cancel}
          onCancel={handleClose}
          okButtonProps={{ disabled: !isValid || loading }}
          onOk={handleSubmit}
        >
          <Form layout="vertical">
            <div>
              <Field
                component={FormSelect}
                name="cancellation_reason"
                options={appointmentCancellationReasons}
                defaultOption={values.cancellation_reason}
                optionField="name"
                label={messages.cancellationReason}
                errorTexts={{ label: messages.reason }}
                required
              />
              <Field
                component={FormTextArea}
                name="cancellation_reason_details"
                rows={4}
                label={messages.cancellationReasonDetails}
              />
            </div>
          </Form>
        </Modal>
      )}
    </Formik>
  );
};

export default CancelAppointment;
