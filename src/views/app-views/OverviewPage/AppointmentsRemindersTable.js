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
}) => (
  <Card>
    <Typography.Title level={4}>{title}</Typography.Title>
    <div className="table-responsive ant-table-row-pointer">
      <Table
        columns={columns}
        dataSource={items}
        onRow={onRow}
        onChange={handleChange}
        pagination={{
          defaultPageSize: pageSize,
          total: count,
          onChange: handlePaginationChange,
          hideOnSinglePage: true,
          current: page,
        }}
        loading={loading}
      />
    </div>
  </Card>
);

AppointmentsRemindersTable.defaultProps = {
  onRow: () => ({}),
  handleChange: () => {},
};

const AppointmentsReminders = ({ id, field, children, columnMap }) => {
  if (!children) throw new Error('Component must have children');

  const { items, loading, page, count } = useSelector(
    makeSelectAppointmentsRemindersRequestData(field)
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAppointmentsReminders({ id, field }));
  }, [dispatch, id, field]);

  const handlePaginationChange = (page) => {
    dispatch(setAppointmentsRemindersPage({ page, field, id }));
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
      });
    }
    return child;
  });
  return <div>{elements}</div>;
};

AppointmentsReminders.Table = AppointmentsRemindersTable;

export default AppointmentsReminders;
