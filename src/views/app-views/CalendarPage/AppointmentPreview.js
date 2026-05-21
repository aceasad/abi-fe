import { message } from 'antd';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import PreviewModal from './PreviewModal';
import { deleteAppointment } from 'redux/actions/Appointment';
import AppointmentFormWrapper from '../AppointmentsPage/AppointmentFormWrapper';
import DeleteAppointmentModal from './DeleteAppointmentModal';
import UpdateAppointmentCommunicationStatus from './UpdateAppointmentCommunicationStatus';
import UpdateAppointment from '../AppointmentsPage/UpdateAppointment';
import CancelAppointment from './CancelAppointment';
import EndAppointment from './EndAppointment';
import appointment from 'redux/reducers/Appointment';

export const NESTED_MODAL = {
  NONE: 0,
  DELETE: 1,
  UPDATE_APPOINTMENT_COMMUNICATION_STATUS: 2,
  CANCEL_APPOINTMENT: 3,
  END_APPOINTMENT: 4,
  EDIT_APPOINTMENT: 5,
};

const AppointmentPreview = ({
  handleClose,
  additionalSubmitData = {},
  patientId,
  appointment_type,
  staffId,
  appointment,
}) => {
  const dispatch = useDispatch();

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

  const showUpdateAppointmentCommunicationStatus = (data) =>
    setShowChildModal({
      modal: NESTED_MODAL.UPDATE_APPOINTMENT_COMMUNICATION_STATUS,
      data,
    });

  const showCancelAppointment = (data) =>
    setShowChildModal({ modal: NESTED_MODAL.CANCEL_APPOINTMENT, data });

  const showEndAppointment = (data) =>
    setShowChildModal({ modal: NESTED_MODAL.END_APPOINTMENT, data });

  const afterDelete = () => {
    message.success("Appointment deleted");
    handleClose();
  };

  const handleDelete = () =>
    dispatch(
      deleteAppointment({
        data: showChildModal.data,
        afterDelete,
        ...additionalSubmitData,
      })
    );

  switch (showChildModal.modal) {
    case NESTED_MODAL.NONE:
      return (
        <PreviewModal
          handleClose={handleClose}
          showDelete={showDelete}
          showUpdateCommunicationStatus={
            showUpdateAppointmentCommunicationStatus
          }
          showCancel={showCancelAppointment}
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
    case NESTED_MODAL.UPDATE_APPOINTMENT_COMMUNICATION_STATUS:
      return (
        <UpdateAppointmentCommunicationStatus
          handleClose={showPreview}
          id={showChildModal.data.id}
          patientId={patientId}
          appointment_type={appointment_type}
          updateCommunicationStatusFrom={
            additionalSubmitData?.actionFrom && additionalSubmitData.actionFrom
          }
          staffId={staffId}
          appointment={appointment}
        />
      );
    case NESTED_MODAL.CANCEL_APPOINTMENT:
      return (
        <CancelAppointment
          handleClose={showPreview}
          id={showChildModal.data.id}
          patientId={patientId}
          appointment_type={appointment_type}
          cancelFrom={
            additionalSubmitData?.actionFrom && additionalSubmitData.actionFrom
          }
          staffId={staffId}
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
            additionalSubmitData?.actionFrom && additionalSubmitData.actionFrom
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
                additionalSubmitData?.actionFrom &&
                additionalSubmitData.actionFrom
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
