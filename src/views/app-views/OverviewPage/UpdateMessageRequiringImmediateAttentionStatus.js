import React, { useEffect } from 'react';
import Modal from 'antd/lib/modal/Modal';
import { Field, Formik } from 'formik';
import FormSelect from 'components/custom-components/Form/FormSelect';
import Form from 'antd/lib/form/Form';
import FormTextArea from 'components/custom-components/Form/FormTextArea';
import { useDispatch, useSelector } from 'react-redux';
import {
  updateAppointmentMessageRequiringImmediateAttentionStatus,
  getMessageRequiringImmediateAttentionStatuses,
} from 'redux/actions/Appointment';
import {
  makeSelectMessageRequiringImmediateAttentionStatuses,
  makeSelectSingleAppointmentLoading,
} from 'redux/selectors/Appointment';
import { message } from 'antd';
import { MESSAGES_REQUIRING_IMMEDIATE_ATTENTION } from 'redux/reducers/Staff';

const prepareData = (values) => {
  const status_details = values.status_details?.length
    ? values.status_details
    : null;
  return {
    ...values,
    status: values.status,
    status_details: status_details,
  };
};

const UpdateMessageRequiringImmediateAttentionStatus = ({
  handleClose,
  id,
  patientId,
  appointment_type,
  staffId,
  updateMessageRequiringImmediateAttentionStatusFrom = null,
  messageRequiringImmediateAttention,
}) => {
  const dispatch = useDispatch();

  const { messageRequiringImmediateAttentionStatuses } = useSelector(
    makeSelectMessageRequiringImmediateAttentionStatuses()
  );

  const loading = useSelector(makeSelectSingleAppointmentLoading());

  useEffect(() => {
    if (messageRequiringImmediateAttentionStatuses.length === 0) {
      dispatch(getMessageRequiringImmediateAttentionStatuses());
    }
  }, []);

  const afterMessageRequiringImmediateAttentionStatusUpdate = () => {
    message.success("Updated Successfully");
    handleClose();
  };

  const handleSubmit = (values) => {
    dispatch(
      updateAppointmentMessageRequiringImmediateAttentionStatus({
        id,
        status: messageRequiringImmediateAttentionStatuses.find(
          (status) => status.id === values.status
        )?.id || 0,
        status_details: values.status_details,
        field: MESSAGES_REQUIRING_IMMEDIATE_ATTENTION,
        afterMessageRequiringImmediateAttentionStatusUpdate,
      })
    );
  };

  const initialState = messageRequiringImmediateAttention
    ? {
      status: messageRequiringImmediateAttention.status?.id,
      status_details: messageRequiringImmediateAttention.status_details,
    }
    : {
      status: '',
      status_details: '',
    };

  return (
    <Formik initialValues={initialState} onSubmit={handleSubmit}>
      {({ values, handleSubmit, isValid }) => (
        <Modal
          open
          title={"Change status"}
          okText={"Update"}
          cancelText={"Cancel"}
          onCancel={handleClose}
          okButtonProps={{ disabled: !isValid || loading }}
          onOk={handleSubmit}
        >
          <Form layout="vertical">
            <div>
              <Field
                component={FormSelect}
                name="status"
                options={messageRequiringImmediateAttentionStatuses}
                defaultOption={values.status}
                optionField="name"
                label={"Please set the status using the dropdown below"}
                errorTexts={{
                  label: "Error",
                }}
                required
              />
              <Field
                component={FormTextArea}
                name="status_details"
                rows={4}
                label={"Status details"}
              />
            </div>
          </Form>
        </Modal>
      )}
    </Formik>
  );
};

export default UpdateMessageRequiringImmediateAttentionStatus;
