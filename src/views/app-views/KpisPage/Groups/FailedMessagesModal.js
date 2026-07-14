import React, { useEffect, useState } from 'react';
import { Modal, Table, Tag, Typography } from 'antd';
import { Link } from 'react-router-dom';
import overviewService from 'services/OverviewService';
import { formatPatientNameWithId } from 'utils/helpers';
import dayjs from 'utils/dayjs';

const { Text } = Typography;

const DATE_INPUT_FORMATS = [
  'YYYY-MM-DDTHH:mm:ss.SSSZ',
  'YYYY-MM-DDTHH:mm:ss',
  'YYYY-MM-DD HH:mm:ss',
];

// Always shown in US date/time format regardless of the clinic's country,
// per request - a single consistently-formatted value, not a country-based
// date mixed with a separately-formatted time.
const formatUsDateTime = (value) => {
  if (!value) return '';
  let parsed = dayjs(value, DATE_INPUT_FORMATS, true);
  if (!parsed.isValid()) parsed = dayjs(value);
  if (!parsed.isValid()) return value;
  return parsed.local().format('MM/DD/YYYY hh:mm A');
};

const ROLE_COLORS = {
  ASA: 'purple',
  SYSTEM: 'blue',
  STAFF: 'orange',
  PATIENT: 'green',
};

const DEFAULT_PAGE_SIZE = 100;

const FailedMessagesModal = ({ open, onClose, startTime, endTime, campaignId }) => {
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  useEffect(() => {
    if (!open) return;
    setPage(1);
  }, [open, startTime, endTime, campaignId]);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;

    const fetchFailedMessages = async () => {
      setLoading(true);
      try {
        const offset = (page - 1) * pageSize;
        const { data } = await overviewService.getFailedMessages(
          startTime,
          endTime,
          campaignId,
          pageSize,
          offset
        );
        if (cancelled) return;
        setRows(data?.results ?? []);
        setTotal(data?.count ?? 0);
      } catch (err) {
        if (!cancelled) {
          setRows([]);
          setTotal(0);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchFailedMessages();

    return () => {
      cancelled = true;
    };
  }, [open, startTime, endTime, campaignId, page, pageSize]);

  const wrapStyle = { whiteSpace: 'normal', wordBreak: 'break-word' };

  const columns = [
    {
      title: 'Date/Time',
      dataIndex: 'created_at',
      width: 150,
      render: (value) => <span style={wrapStyle}>{formatUsDateTime(value)}</span>,
    },
    {
      title: 'Patient',
      dataIndex: 'patient',
      width: 160,
      render: (patient) => (
        <Link
          to={`/pages/conversation/${patient?.id}`}
          target="_blank"
          rel="noopener noreferrer"
          style={wrapStyle}
        >
          {formatPatientNameWithId(patient?.full_name, patient?.id)}
        </Link>
      ),
    },
    {
      title: 'Sent by',
      dataIndex: 'role',
      width: 90,
      render: (role) => role ? <Tag color={ROLE_COLORS[role] || 'default'}>{role}</Tag> : <Text type="secondary">—</Text>,
    },
    {
      title: 'Message',
      dataIndex: 'text',
      width: 280,
      render: (text) => <span style={wrapStyle}>{text}</span>,
    },
    {
      title: 'Failure reason',
      dataIndex: 'reason',
      width: 280,
      render: (reason) => reason
        ? <span style={wrapStyle}>{reason}</span>
        : <Text type="secondary">—</Text>,
    },
  ];

  return (
    <Modal
      title="Failed messages"
      open={open}
      onCancel={onClose}
      footer={null}
      width={1200}
      destroyOnClose
      styles={{ body: { maxHeight: '75vh', overflowY: 'auto' } }}
    >
      <Table
        rowKey="id"
        columns={columns}
        dataSource={rows}
        loading={loading}
        size="small"
        tableLayout="fixed"
        pagination={{
          current: page,
          pageSize,
          total,
          showSizeChanger: true,
          onChange: (nextPage, nextPageSize) => {
            setPage(nextPage);
            setPageSize(nextPageSize);
          },
        }}
      />
    </Modal>
  );
};

export default FailedMessagesModal;
