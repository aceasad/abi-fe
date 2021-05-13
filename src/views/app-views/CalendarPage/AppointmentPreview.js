import { message } from 'antd';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import DeleteAppointmentModal from './DeleteAppointmentModal';
import PreviewModal from './PreviewModal';
import messages from './messages';
import { deleteAppointemnt } from 'redux/actions/Appointment';
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

  const showEndAppointemnt = (data) =>
    setShowChildModal({ modal: NESTED_MODAL.END_APPOINTMENT, data });

  const afterDelete = () => {
    message.success(formatMessage(messages.appointemntDeleted));
    handleClose();
  };

  const handleDelete = () =>
    dispatch(
      deleteAppointemnt({
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
          showEnd={showEndAppointemnt}
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
        />
      );
    case NESTED_MODAL.EDIT_APPOINTMENT:
      return (
        <AppointmentFormWrapper
          Component={(props) => (
            <UpdateAppointment
              patientId={patientId}
              appointment_type={appointment_type}
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
          showEnd={showEndAppointemnt}
          setNewData={setNewData}
        />
      );
  }
};

export default AppointmentPreview;
