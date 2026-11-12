import React, { useState } from 'react';
import { Modal, Radio, Space, Typography } from 'antd';

const { Paragraph } = Typography;

const CancelChoiceModal = ({
  appointmentCount,
  canCancelRide,
  canCancelAppointment,
  onClose,
  onRideOnly,
  onRideAndAppointment,
  confirmLoading,
}) => {
  const [choice, setChoice] = useState(null);
  const several = appointmentCount > 1;

  return (
    <Modal
      open
      title="Cancel"
      okText={choice === 'appointment' ? 'Continue' : 'Cancel ride'}
      cancelText="Close"
      okButtonProps={{ danger: true, disabled: !choice }}
      confirmLoading={confirmLoading}
      onCancel={onClose}
      onOk={() => {
        if (choice === 'appointment') onRideAndAppointment();
        else onRideOnly();
      }}
    >
      <Paragraph>
        {several
          ? `Choose what to cancel for ${appointmentCount} appointments.`
          : 'Choose what to cancel.'}
      </Paragraph>
      <Radio.Group
        value={choice}
        onChange={(event) => setChoice(event.target.value)}
      >
        <Space direction="vertical">
          <Radio value="trip" disabled={!canCancelRide}>
            {several
              ? 'Rides only. The appointments stay booked. A round trip cancels both trips.'
              : 'Ride only. The appointment stays booked. A round trip cancels both trips.'}
          </Radio>
          <Radio value="appointment" disabled={!canCancelAppointment}>
            {several
              ? 'Rides and appointments.'
              : 'Ride and appointment.'}
          </Radio>
        </Space>
      </Radio.Group>
    </Modal>
  );
};

export default CancelChoiceModal;
