import { Button, Card, Table, Typography } from 'antd';
import React from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { setScheduledOrder, setScheduledPage } from 'redux/actions/Patient';
import { makeSelectScheduledAppointments } from 'redux/selectors/Patient';
import messages from './messages';
import Flex from 'components/shared-components/Flex';
import {
  DEFAULT_SMALL_PAGINATION_LIMIT,
  ORDERING,
} from 'constants/ApiConstant';

const { Title, Text } = Typography;

const prepareField = (order, field) => {
  const base = order === ORDERING.DESC ? '-' : '';
  switch (field) {
    case 'doctor':
      return `${base}doctor__first_name,${base}doctor_last_name`;
    case 'date':
      return `${base}start_datetime`;
    case 'appointment_type':
      return `${base}appointment_type__name`;
    default:
      return `${base}${field}`;
  }
};

const PatientOverviewScheduledCard = ({ patient, showAppointment }) => {
  const predictionOption = 'Likely to be missed';
  const dispatch = useDispatch();

  const { items, loading, count, page } = useSelector(
    makeSelectScheduledAppointments()
  );

  const renderPredictionText = (prediction) => (
    <Text type={prediction === predictionOption ? 'danger' : 'success'}>
      {prediction}
    </Text>
  );

  const handlePaginationChange = (page) => {
    dispatch(setScheduledPage({ page, id: patient.id }));
  };

  const handleChange = (_, __, { order, field }, e) => {
    if (e.action === 'sort')
      dispatch(
        setScheduledOrder({
          id: patient.id,
          order,
          field: prepareField(order, field),
        })
      );
  };

  const { formatMessage } = useIntl();

  const columnsScheduled = [
    {
      title: formatMessage(messages.columnTitleDate),
      dataIndex: 'date',
      sorter: true,
    },
    {
      title: formatMessage(messages.columnTitleTime),
      dataIndex: 'time',
      sorter: false,
    },
    {
      title: formatMessage(messages.columnTitleDoctor),
      dataIndex: 'doctor',
      sorter: true,
    },
    {
      title: formatMessage(messages.columnTitleType),
      dataIndex: 'appointment_type',
      sorter: true,
    },
    {
      title: formatMessage(messages.columnTitlePrediction),
      dataIndex: 'prediction',
      sorter: true,
      render: renderPredictionText,
    },
  ];

  return (
    <Card>
      <Flex justifyContent="between" alignItems="center" className="mb-3">
        <Title level={4} className="mb-0">
          {formatMessage(messages.cardTitleScheduledAppointments)}
        </Title>
        <Button ghost type="primary">
          {formatMessage(messages.buttonNewAppointment)}
        </Button>
      </Flex>
      <Table
        onRow={(record) => ({
          onClick: () => showAppointment(record.id),
        })}
        columns={columnsScheduled}
        dataSource={items}
        onChange={handleChange}
        pagination={{
          defaultPageSize: DEFAULT_SMALL_PAGINATION_LIMIT,
          total: count,
          onChange: handlePaginationChange,
          hideOnSinglePage: true,
          current: page,
        }}
        loading={loading}
      />
    </Card>
  );
};

export default PatientOverviewScheduledCard;
