import { message } from 'antd';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import DeleteAppointmentModal from './DeleteAppointmentModal';
import PreviewModal from './PreviewModal';
import messages from './messages';
import { deleteAppointment } from 'redux/actions/Appointment';
import EndAppointment from './EndAppointment';
import AppointmentFormWrapper from '../AppointmentsPage/AppointmentFormWrapper';
import UpdateAppointment from '../AppointmentsPage/UpdateAppointment';

export const NESTED_MODAL = {
  NONE: 0,
  DELETE: 1,
  END_APPOINTMENT: 2,
  EDIT_APPOINTMENT: 3,
};

const AppointmentPreview = ({
  handleClose,
  aditionalSubmitData = {},
  patientId,
  appointment_type,
  staffId,
}) => {
  const dispatch = useDispatch();
  const { formatMessage } = useIntl();

  const [showChildModal, setShowChildModal] = useState({
    modal: NESTED_MODAL.NONE,
    data: null,
  });

  const setNewData = (data) =>
    setShowChildModal((prev) => ({ ...prev, ...data }));

  const showDelete = (data) =>
    setShowChildModal({ modal: NESTED_MODAL.DELETE, data });

  const showPreview = () =>
    setShowChildModal({ modal: NESTED_MODAL.NONE, data: null });

  const showEndAppointment = (data) =>
    setShowChildModal({ modal: NESTED_MODAL.END_APPOINTMENT, data });

  const afterDelete = () => {
    message.success(formatMessage(messages.appointmentDeleted));
    handleClose();
  };

  const handleDelete = () =>
    dispatch(
      deleteAppointment({
        data: showChildModal.data,
        afterDelete,
        ...aditionalSubmitData,
      })
    );

  switch (showChildModal.modal) {
    case NESTED_MODAL.NONE:
      return (
        <PreviewModal
          handleClose={handleClose}
          showDelete={showDelete}
          showEnd={showEndAppointment}
          setNewData={setNewData}
        />
      );
    case NESTED_MODAL.DELETE:
      return (
        <DeleteAppointmentModal
          handleClose={showPreview}
          handleDelete={handleDelete}
          appointment={showChildModal.data}
        />
      );
    case NESTED_MODAL.END_APPOINTMENT:
      return (
        <EndAppointment
          handleClose={showPreview}
          id={showChildModal.data.id}
          patientId={patientId}
          appointment_type={appointment_type}
          endFrom={
            aditionalSubmitData?.actionFrom && aditionalSubmitData.actionFrom
          }
          staffId={staffId}
        />
      );
    case NESTED_MODAL.EDIT_APPOINTMENT:
      return (
        <AppointmentFormWrapper
          Component={(props) => (
            <UpdateAppointment
              patientId={patientId}
              appointment_type={appointment_type}
              staffId={staffId}
              updateFrom={
                aditionalSubmitData?.actionFrom &&
                aditionalSubmitData.actionFrom
              }
              {...props}
            />
          )}
          isEditForm
          isModalVisible
          closeModal={showPreview}
        />
      );
    default:
      return (
        <PreviewModal
          handleClose={handleClose}
          showDelete={showDelete}
          showEnd={showEndAppointment}
          setNewData={setNewData}
        />
      );
  }
};

export default React.memo(AppointmentPreview);
