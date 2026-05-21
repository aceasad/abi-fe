import React, { useEffect } from 'react';
import Modal from 'antd/lib/modal/Modal';
import { Field, Formik } from 'formik';
import messages from './messages';
import FormSelect from 'components/custom-components/Form/FormSelect';
import Form from 'antd/lib/form/Form';
import FormTextArea from 'components/custom-components/Form/FormTextArea';
import { useDispatch, useSelector } from 'react-redux';
import {
  updateAppointmentCommunicationStatus,
  getAppointmentCommunicationStatuses,
} from 'redux/actions/Appointment';
import {
  makeSelectAppointmentCommunicationStatuses,
  makeSelectSingleAppointmentLoading,
} from 'redux/selectors/Appointment';
import { message } from 'antd';
import {
  APPOINTMENT_HISTORY,
  FROM_OVERVIEW_APPOINTMENTS,
  FROM_PATIENT_APPOINTMENTS,
  FROM_STAFF_APPOINTMENTS,
  SCHEDULED_APPOINTMENT,
} from 'constants/ClinicConstants';
import {
  getAppointmentHistory,
  getScheduledAppointments,
} from 'redux/actions/Patient';
import {
  HISTORY,
  HISTORY_REQUIRING_IMMEDIATE_STATUS_UPDATE,
  LIKELY_TO_BE_MISSED,
  SCHEDULED,
  UPCOMING_REMINDERS_APPOINTMENT,
} from 'redux/reducers/Staff';
import { getAppointments } from 'redux/actions/Staff';

const prepareData = (values) => {
  const communication_status_details = values.communication_status_details
    ?.length
    ? values.communication_status_details
    : null;
  return {
    ...values,
    communication_status: values.communication_status,
    communication_status_details: communication_status_details,
  };
};

const UpdateAppointmentCommunicationStatus = ({
  handleClose,
  id,
  patientId,
  appointment_type,
  staffId,
  updateCommunicationStatusFrom = null,
  appointment,
}) => {
  const dispatch = useDispatch();

  const { appointmentCommunicationStatuses } = useSelector(
    makeSelectAppointmentCommunicationStatuses()
  );

  const loading = useSelector(makeSelectSingleAppointmentLoading());

  const afterCommunicationStatusUpdate = () => {
    message.success(messages.communicationStatusUpdateSuccess);
    if (updateCommunicationStatusFrom === FROM_STAFF_APPOINTMENTS) {
      // eslint-disable-next-line default-case
      switch (appointment_type) {
        case HISTORY:
          dispatch(getAppointments({ id: staffId, field: HISTORY }));
          break;
        case SCHEDULED:
          dispatch(getAppointments({ id: staffId, field: SCHEDULED }));
          break;
        default:
          break;
      }
    } else if (updateCommunicationStatusFrom === FROM_PATIENT_APPOINTMENTS) {
      switch (appointment_type) {
        case APPOINTMENT_HISTORY:
          dispatch(getAppointmentHistory({ id: patientId }));
          break;
        case SCHEDULED_APPOINTMENT:
          dispatch(getScheduledAppointments({ id: patientId }));
          break;
        default:
          break;
      }
    } else if (updateCommunicationStatusFrom === FROM_OVERVIEW_APPOINTMENTS) {
      dispatch(getAppointments({ id: '', field: appointment_type }));
    }

    handleClose();
  };

  const handleSubmit = (values) => {
    dispatch(
      updateAppointmentCommunicationStatus({
        id,
        data: prepareData(values),
        communication_status: appointmentCommunicationStatuses.find(
          (communication_status) =>
            communication_status.id === values.communication_status
        ),
        field: UPCOMING_REMINDERS_APPOINTMENT,
        afterCommunicationStatusUpdate,
      })
    );
  };

  useEffect(() => {
    if (!appointmentCommunicationStatuses?.length) {
      dispatch(getAppointmentCommunicationStatuses());
    }
  }, [dispatch, appointmentCommunicationStatuses?.length]);

  const initialState = appointment
    ? {
      communication_status: appointment.communication_status?.id,
      communication_status_details: appointment.communication_status_details,
    }
    : {
      communication_status: '',
      communication_status_details: '',
    };

  return (
    <Formik initialValues={initialState} onSubmit={handleSubmit}>
      {({ values, handleSubmit, isValid }) => (
        <Modal
          open
          title={messages.updateCommunicationStatus}
          okText={messages.update}
          cancelText={messages.cancel}
          onCancel={handleClose}
          okButtonProps={{ disabled: !isValid || loading }}
          onOk={handleSubmit}
        >
          <Form layout="vertical">
            <div>
              <Field
                component={FormSelect}
                name="communication_status"
                options={appointmentCommunicationStatuses}
                defaultOption={values.communication_status}
                optionField="name"
                label={messages.communicationStatus}
                errorTexts={{ label: messages.status }}
                required
              />
              <Field
                component={FormTextArea}
                name="communication_status_details"
                rows={4}
                label={messages.communicationStatusDetails}
              />
            </div>
          </Form>
        </Modal>
      )}
    </Formik>
  );
};

export default UpdateAppointmentCommunicationStatus;
