import Modal from 'antd/lib/modal/Modal';
import React from 'react';
import { useIntl } from 'react-intl';
import messages from './messages';
import { CloseOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import Loading from 'components/shared-components/Loading';
import { useSelector } from 'react-redux';
import { makeSelectSingleAppointment } from 'redux/selectors/Appointment';
import { Button } from 'antd';
import { NESTED_MODAL } from 'views/app-views/CalendarPage/AppointmentPreview';

function PreviewModal({ handleClose, showDelete, showEnd, setNewData }) {
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
              showEnd(appointment);
            }}
          >
            {formatMessage(messages.endAppointment)}
          </Button>,
        ]
      : null;

  return (
    <Modal
      visible
      title={formatMessage(messages.appointmentDetails)}
      closeIcon={
        <div>
          {!isLoading && appointment.attended === null && (
            <>
              <EditOutlined
                onClick={() =>
                  setNewData({
                    data: null,
                    modal: NESTED_MODAL.EDIT_APPOINTMENT,
                  })
                }
              />
              <DeleteOutlined onClick={() => showDelete(appointment)} />
            </>
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
            {formatMessage(messages.patient)}: {appointment.patient.full_name}
          </div>
          <div>
            {formatMessage(messages.doctor)}{' '}
            {`${appointment.doctor.full_name}(${appointment.specialization})`}
          </div>
          <div>
            {formatMessage(messages.type)}: {appointment.appointment_type.name}
          </div>
          <div>
            {formatMessage(messages.status)}: {appointment.status.name}
          </div>
          <div>
            {formatMessage(messages.patient)}: {appointment.patient.full_name}
          </div>
          <div>
            {formatMessage(messages.date)}: {appointment.date}
          </div>
          <div>
            {formatMessage(messages.time)}: {appointment.time}
          </div>
          <div>
            {formatMessage(messages.appointmentPrice)}: £{appointment.price}
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
  );
}

export default PreviewModal;
