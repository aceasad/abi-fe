import React, { useEffect } from 'react';
import Modal from 'antd/lib/modal/Modal';
import { Field, Formik } from 'formik';
import FormRadio from 'components/custom-components/Form/FormRadio';
import FormSelect from 'components/custom-components/Form/FormSelect';
import Form from 'antd/lib/form/Form';
import FormTextArea from 'components/custom-components/Form/FormTextArea';
import { endAppointmentSchema } from 'utils/validations';
import { useDispatch, useSelector } from 'react-redux';
import {
  endAppointment,
  getAppointmentMissingReasons,
} from 'redux/actions/Appointment';
import {
  makeSelectAppointmentMissingReasons,
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
import { HISTORY, SCHEDULED } from 'redux/reducers/Staff';
import { getAppointments } from 'redux/actions/Staff';

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

const EndAppointment = ({
  handleClose,
  id,
  patientId,
  appointment_type,
  staffId,
  endFrom = null,
}) => {
  const dispatch = useDispatch();

  const { appointmentMissingReasons } = useSelector(
    makeSelectAppointmentMissingReasons()
  );

  const loading = useSelector(makeSelectSingleAppointmentLoading());

  const afterEnd = () => {
    message.success("Appointment ended");
    if (endFrom === FROM_STAFF_APPOINTMENTS) {
      // eslint-disable-next-line default-case
      switch (appointment_type) {
        case HISTORY:
          dispatch(getAppointments({ id: staffId, field: HISTORY }));
          break;
        case SCHEDULED:
          dispatch(getAppointments({ id: staffId, field: SCHEDULED }));
          break;
      }
    } else if (endFrom === FROM_PATIENT_APPOINTMENTS) {
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
    } else if (endFrom === FROM_OVERVIEW_APPOINTMENTS) {
      dispatch(getAppointments({ id: '', field: appointment_type }));
    }

    handleClose();
  };

  const handleSubmit = (values) => {
    dispatch(
      endAppointment({
        id,
        data: prepareData(values),
        missing_reason: appointmentMissingReasons.find(
          (missingReason) => missingReason.id === values.missing_reason
        ),
        afterEnd,
      })
    );
  };

  useEffect(() => {
    if (!appointmentMissingReasons?.length) {
      dispatch(getAppointmentMissingReasons());
    }
  }, [dispatch, appointmentMissingReasons?.length]);

  const options = [
    { id: true, name: "Yes" },
    { id: false, name: "No" },
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
          open
          title={"End appointment"}
          okText={"Confirm"}
          cancelText={"Cancel"}
          onCancel={handleClose}
          okButtonProps={{ disabled: !isValid || loading }}
          onOk={handleSubmit}
        >
          <Form layout="vertical">
            {"Did patient attend the appointment?"}
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
                  options={appointmentMissingReasons}
                  defaultOption={values.missing_reason}
                  optionField="name"
                  label={"Why did the patient miss the appointment?"}
                  errorTexts={{ label: "Reason" }}
                  required
                />
                <Field
                  component={FormTextArea}
                  name="missing_reason_details"
                  rows={4}
                  label={"Missing details"}
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
