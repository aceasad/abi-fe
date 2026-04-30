import Modal from 'antd/lib/modal/Modal';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import messages from './messages';
import appointmentsPageMessages from '../AppointmentsPage/messages';
import { CloseOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import Loading from 'components/shared-components/Loading';
import { useSelector } from 'react-redux';
import { makeSelectSingleAppointment } from 'redux/selectors/Appointment';
import { makeSelectClinic } from 'redux/selectors/Clinic';
import { Button, Space, Typography } from 'antd';
import { NESTED_MODAL } from 'views/app-views/CalendarPage/AppointmentPreview';
import Flex from 'components/shared-components/Flex';
import RowWithMultipleColumns from 'components/util-components/Grid/RowWithMultipleColumns';
import {
  formatDateByCountry,
  formatTimeByCountry,
  RenderPredictionText,
} from 'utils/helpers';

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
  const clinic = useSelector(makeSelectClinic());
  const isLoading = singleLoading || !appointment;
  const { isPasIntegrated, PASProvider } = useSelector((state) => state.auth.user || {});
  const isMedbridge = PASProvider?.toLowerCase() === 'medbridge';
  const getLocationDisplay = () => {
    const location =
      appointment?.location ||
      appointment?.home_location ||
      appointment?.patient?.home_location;

    if (!location) return '';
    if (typeof location === 'string') return location;
    if (typeof location === 'object') {
      if (location.location_name && location.location_id) {
        return `${location.location_name} (${location.location_id})`;
      }
      return location.location_name || location.location_id || '';
    }
    return '';
  };
  const locationDisplay = getLocationDisplay();
  const footer = [];
  const appointmentDate = appointment
    ? new Date(`${appointment.date?.split('/').reverse().join('-')}T${appointment.time?.replace(/\s*(am|pm)$/i, '')}`)
    : null;

  if (!isLoading && appointmentDate > new Date()) {
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
    appointmentDate <= new Date()
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
    ...(!isMedbridge
      ? [
          {
            label: formatMessage(messages.doctor),
            value: (
              <>
                <Typography.Text strong>
                  {appointment?.doctor?.full_name}{' '}
                </Typography.Text>
                {isPasIntegrated ? (<></>) : (<span className="text-primary">({appointment?.specialization})</span>)}
              </>
            ),
          },
        ]
      : []),
    {
      label: formatMessage(messages.status),
      value: appointment?.status?.name,
    },
    {
      label: formatMessage(messages.date),
      value: formatDateByCountry(appointment?.date, clinic?.country, [
        'DD/MM/YYYY',
        'MM/DD/YYYY',
        'YYYY-MM-DD',
      ]),
    },
    {
      label: formatMessage(messages.type),
      value: appointment?.appointment_type?.name,
    },
    {
      label: formatMessage(messages.time),
      value: formatTimeByCountry(appointment?.time, clinic?.country),
    },
    ...(isMedbridge && locationDisplay
      ? [
          {
            label: formatMessage(messages.location),
            value: locationDisplay,
          },
        ]
      : []),
    // {
    //   label: formatMessage(messages.appointmentPrice),
    //   value: `£${appointment?.price}`,
    // },
    // {
    //   label: formatMessage(appointmentsPageMessages.appointmentPrediction),
    //   value: RenderPredictionText(appointment),
    // },
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
      open
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
