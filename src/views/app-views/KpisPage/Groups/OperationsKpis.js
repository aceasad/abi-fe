import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Col, Row, Spin, Tooltip } from 'antd';
import { InfoCircleOutlined, RightOutlined } from '@ant-design/icons';
import { APP_PAGES_PREFIX_PATH } from 'configs/AppConfig';
import overviewService from 'services/OverviewService';

const HEADING_COLOR = '#1a3353';
const MUTED_COLOR = '#72849a';
const LINK_COLOR = '#0f766e';
const CARD_BORDER = '1px solid #e8edf2';
const TILE_BORDER = '1px solid #eef0f4';

const TRANSPORT_PATH = `${APP_PAGES_PREFIX_PATH}/transport`;
const COPAY_PATH = `${APP_PAGES_PREFIX_PATH}/overview/billing?tab=copays`;

const TIPS = {
  rides_booked: 'Rides arranged for appointments in this period. Cancelled rides are not included.',
  rides_completed: 'Rides marked completed.',
  no_driver_found: 'Rides the transport provider declined.',
  attended_with_ride: 'Patients who attended, out of the patients who had a ride arranged.',
  requested: 'Copay requests created in this period. Invalid rows are not included.',
  paid_before: 'Paid through the link before the appointment started.',
  paid_at_visit: 'Paid through the link on or after the appointment started. Payments taken at the desk are not included.',
  unpaid: 'Requested copays that have not been paid.',
};

const Delta = ({ change }) => {
  if (change == null || Number.isNaN(Number(change))) return null;
  const value = Number(change);
  const up = value > 0;
  const down = value < 0;
  const color = up ? '#0E9F6E' : down ? '#E5484D' : MUTED_COLOR;
  const background = up ? 'rgba(24, 217, 197, 0.12)' : down ? 'rgba(229, 72, 77, 0.10)' : 'rgba(114, 132, 154, 0.10)';
  const label = `${value > 0 ? '+' : ''}${value}`;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 3,
        fontSize: 12,
        fontWeight: 600,
        lineHeight: 1,
        color,
        background,
        padding: '4px 8px',
        borderRadius: 999,
        whiteSpace: 'nowrap',
      }}
    >
      {up ? '▲' : down ? '▼' : ''} {label}
    </span>
  );
};

const Hint = ({ tip }) => (
  <Tooltip title={tip}>
    <InfoCircleOutlined
      style={{ color: MUTED_COLOR, fontSize: 12, marginLeft: 4, cursor: 'help' }}
      onClick={(event) => event.stopPropagation()}
    />
  </Tooltip>
);

const MetricTile = ({ dot, label, tip, value, change, subtitle, onClick }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        border: TILE_BORDER,
        borderRadius: 12,
        padding: '14px 14px 12px',
        background: hovered && onClick ? '#fbfcfd' : '#fff',
        cursor: onClick ? 'pointer' : 'default',
        minHeight: 108,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', minWidth: 0 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: dot, marginRight: 8, flexShrink: 0 }} />
          <span style={{ fontSize: 13, color: '#5c6b7a' }}>
            {label}
            <Hint tip={tip} />
          </span>
        </span>
        {onClick ? <RightOutlined style={{ fontSize: 11, color: MUTED_COLOR }} /> : null}
      </div>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 28, fontWeight: 700, color: HEADING_COLOR, letterSpacing: '-0.03em', lineHeight: 1 }}>
            {value}
          </span>
          <Delta change={change} />
        </div>
        {subtitle ? (
          <div style={{ marginTop: 6, fontSize: 12, color: MUTED_COLOR }}>{subtitle}</div>
        ) : null}
      </div>
    </div>
  );
};

const Panel = ({ title, openLabel, onOpen, children }) => (
  <div
    style={{
      background: '#fff',
      border: CARD_BORDER,
      borderRadius: 16,
      padding: 16,
      height: '100%',
      boxShadow: '0 1px 2px rgba(26, 51, 83, 0.04)',
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 14, gap: 8 }}>
      <span style={{ fontSize: 16, fontWeight: 600, color: HEADING_COLOR }}>{title}</span>
      <span
        style={{
          background: '#e7f6f3',
          color: LINK_COLOR,
          borderRadius: 999,
          padding: '1px 8px',
          fontSize: 11,
          fontWeight: 600,
        }}
      >
        New
      </span>
      <span style={{ flex: 1 }} />
      <button
        type="button"
        onClick={onOpen}
        style={{
          border: 0,
          background: 'transparent',
          color: LINK_COLOR,
          fontSize: 13,
          fontWeight: 600,
          cursor: 'pointer',
          padding: 0,
        }}
      >
        {openLabel}
      </button>
    </div>
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        gap: 12,
      }}
    >
      {children}
    </div>
  </div>
);

const countText = (value) => Number(value ?? 0).toLocaleString();

const OperationsKpis = ({ startTime, endTime, campaignId }) => {
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    overviewService.getKpiOperations(startTime, endTime, campaignId)
      .then((response) => {
        if (!cancelled) setData(response.data || null);
      })
      .catch(() => {
        if (!cancelled) setData(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [startTime, endTime, campaignId]);

  const transport = data?.transport;
  const copay = data?.copay;
  const showTransport = Boolean(transport?.enabled);
  const showCopay = Boolean(copay?.enabled);
  if (!showTransport && !showCopay) return null;

  return (
    <Spin spinning={loading}>
      <Row gutter={[12, 12]}>
        {showTransport && (
          <Col xs={24} lg={showCopay ? 12 : 24}>
            <Panel title="Transport" openLabel="Open Transport" onOpen={() => history.push(TRANSPORT_PATH)}>
              <MetricTile
                dot="#17382c"
                label="Rides booked"
                tip={TIPS.rides_booked}
                value={countText(transport.rides_booked)}
                change={transport.rides_booked_change}
                onClick={() => history.push(TRANSPORT_PATH)}
              />
              <MetricTile
                dot="#14C2B0"
                label="Rides completed"
                tip={TIPS.rides_completed}
                value={countText(transport.rides_completed)}
                change={transport.rides_completed_change}
                onClick={() => history.push(TRANSPORT_PATH)}
              />
              <MetricTile
                dot="#F59E0B"
                label="No driver found"
                tip={TIPS.no_driver_found}
                value={countText(transport.no_driver_found)}
                change={transport.no_driver_found_change}
                onClick={() => history.push(TRANSPORT_PATH)}
              />
              <MetricTile
                dot="#1a3353"
                label="Attended with a ride"
                tip={TIPS.attended_with_ride}
                value={transport.attended_with_ride_percent == null ? '—' : `${transport.attended_with_ride_percent}%`}
                subtitle="of patients with a ride arranged"
              />
            </Panel>
          </Col>
        )}
        {showCopay && (
          <Col xs={24} lg={showTransport ? 12 : 24}>
            <Panel title="Copay" openLabel="Open Copays" onOpen={() => history.push(COPAY_PATH)}>
              <MetricTile
                dot="#17382c"
                label="Copays requested"
                tip={TIPS.requested}
                value={countText(copay.requested)}
                change={copay.requested_change}
                onClick={() => history.push(COPAY_PATH)}
              />
              <MetricTile
                dot="#14C2B0"
                label="Paid before the visit"
                tip={TIPS.paid_before}
                value={countText(copay.paid_before)}
                change={copay.paid_before_change}
                subtitle={copay.paid_before_percent == null ? null : `${copay.paid_before_percent}% of requested`}
                onClick={() => history.push(COPAY_PATH)}
              />
              <MetricTile
                dot="#94A3B8"
                label="Paid at the visit"
                tip={TIPS.paid_at_visit}
                value={countText(copay.paid_at_visit)}
                change={copay.paid_at_visit_change}
                onClick={() => history.push(COPAY_PATH)}
              />
              <MetricTile
                dot="#F59E0B"
                label="Unpaid"
                tip={TIPS.unpaid}
                value={countText(copay.unpaid)}
                change={copay.unpaid_change}
                onClick={() => history.push(COPAY_PATH)}
              />
            </Panel>
          </Col>
        )}
      </Row>
    </Spin>
  );
};

export default OperationsKpis;
