import React, { useEffect, useState } from 'react';
import { Card, Spin, Empty, Tooltip, Row, Col } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import Chart from 'react-apexcharts';
import overviewService from 'services/OverviewService';
import { apexPieChartDefaultOption } from 'constants/ChartConstant';

const HEADING_COLOR = '#1a3353';
const MUTED_COLOR = '#72849a';
const CARD_RADIUS = 16;
const CARD_BORDER = '1px solid #eef0f4';
const CARD_SHADOW = '0 1px 2px rgba(26, 51, 83, 0.04), 0 8px 24px -16px rgba(26, 51, 83, 0.18)';

const FIRST_ENGAGEMENT_TIP =
  'Among people who replied, which outreach they first answered. Does not include people who never messaged back.';
const BOOKING_ATTRIBUTION_TIP =
  'For each booking, the last successful outreach before the patient replied and booked. After sequence is outreach beyond Reminder 4. Booked by staff is clinic-system bookings.';

// Same solids as the funnel bars, then the two status grays.
const DONUT_COLORS = {
  intro: '#5D4EBF',
  r1: '#6E5FD8',
  r2: '#8C7DEC',
  r3: '#2FA8C7',
  r4: '#14C2B0',
  afterSequence: '#94A3B8',
  staff: '#CBD5E1',
};
const SEQUENCE_COLORS = [
  DONUT_COLORS.intro,
  DONUT_COLORS.r1,
  DONUT_COLORS.r2,
  DONUT_COLORS.r3,
  DONUT_COLORS.r4,
];

const ENGAGEMENT_TEMPLATE_LABELS = {
  1: 'Intro',
  2: 'Reminder 1',
  3: 'Reminder 2',
  4: 'Reminder 3',
  5: 'Reminder 4',
};

const BOOKING_STEP_META = [
  { step: 'INTRO', label: 'Intro', color: DONUT_COLORS.intro },
  { step: 'R1', label: 'Reminder 1', color: DONUT_COLORS.r1 },
  { step: 'R2', label: 'Reminder 2', color: DONUT_COLORS.r2 },
  { step: 'R3', label: 'Reminder 3', color: DONUT_COLORS.r3 },
  { step: 'R4', label: 'Reminder 4', color: DONUT_COLORS.r4 },
  { step: 'POST_SEQUENCE', label: 'After sequence', color: DONUT_COLORS.afterSequence },
  { step: 'NONE', label: 'Booked by staff', color: DONUT_COLORS.staff },
];

const buildEngagementSlices = (rows, total) => {
  const byMessages = new Map();
  (rows || []).forEach((row) => {
    const n = Number(row.messages);
    const patients = Number(row.patients) || 0;
    if (!Number.isFinite(n) || patients <= 0) return;
    const key = (n >= 1 && n <= 5) ? n : 6;
    byMessages.set(key, (byMessages.get(key) || 0) + patients);
  });

  const keys = [1, 2, 3, 4, 5];
  if ((byMessages.get(6) || 0) > 0) keys.push(6);
  return {
    labels: keys.map((k) => (k >= 6 ? 'Other' : ENGAGEMENT_TEMPLATE_LABELS[k])),
    series: keys.map((k) => byMessages.get(k) || 0),
    colors: keys.map((k) => SEQUENCE_COLORS[k - 1] || DONUT_COLORS.afterSequence),
    total: Number(total ?? 0),
  };
};

const buildBookingSlices = (rows, total) => {
  const byStep = new Map((rows || []).map((row) => [row.step, Number(row.count) || 0]));
  const series = BOOKING_STEP_META.map((item) => byStep.get(item.step) || 0);
  return {
    labels: BOOKING_STEP_META.map((item) => item.label),
    series,
    colors: BOOKING_STEP_META.map((item) => item.color),
    total: Number(total ?? 0),
  };
};

const DonutCard = ({ title, tip, centreLabel, slices, loading, isMobile, chartKey }) => {
  const hasData = slices.series.some((value) => value > 0);
  const centreTotal = Number(slices.total || 0).toLocaleString();
  const options = {
    ...apexPieChartDefaultOption,
    labels: slices.labels,
    colors: slices.colors,
    legend: {
      show: true,
      position: 'bottom',
      fontSize: isMobile ? '11px' : '12px',
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          labels: {
            show: true,
            total: {
              show: true,
              showAlways: true,
              label: centreLabel,
              fontSize: '12px',
              color: HEADING_COLOR,
              formatter: () => centreTotal,
            },
            value: {
              fontSize: '18px',
              fontWeight: 700,
              color: HEADING_COLOR,
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => `${val.toFixed(0)}%`,
    },
    tooltip: {
      y: {
        formatter: (val) => `${val}`,
      },
    },
    states: {
      hover: {
        filter: {
          type: 'none',
        },
      },
      active: {
        filter: {
          type: 'none',
        },
      },
    },
  };

  return (
    <Card
      title={(
        <span style={{ fontSize: isMobile ? 15 : 16, fontWeight: 600, color: HEADING_COLOR, display: 'inline-flex', alignItems: 'center' }}>
          {title}
          <Tooltip title={tip}>
            <InfoCircleOutlined
              style={{ color: MUTED_COLOR, fontSize: 12, marginLeft: 6, cursor: 'help' }}
            />
          </Tooltip>
        </span>
      )}
      style={{ borderRadius: CARD_RADIUS, border: CARD_BORDER, boxShadow: CARD_SHADOW, height: '100%' }}
      styles={{
        header: { borderBottom: 'none', paddingInline: 16, minHeight: 'auto' },
        body: { paddingTop: 8 },
      }}
    >
      <Spin spinning={loading}>
        {hasData ? (
          <Chart
            key={chartKey}
            type="donut"
            options={options}
            series={slices.series}
            height={isMobile ? 280 : 320}
          />
        ) : (
          <Empty
            description="No data for the selected period"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            style={{ margin: isMobile ? '30px 0' : '48px 0' }}
          />
        )}
      </Spin>
    </Card>
  );
};

const MessagesBeforeMilestones = ({ startTime, endTime, campaignId, isMobile = false }) => {
  const [loading, setLoading] = useState(false);
  const [engagementRows, setEngagementRows] = useState([]);
  const [engagementTotal, setEngagementTotal] = useState(0);
  const [bookingByStep, setBookingByStep] = useState([]);
  const [bookingTotal, setBookingTotal] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      setLoading(true);
      try {
        const { data } = await overviewService.getMessagesBeforeMilestones(startTime, endTime, campaignId);
        if (cancelled) return;
        setEngagementRows(data?.messages_before_first_engagement ?? []);
        setEngagementTotal(Number(data?.first_engagement_patients ?? 0));
        setBookingByStep(data?.booking_by_step ?? []);
        setBookingTotal(Number(data?.booking_total ?? 0));
      } catch (err) {
        if (!cancelled) {
          setEngagementRows([]);
          setEngagementTotal(0);
          setBookingByStep([]);
          setBookingTotal(0);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [startTime, endTime, campaignId]);

  const engagementSlices = buildEngagementSlices(engagementRows, engagementTotal);
  const bookingSlices = buildBookingSlices(bookingByStep, bookingTotal);
  const chartScopeKey = `${startTime || ''}-${endTime || ''}-${campaignId || 'all'}`;

  return (
    <Row gutter={[isMobile ? 12 : 16, isMobile ? 12 : 16]}>
      <Col xs={24} lg={12}>
        <DonutCard
          title="Patients first engagement"
          tip={FIRST_ENGAGEMENT_TIP}
          centreLabel="people replied"
          slices={engagementSlices}
          loading={loading}
          isMobile={isMobile}
          chartKey={`engagement-${chartScopeKey}-${engagementSlices.total}`}
        />
      </Col>
      <Col xs={24} lg={12}>
        <DonutCard
          title="Which message led to the booking"
          tip={BOOKING_ATTRIBUTION_TIP}
          centreLabel="bookings"
          slices={bookingSlices}
          loading={loading}
          isMobile={isMobile}
          chartKey={`booking-${chartScopeKey}-${bookingSlices.total}`}
        />
      </Col>
    </Row>
  );
};

export default MessagesBeforeMilestones;
