import React, { useEffect } from 'react';
import Modal from 'antd/lib/modal/Modal';
import { useIntl } from 'react-intl';
import { Field, Formik } from 'formik';
import messages from './messages';
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
import { FROM_OVERVIEW_APPOINTMENTS } from 'constants/ClinicConstants';
import { MESSAGES_REQUIRING_IMMEDIATE_ATTENTION } from 'redux/reducers/Staff';
import { getAppointments } from 'redux/actions/Staff';
import { getMessagesRequiringImmediateAttention } from 'redux/sagas/Staff';

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
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();

  const { messageRequiringImmediateAttentionStatuses } = useSelector(
    makeSelectMessageRequiringImmediateAttentionStatuses()
  );

  const loading = useSelector(makeSelectSingleAppointmentLoading());

  const afterMessageRequiringImmediateAttentionStatusUpdate = () => {
    message.success(
      formatMessage(
        messages.MessageRequiringImmediateAttentionStatusUpdateSuccess
      )
    );
    setTimeout(handleClose(), 1000);
    if (
      updateMessageRequiringImmediateAttentionStatusFrom ===
      FROM_OVERVIEW_APPOINTMENTS
    ) {
      console.log("from overview appointment")
      var payload = { id: null, field: 'messages_requiring_immediate_attention' }
      dispatch(
        getMessagesRequiringImmediateAttention(payload)
      );
    }
  };

  const handleSubmit = (values) => {
    dispatch(
      updateAppointmentMessageRequiringImmediateAttentionStatus({
        id,
        // data: prepareData(values),
        status: messageRequiringImmediateAttentionStatuses.find(
          (status) => status.id === values.status
        )?.id || 0,
        status_details: values.status_details,
        field: MESSAGES_REQUIRING_IMMEDIATE_ATTENTION,
        // afterMessageRequiringImmediateAttentionStatusUpdate,
      })
    );
    afterMessageRequiringImmediateAttentionStatusUpdate();
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
          visible
          title={formatMessage(
            messages.modalTitleUpdateMessageRequiringImmediateAttentionStatus
          )}
          okText={formatMessage(
            messages.modalOkTextUpdateMessageRequiringImmediateAttentionStatus
          )}
          cancelText={formatMessage(
            messages.modalCancelTextUpdateMessageRequiringImmediateAttentionStatus
          )}
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
                label={formatMessage(
                  messages.messageRequiringImmediateAttentionFormLabelStatus
                )}
                errorTexts={{
                  label: formatMessage(
                    messages.modalErrorUpdateMessageRequiringImmediateAttentionStatus
                  ),
                }}
                required
              />
              <Field
                component={FormTextArea}
                name="status_details"
                rows={4}
                label={formatMessage(
                  messages.messageRequiringImmediateAttentionFormLabelStatusDetails
                )}
              />
            </div>
          </Form>
        </Modal>
      )}
    </Formik>
  );
};

export default UpdateMessageRequiringImmediateAttentionStatus;
