import { Card, Table, Typography, Grid, Row, Col, Space, Button, Tag } from 'antd';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getMessagesRequiringImmediateAttention,
  setMessagesRequiringImmediateAttentionPage,
  setMessagesRequiringImmediateAttentionOrder,
} from 'redux/actions/Staff';
import { makeSelectMessagesRequiringImmediateAttentionRequestData } from 'redux/selectors/Staff';
import { DEFAULT_LIMIT } from 'services/StaffService';
import { ClockCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import utils from 'utils';

const { useBreakpoint } = Grid;

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
}) => {
  const screens = utils.getBreakPoint(useBreakpoint());
  const isMobile = !screens.includes('lg');

  // Mobile Card Component
  const MessageCard = ({ item }) => {
    const dateColumn = columns.find(col => col.dataIndex === 'created_datetime');
    const patientColumn = columns.find(col => col.dataIndex?.[0] === 'patient');
    const eventColumn = columns.find(col => col.dataIndex?.[0] === 'message_requiring_immediate_attention_type');
    const statusColumn = columns.find(col => col.dataIndex?.[0] === 'status');
    const actionsColumn = columns.find(col => col.key === 'action');

    // Get rendered content for conditional display
    const patientContent = patientColumn?.render ? patientColumn.render(null, item) : item.patient?.full_name;
    const dateContent = dateColumn?.render ? dateColumn.render(null, item) : item.created_datetime;
    const eventContent = eventColumn?.render ? eventColumn.render(null, item) : item.message_requiring_immediate_attention_type?.name;
    const statusContent = item.status?.name;

    return (
      <Card
        hoverable
        onClick={() => onRow && onRow(item).onClick && onRow(item).onClick()}
        styles={{ body: { padding: '16px' } }}
        style={{ height: '100%', borderRadius: '8px' }}
      >
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          {patientColumn && patientContent && (
            <Typography.Text strong style={{ fontSize: '16px', display: 'block' }}>
              {patientContent}
            </Typography.Text>
          )}

          {dateColumn && dateContent && (
            <Space size="small">
              <ClockCircleOutlined style={{ fontSize: '12px', color: '#8c8c8c' }} />
              <Typography.Text type="secondary" style={{ fontSize: '12px' }}>
                {dateContent}
              </Typography.Text>
            </Space>
          )}

          {eventColumn && eventContent && (
            <Space size="small">
              <ExclamationCircleOutlined style={{ fontSize: '12px', color: '#8c8c8c' }} />
              <Typography.Text type="secondary" style={{ fontSize: '13px' }}>
                {eventContent}
              </Typography.Text>
            </Space>
          )}

          <Space style={{ width: '100%', justifyContent: 'space-between', marginTop: '8px' }}>
            {statusColumn && statusContent && (
              <div onClick={(e) => e.stopPropagation()}>
                {statusColumn.render ? statusColumn.render(null, item) : (
                  <Tag color={item.status?.name === 'Pending' ? 'red' : 'default'}>
                    {item.status?.name}
                  </Tag>
                )}
              </div>
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
                {items.map((item) => (
                  <Col xs={24} sm={12} key={item.id || item.key}>
                    <MessageCard item={item} />
                  </Col>
                ))}
              </Row>
              {count > pageSize && (
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
                      Page {page} of {Math.ceil(count / pageSize)}
                    </Typography.Text>
                    <Button
                      disabled={page >= Math.ceil(count / pageSize)}
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
      )}
    </Card>
  );
};

MessagesRequiringImmediateAttentionTable.defaultProps = {
  onRow: () => ({}),
  handleChange: () => { },
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
