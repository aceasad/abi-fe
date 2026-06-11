import { Card, Table, Typography, Grid, Row, Col, Space, Button, Tag, Input } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import MessagesRequiringImmediateAttentionFilters from './MessagesRequiringImmediateAttentionFilters';
import { useDispatch, useSelector } from 'react-redux';
import {
  getMessagesRequiringImmediateAttention,
  setMessagesRequiringImmediateAttentionPage,
  setMessagesRequiringImmediateAttentionOrder,
} from 'redux/actions/Staff';
import { getPatientLocations } from 'redux/actions/Patient';
import { makeSelectMessagesRequiringImmediateAttentionRequestData } from 'redux/selectors/Staff';
import { makeSelectPatientLocations } from 'redux/selectors/Patient';
import { MESSAGES_REQUIRING_IMMEDIATE_ATTENTION_PAGE_SIZE } from 'constants/ApiConstant';
import { ClockCircleOutlined, ExclamationCircleOutlined, EnvironmentOutlined } from '@ant-design/icons';
import utils from 'utils';
import { SearchOutlined } from '@ant-design/icons';

const { useBreakpoint } = Grid;

const FILTER_ATTRIBUTES = {
  EVENT: 'event',
  LOCATION: 'location',
};

const normalizeFilterValue = (value) =>
  (value || '').toLowerCase().replace(/[-\s]+/g, ' ').trim();

const getRecordLocationId = (homeLocation) => {
  if (!homeLocation) return null;
  if (typeof homeLocation === 'object') {
    return homeLocation.location_id != null
      ? String(homeLocation.location_id)
      : null;
  }
  return String(homeLocation);
};

const EVENT_TYPE_FILTER_ALIASES = {
  'patient intake form not completed': ['patient intake form incomplete'],
};

const matchesEventTypeFilter = (eventName, filterValue) => {
  const normalizedEvent = normalizeFilterValue(eventName);
  const normalizedFilter = normalizeFilterValue(filterValue);
  if (normalizedEvent === normalizedFilter) return true;

  const aliases = EVENT_TYPE_FILTER_ALIASES[normalizedFilter] || [];
  return aliases.includes(normalizedEvent);
};

const MessagesRequiringImmediateAttentionTable = ({
  columns,
  items,
  onRow,
  handleChange,
  pageSize,
  count,
  handlePaginationChange,
  handlePageSizeChange,
  page,
  loading,
  title,
}) => {
  const dispatch = useDispatch();
  const screens = utils.getBreakPoint(useBreakpoint());
  const isMobile = !screens.includes('lg');
  const { PASProvider } = useSelector((state) => state.auth.user || {});
  const isMedbridge = PASProvider?.toLowerCase() === 'medbridge';
  const { locations } = useSelector(makeSelectPatientLocations());
  const [patientSearch, setPatientSearch] = useState('');
  const [activeFilters, setActiveFilters] = useState([]);

  useEffect(() => {
    if (isMedbridge) {
      dispatch(getPatientLocations());
    }
  }, [dispatch, isMedbridge]);

  // The location filter is only available for Medbridge providers, so drop any
  // active location filter if the provider changes away from Medbridge.
  useEffect(() => {
    if (!isMedbridge) {
      setActiveFilters((prev) =>
        prev.filter((f) => f.attribute !== FILTER_ATTRIBUTES.LOCATION)
      );
    }
  }, [isMedbridge]);

  const getFilterValue = (attribute) => {
    const entry = activeFilters.find((f) => f.attribute === attribute);
    return entry && entry.values.length > 0 ? entry.values[0] : null;
  };

  const filterEventType = getFilterValue(FILTER_ATTRIBUTES.EVENT);
  const filterLocation = getFilterValue(FILTER_ATTRIBUTES.LOCATION);

  const eventTypeOptions = useMemo(() => {
    const screenedElsewhereLabel = isMedbridge
      ? 'Study taken elsewhere'
      : 'Screened elsewhere';

    const baseOptions = [
      { value: 'Emergency situation', label: 'Emergency situation' },
      { value: 'Human intervention', label: 'Human intervention' },
      { value: screenedElsewhereLabel, label: screenedElsewhereLabel },
      { value: 'Declined', label: 'Declined' },
      { value: 'Opt-out', label: 'Opt-out' },
      { value: 'Snoozed', label: 'Snoozed' },
      {
        value: 'Patient Intake Form - Not completed',
        label: 'Patient Intake Form - Not completed',
      },
    ];

    const seen = new Set(baseOptions.map((option) => normalizeFilterValue(option.value)));
    for (const item of items || []) {
      const eventName = item?.message_requiring_immediate_attention_type?.name;
      const normalizedName = normalizeFilterValue(eventName);
      if (!eventName || seen.has(normalizedName)) continue;
      seen.add(normalizedName);
      baseOptions.push({ value: eventName, label: eventName });
    }

    return baseOptions;
  }, [isMedbridge, items]);

  const locationOptions = useMemo(
    () =>
      (locations || [])
        .filter((location) => location?.location_id)
        .map((location) => {
          const id = String(location.location_id);
          const name = location.location_name || id;
          return {
            value: id,
            label: `${name} (${id})`,
          };
        }),
    [locations]
  );

  const filterAttributes = useMemo(() => {
    const attributes = [
      {
        id: FILTER_ATTRIBUTES.EVENT,
        label: 'Event',
        options: eventTypeOptions,
      },
    ];

    if (isMedbridge) {
      attributes.push({
        id: FILTER_ATTRIBUTES.LOCATION,
        label: 'Location',
        options: locationOptions,
      });
    }

    return attributes;
  }, [eventTypeOptions, isMedbridge, locationOptions]);

  const handlePaginationSizeChange = (_, size) => {
    handlePageSizeChange(1, size);
  };

  const filteredItems = useMemo(() => {
    let result = items || [];

    if (filterEventType) {
      result = result.filter((item) =>
        matchesEventTypeFilter(
          item?.message_requiring_immediate_attention_type?.name,
          filterEventType
        )
      );
    }

    if (filterLocation) {
      result = result.filter(
        (item) =>
          getRecordLocationId(item?.patient?.home_location) === String(filterLocation)
      );
    }

    const normalizedSearch = patientSearch.trim().toLowerCase();
    if (normalizedSearch) {
      result = result.filter((item) =>
        (item?.patient?.full_name || '').toLowerCase().includes(normalizedSearch)
      );
    }

    return result;
  }, [items, patientSearch, filterEventType, filterLocation]);

  const totalCount = count || 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  // Mobile Card Component
  const MessageCard = ({ item }) => {
    const dateColumn = columns.find(col => col.dataIndex === 'created_datetime');
    const patientColumn = columns.find(col => col.dataIndex?.[0] === 'patient');
    const eventColumn = columns.find(col => col.dataIndex?.[0] === 'message_requiring_immediate_attention_type');
    const locationColumn = columns.find(
      (col) => col.dataIndex?.[0] === 'patient' && col.dataIndex?.[1] === 'home_location'
    );
    const statusColumn = columns.find(col => col.dataIndex?.[0] === 'status');
    const actionsColumn = columns.find(col => col.key === 'action');

    // Get rendered content for conditional display
    const patientContent = patientColumn?.render ? patientColumn.render(null, item) : item.patient?.full_name;
    const dateContent = dateColumn?.render ? dateColumn.render(null, item) : item.created_datetime;
    const eventContent = eventColumn?.render ? eventColumn.render(null, item) : item.message_requiring_immediate_attention_type?.name;
    const locationContent = locationColumn?.render
      ? locationColumn.render(null, item)
      : null;
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

          {locationColumn && locationContent && locationContent !== '-' && (
            <Space size="small">
              <EnvironmentOutlined style={{ fontSize: '12px', color: '#8c8c8c' }} />
              <Typography.Text type="secondary" style={{ fontSize: '13px' }}>
                {locationContent}
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
      <Space
        direction={isMobile ? 'vertical' : 'horizontal'}
        align={isMobile ? 'stretch' : 'center'}
        wrap
        style={{ width: '100%', marginBottom: 16 }}
      >
        <Input
          style={{ width: isMobile ? '100%' : 240 }}
          placeholder="Search by patient name"
          prefix={<SearchOutlined />}
          value={patientSearch}
          onChange={(e) => setPatientSearch(e.target.value)}
          allowClear
          size="middle"
        />
        <div style={{ width: isMobile ? '100%' : 'auto', flex: isMobile ? undefined : '1 1 0', minWidth: 0 }}>
          <MessagesRequiringImmediateAttentionFilters
            attributes={filterAttributes}
            value={activeFilters}
            onChange={setActiveFilters}
          />
        </div>
      </Space>
      {title && <Typography.Title level={4}>{title}</Typography.Title>}
      {isMobile ? (
        // Mobile Card View
        <>
          {loading ? (
            <Card loading={loading} />
          ) : (
            <>
              <Row gutter={[12, 12]}>
                {filteredItems.map((item) => (
                  <Col xs={24} sm={12} key={item.id || item.key}>
                    <MessageCard item={item} />
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
        <div className="responsive-table ant-table-row-pointer">
          <Table
            tableLayout="fixed"
            columns={columns}
            dataSource={filteredItems.map((item) => ({ ...item, key: item.id || item.key }))}
            onRow={onRow}
            onChange={handleChange}
            pagination={{
              defaultPageSize: pageSize,
              pageSize,
              total: totalCount,
              onChange: handlePaginationChange,
              onShowSizeChange: handlePaginationSizeChange,
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

  const { items, loading, page, count, pageSize } = useSelector(
    makeSelectMessagesRequiringImmediateAttentionRequestData(field)
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMessagesRequiringImmediateAttention({ id, field }));
  }, [dispatch, id, field]);

  const handlePaginationChange = (page) => {
    dispatch(setMessagesRequiringImmediateAttentionPage({ page, field, id }));
  };

  const handlePageSizeChange = (page, nextPageSize) => {
    dispatch(
      setMessagesRequiringImmediateAttentionPage({
        page,
        pageSize: nextPageSize,
        field,
        id,
      })
    );
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
        pageSize: pageSize || MESSAGES_REQUIRING_IMMEDIATE_ATTENTION_PAGE_SIZE,
        loading,
        page,
        count,
        handlePaginationChange,
        handlePageSizeChange,
        handleChange,
      });
    }
    return child;
  });
  return <div>{elements}</div>;
};

MessagesRequiringImmediateAttention.Table = MessagesRequiringImmediateAttentionTable;

export default MessagesRequiringImmediateAttention;
