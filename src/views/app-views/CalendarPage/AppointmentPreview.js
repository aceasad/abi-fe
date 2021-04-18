import React, { useState } from 'react';
import { Button } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import { CloseOutlined, EditOutlined } from '@ant-design/icons';
import { useIntl } from 'react-intl';
import messages from './messages';
import { makeSelectSingleAppointment } from 'redux/selectors/Appointment';
import { useSelector } from 'react-redux';
import Loading from 'components/shared-components/Loading';
import AppointmentFormWrapper from '../AppointmentsPage/AppointmentFormWrapper';
import UpdateAppointment from '../AppointmentsPage/UpdateAppointment';

function AppointmentPreview({ handleClose }) {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const { formatMessage } = useIntl();
  const { appointment, singleLoading } = useSelector(
    makeSelectSingleAppointment()
  );
  const isLoading = singleLoading || !appointment;

  const footer =
    !isLoading && appointment.attended === null
      ? [
          <Button
            key="submit"
            type="primary"
            onClick={() => {
              /*TO-DO*/
            }}
          >
            {formatMessage(messages.endAppointment)}
          </Button>,
        ]
      : null;

  const closeEditModal = () => setIsEditModalVisible(false);

  return (
    <>
      <Modal
        visible={!isEditModalVisible}
        title={formatMessage(messages.appointmentDetails)}
        closeIcon={
          <div>
            {!isLoading && appointment.attended === null && (
              <EditOutlined onClick={() => setIsEditModalVisible(true)} />
            )}
            <CloseOutlined onClick={handleClose} />
          </div>
        }
        footer={footer}
      >
        {isLoading ? (
          <Loading />
        ) : (
          <div>
            <div>
              {formatMessage(messages.patient)} {appointment.patient.full_name}
            </div>
            <div>
              {formatMessage(messages.doctor)}{' '}
              {`${appointment.doctor.full_name}(${appointment.specialization})`}
            </div>
            <div>
              {formatMessage(messages.type)} {appointment.appointment_type.name}
            </div>
            <div>
              {formatMessage(messages.status)} {appointment.status.name}
            </div>
            <div>
              {formatMessage(messages.patient)} {appointment.patient.full_name}
            </div>
            <div>
              {formatMessage(messages.date)} {appointment.date}
            </div>
            <div>
              {formatMessage(messages.time)} {appointment.time}
            </div>
            <div>
              {formatMessage(messages.appointmentPrice)} £{appointment.price}
            </div>
            {appointment.missing_reason && (
              <div>
                {formatMessage(messages.missingReason)}{' '}
                {appointment.missing_reason}
              </div>
            )}
            {appointment.missing_reason_details && (
              <div>
                {formatMessage(messages.details)}{' '}
                {appointment.missing_reason_details}
              </div>
            )}
          </div>
        )}
      </Modal>
      {!isLoading && (
        <AppointmentFormWrapper
          Component={UpdateAppointment}
          isEditForm={true}
          closeModal={closeEditModal}
          isModalVisible={isEditModalVisible}
        />
      )}
    </>
  );
}

export default AppointmentPreview;
