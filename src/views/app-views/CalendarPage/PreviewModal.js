import Modal from 'antd/lib/modal/Modal';
import React from 'react';
import { useIntl } from 'react-intl';
import messages from './messages';
import appointmentsPageMessages from '../AppointmentsPage/messages';
import { CloseOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import Loading from 'components/shared-components/Loading';
import { useSelector } from 'react-redux';
import { makeSelectSingleAppointment } from 'redux/selectors/Appointment';
import { Button, Space, Typography } from 'antd';
import { NESTED_MODAL } from 'views/app-views/CalendarPage/AppointmentPreview';
import Flex from 'components/shared-components/Flex';
import RowWithMultipleColumns from 'components/util-components/Grid/RowWithMultipleColumns';
import { RenderPredictionText } from 'utils/helpers';

function PreviewModal({
  handleClose,
  showDelete,
  showCancel,
  showEnd,
  setNewData,
}) {
  const { formatMessage } = useIntl();
  const { appointment, singleLoading } = useSelector(
    makeSelectSingleAppointment()
  );
  const isLoading = singleLoading || !appointment;

  const footer = [];
  if (!isLoading && new Date(appointment.datetime_iso) > new Date()) {
    footer.push(
      <Button
        key="submit"
        type="primary"
        onClick={() => {
          showCancel(appointment);
        }}
      >
        {formatMessage(messages.cancelAppointment)}
      </Button>
    );
  }
  if (
    !isLoading &&
    appointment.attended === null &&
    new Date(appointment.datetime_iso) <= new Date()
  ) {
    footer.push(
      <Button
        key="submit"
        type="primary"
        onClick={() => {
          showEnd(appointment);
        }}
      >
        {formatMessage(messages.endAppointment)}
      </Button>
    );
  }

  const detailsListData = [
    {
      label: formatMessage(messages.patient),
      value: (
        <Typography.Text strong>
          {appointment?.patient?.full_name}
        </Typography.Text>
      ),
    },
    {
      label: formatMessage(messages.doctor),
      value: (
        <>
          <Typography.Text strong>
            {appointment?.doctor?.full_name}{' '}
          </Typography.Text>
          <span className="text-primary">({appointment?.specialization})</span>
        </>
      ),
    },
    {
      label: formatMessage(messages.type),
      value: appointment?.appointment_type?.name,
    },
    {
      label: formatMessage(messages.status),
      value: appointment?.status?.name,
    },
    {
      label: formatMessage(messages.date),
      value: appointment?.date,
    },
    {
      label: formatMessage(messages.time),
      value: appointment?.time,
    },
    {
      label: formatMessage(messages.appointmentPrice),
      value: `£${appointment?.price}`,
    },
    {
      label: formatMessage(appointmentsPageMessages.appointmentPrediction),
      value: RenderPredictionText(appointment),
    },
  ];

  const detailsList = detailsListData.map((item, index) => (
    <RowWithMultipleColumns
      key={index}
      className="mb-2"
      gutter={16}
      spanList={[8, 16]}
    >
      {`${item.label}:`}
      {item.value}
    </RowWithMultipleColumns>
  ));

  return (
    <Modal
      visible
      closable={false}
      title={
        <Flex justifyContent="between">
          {formatMessage(messages.appointmentDetails)}
          <Space size="middle">
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
                {/*<DeleteOutlined onClick={() => showDelete(appointment)} />*/}
              </>
            )}
            <CloseOutlined onClick={handleClose} />
          </Space>
        </Flex>
      }
      footer={footer}
    >
      {isLoading ? (
        <Loading />
      ) : (
        <div>
          <div className="mb-4">{detailsList}</div>
          {appointment.missing_reason && (
            <div>
              <Typography.Paragraph strong type="secondary" className="mb-2">
                {formatMessage(messages.missingReason)}
              </Typography.Paragraph>
              <Typography.Paragraph>
                {appointment.missing_reason}
              </Typography.Paragraph>
            </div>
          )}
          {appointment.missing_reason_details && (
            <div>
              <Typography.Paragraph strong type="secondary" className="mb-2">
                {formatMessage(messages.details)}
              </Typography.Paragraph>
              <Typography.Paragraph>
                {appointment.missing_reason_details}
              </Typography.Paragraph>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}

export default PreviewModal;
