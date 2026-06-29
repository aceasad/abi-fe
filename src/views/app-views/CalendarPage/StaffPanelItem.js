import React from 'react';
import { Badge, Col, Row, Space, Typography, Tooltip } from 'antd';
import { removeLeadingZeroFromTime } from 'utils/helpers';

const APPOINTMENT_STATUSES = {
  SCHEDULED: 'scheduled',
  SYSTEM_CANCELLED: 'system cancelled',
};

const getAppointmentStatusName = (appointment) =>
  appointment.status?.name || appointment.status_name || appointment.status || '';

const normalizeAppointmentStatus = (status) =>
  status.toString().trim().toLowerCase().replace(/[_-]+/g, ' ');

const StaffPanelItem = ({ data }) => {
  const appointmentStatus = getAppointmentStatusName(data);
  const normalizedAppointmentStatus =
    normalizeAppointmentStatus(appointmentStatus);
  const isSystemCancelled =
    normalizedAppointmentStatus === APPOINTMENT_STATUSES.SYSTEM_CANCELLED;
  const isScheduled =
    normalizedAppointmentStatus === APPOINTMENT_STATUSES.SCHEDULED;
  const badgeStatus = isSystemCancelled
    ? 'error'
    : isScheduled
      ? 'success'
      : 'default';

  return (
    <Row className="pl-2">
      <Col span={9}>
        {`${removeLeadingZeroFromTime(
          data.start_datetime
        )}-${removeLeadingZeroFromTime(data.end_datetime)}`.toLowerCase()}
      </Col>
      <Col span={15}>
        <Space>
          <Typography.Text strong delete={isSystemCancelled}>
            {data.patient}
          </Typography.Text>
          <Tooltip
            placement="bottomRight"
            title={appointmentStatus || 'Appointment status unavailable'}
          >
            <Badge status={badgeStatus} />
          </Tooltip>
        </Space>
      </Col>
    </Row>
  );
};

export default StaffPanelItem;
