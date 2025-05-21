import { Card, Table, Typography } from 'antd';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAppointmentsReminders,
  setAppointmentsRemindersPage,
  setAppointmentsRemindersOrder,
} from 'redux/actions/Staff';
import { makeSelectAppointmentsRemindersRequestData } from 'redux/selectors/Staff';
import { DEFAULT_LIMIT } from 'services/StaffService';
import { DEFAULT_PAGINATION_LIMIT, SET_DEFAULT_PAGINATION_LIMIT } from 'constants/ApiConstant';

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

  const handlePaginationSizeChange = (current, size) => {
    SET_DEFAULT_PAGINATION_LIMIT(size);
  };
  return (
    <Card>
      <Typography.Title level={4}>{title}</Typography.Title>
      <div className="table-responsive ant-table-row-pointer">
        <Table
          columns={columns}
          dataSource={(items || []).map((item) => ({
            ...item,
            key: item.id || item.key
          }))}
          onRow={onRow}
          onChange={handleChange}
          pagination={{
            defaultPageSize: DEFAULT_PAGINATION_LIMIT,
            total: count, // Use the count from API
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
        pageSize: DEFAULT_LIMIT,
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
