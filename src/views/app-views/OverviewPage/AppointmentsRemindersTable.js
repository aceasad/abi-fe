import { Card, Table, Typography, Grid, Space, Button, Tag, Row, Col } from 'antd';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAppointmentsReminders,
  setAppointmentsRemindersPage,
  setAppointmentsRemindersOrder,
} from 'redux/actions/Staff';
import { makeSelectAppointmentsRemindersRequestData } from 'redux/selectors/Staff';
import { DEFAULT_PAGINATION_LIMIT, SET_DEFAULT_PAGINATION_LIMIT } from 'constants/ApiConstant';
import { CalendarOutlined, ClockCircleOutlined, BellOutlined } from '@ant-design/icons';
import utils from 'utils';

const { useBreakpoint } = Grid;

const AppointmentsRemindersTable = ({
  columns,
  items,
  onRow,
  handleChange,
  pageSize,
  count,
  handlePaginationChange,
  page,
  loading,
  title,
  reminderType,
}) => {
  const screens = utils.getBreakPoint(useBreakpoint());
  const isMobile = !screens.includes('lg');

  const handlePaginationSizeChange = (current, size) => {
    SET_DEFAULT_PAGINATION_LIMIT(size);
    handlePaginationChange(1);
  };

  const tableItems = items || [];

  const totalCount = count || 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  // Mobile Card Component
  const ReminderCard = ({ item }) => {
    const patientColumn = columns.find(col => col.dataIndex?.[0] === 'patient');
    const doctorColumn = columns.find(col => col.dataIndex?.[0] === 'doctor');
    const appointmentDateColumn = columns.find(col => col.dataIndex?.[0] === 'appointment' && col.dataIndex?.[1] === 'date');
    const reminderTemplateColumn = columns.find(col => col.dataIndex?.[0] === 'reminder' && col.dataIndex?.[1] === 'message_template');
    const reminderDateColumn = columns.find(col => col.dataIndex?.[0] === 'reminder' && col.dataIndex?.[1] === 'date');
    const reminderStatusColumn = columns.find(col => col.dataIndex?.[0] === 'reminder' && col.dataIndex?.[1] === 'status');
    const actionsColumn = columns.find(col => col.key === 'action');

    return (
      <Card
        hoverable
        onClick={() => onRow && onRow(item).onClick && onRow(item).onClick()}
        styles={{ body: { padding: '16px' } }}
        style={{ height: '100%', borderRadius: '8px' }}
      >
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          {patientColumn && (
            <Typography.Text strong style={{ fontSize: '16px', display: 'block' }}>
              {item.patient?.full_name}
            </Typography.Text>
          )}

          {doctorColumn && reminderType === 'appointment' && (
            <Typography.Text type="secondary" style={{ fontSize: '13px', display: 'block' }}>
              Dr. {item.doctor?.full_name}
            </Typography.Text>
          )}

          {reminderTemplateColumn && (
            <Space size="small">
              <BellOutlined style={{ fontSize: '12px', color: '#8c8c8c' }} />
              <Typography.Text type="secondary" style={{ fontSize: '13px' }}>
                {item.reminder?.message_template}
              </Typography.Text>
            </Space>
          )}

          {appointmentDateColumn && reminderType === 'appointment' && item.appointment?.date && (
            <Space size="small">
              <CalendarOutlined style={{ fontSize: '12px', color: '#8c8c8c' }} />
              <Typography.Text type="secondary" style={{ fontSize: '12px' }}>
                Appt: {appointmentDateColumn.render ? appointmentDateColumn.render(null, item) : `${item.appointment.date} ${item.appointment.time}`}
              </Typography.Text>
            </Space>
          )}

          {reminderDateColumn && item.reminder?.date && (
            <Space size="small">
              <ClockCircleOutlined style={{ fontSize: '12px', color: '#8c8c8c' }} />
              <Typography.Text type="secondary" style={{ fontSize: '12px' }}>
                Reminder: {reminderDateColumn.render ? reminderDateColumn.render(null, item) : `${item.reminder.date} ${item.reminder.time}`}
              </Typography.Text>
            </Space>
          )}

          <Space style={{ width: '100%', justifyContent: 'space-between', marginTop: '8px' }}>
            {reminderStatusColumn && (
              <Tag color={item.reminder?.status?.includes('Scheduled') ? 'blue' : 'default'}>
                {item.reminder?.status}
              </Tag>
            )}
            {actionsColumn && (
              <div onClick={(e) => e.stopPropagation()}>
                {actionsColumn.render(null, item)}
              </div>
            )}
          </Space>
        </Space>
      </Card>
    );
  };

  return (
    <Card>
      {title && <Typography.Title level={4}>{title}</Typography.Title>}
      {isMobile ? (
        // Mobile Card View
        <>
          {loading ? (
            <Card loading={loading} />
          ) : (
            <>
              <Row gutter={[12, 12]}>
                {tableItems.map((item) => (
                  <Col xs={24} sm={12} key={item.id || item.key}>
                    <ReminderCard item={item} />
                  </Col>
                ))}
              </Row>
              {totalCount > pageSize && (
                <div style={{ marginTop: '16px', textAlign: 'center' }}>
                  <Space>
                    <Button
                      disabled={page === 1}
                      onClick={() => handlePaginationChange(page - 1)}
                      size="small"
                    >
                      Previous
                    </Button>
                    <Typography.Text>
                      Page {page} of {totalPages}
                    </Typography.Text>
                    <Button
                      disabled={page >= totalPages}
                      onClick={() => handlePaginationChange(page + 1)}
                      size="small"
                    >
                      Next
                    </Button>
                  </Space>
                </div>
              )}
            </>
          )}
        </>
      ) : (
        // Desktop Table View
        <div className="table-responsive ant-table-row-pointer">
          <Table
            columns={columns}
            dataSource={tableItems.map((item) => ({
              ...item,
              key: item.id || item.key
            }))}
            onRow={onRow}
            onChange={handleChange}
            pagination={{
              defaultPageSize: pageSize,
              pageSize,
              total: totalCount,
              onChange: handlePaginationChange,
              onShowSizeChange: (current, size) => handlePaginationSizeChange(current, size),
              hideOnSinglePage: true,
              current: page,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50', '100'],
            }}
            loading={loading}
          />
        </div>
      )}
    </Card>
  );
};

AppointmentsRemindersTable.defaultProps = {
  onRow: () => ({}),
  handleChange: () => { },
};

const AppointmentsReminders = ({ id, field, children, columnMap, reminderType }) => {
  if (!children) throw new Error('Component must have children');

  const { items, loading, page, count } = useSelector(
    makeSelectAppointmentsRemindersRequestData(field)
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAppointmentsReminders({ id, field, reminderType }));
  }, [dispatch, id, field, reminderType]);

  const handlePaginationChange = (page) => {
    dispatch(setAppointmentsRemindersPage({ page, field, id, reminderType }));
  };

  const handleChange = (_, __, sortField, e) => {
    if (e.action === 'sort')
      dispatch(
        setAppointmentsRemindersOrder({
          ...sortField,
          sort_field: columnMap
            ? columnMap[
            Array.isArray(sortField.field)
              ? sortField.field.join('_')
              : sortField.field
            ]
            : sortField.field,
          field,
          id,
          reminderType,  // Add this parameter
        })
      );
  };

  const elements = React.Children.map(children, (child) => {
    if (
      React.isValidElement(child) &&
      child.type.name === AppointmentsRemindersTable.name
    ) {
      return React.cloneElement(child, {
        items,
        pageSize: DEFAULT_PAGINATION_LIMIT,
        loading,
        page,
        count,
        handlePaginationChange,
        handleChange,
        reminderType,  // Add this prop
      });
    }
    return child;
  });
  return <div>{elements}</div>;
};

AppointmentsReminders.Table = AppointmentsRemindersTable;

export default AppointmentsReminders;
