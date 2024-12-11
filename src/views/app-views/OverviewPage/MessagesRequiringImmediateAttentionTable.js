import { Card, Table, Typography } from 'antd';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getMessagesRequiringImmediateAttention,
  setMessagesRequiringImmediateAttentionPage,
  setMessagesRequiringImmediateAttentionOrder,
} from 'redux/actions/Staff';
import { makeSelectMessagesRequiringImmediateAttentionRequestData } from 'redux/selectors/Staff';
import { DEFAULT_LIMIT } from 'services/StaffService';

const MessagesRequiringImmediateAttentionTable = ({
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
    <div className="responsive-table ant-table-row-pointer">
      <Table
        columns={columns}
        dataSource={items.map((item) => ({ ...item, key: item.id || item.key }))}
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

MessagesRequiringImmediateAttentionTable.defaultProps = {
  onRow: () => ({}),
  handleChange: () => {},
};

const MessagesRequiringImmediateAttention = ({
  id,
  field,
  children,
  columnMap,
}) => {
  if (!children) throw new Error('Component must have children');

  const { items, loading, page, count } = useSelector(
    makeSelectMessagesRequiringImmediateAttentionRequestData(field)
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMessagesRequiringImmediateAttention({ id, field }));
  }, [dispatch, id, field]);

  const handlePaginationChange = (page) => {
    dispatch(setMessagesRequiringImmediateAttentionPage({ page, field, id }));
  };

  const handleChange = (_, __, sortField, e) => {
    if (e.action === 'sort')
      dispatch(
        setMessagesRequiringImmediateAttentionOrder({
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
      child.type.name === MessagesRequiringImmediateAttentionTable.name
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

MessagesRequiringImmediateAttention.Table = MessagesRequiringImmediateAttentionTable;

export default MessagesRequiringImmediateAttention;
