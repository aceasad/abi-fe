import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { makeSelectClinicStatsData } from 'redux/selectors/Overview';
import { Card, Row, Col, Typography, Spin } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import { APP_PAGES_PREFIX_PATH } from 'configs/AppConfig';
import { formatDateByCountry, getDateFormatByCountry } from 'utils/helpers';
import dayjs from 'utils/dayjs';

const { Text } = Typography;

const HEADING_COLOR = '#1a3353';
const MUTED_COLOR = '#72849a';
const TRACK_COLOR = '#eef0f6';
const CARD_RADIUS = 16;
const CARD_BORDER = '1px solid #eef0f4';
const CARD_SHADOW = '0 1px 2px rgba(26, 51, 83, 0.04), 0 8px 24px -16px rgba(26, 51, 83, 0.18)';

const pieChartColors = ['#5D4EBF', '#E880FF', '#FFBFB0', '#18D9C5', '#121E38', '#8C3B87', '#e8fbf9'];

// Each funnel stage moves the eye from the brand purple (outreach) toward the
// booking teal (success), reinforcing the journey from invite to booking.
// Clicking a stage deep-links to the Overview "Booking progress" tab. Invited
// and Delivered are broad funnel steps with no single matching status, so they
// open the tab unfiltered (progressStatus null), while Engaged and Booked
// pre-select their corresponding progress status.
const FUNNEL_STAGES_META = [
  { key: 'invited', label: 'Invited', gradient: 'linear-gradient(90deg, #6E5FD8, #8C7DEC)', progressStatus: null },
  { key: 'delivered', label: 'Delivered', gradient: 'linear-gradient(90deg, #5D4EBF, #6E5FD8)', progressStatus: null },
  { key: 'engaged', label: 'Engaged', gradient: 'linear-gradient(90deg, #2FA8C7, #45C2D8)', progressStatus: 'BOOKING' },
  { key: 'booked', label: 'Booked', gradient: 'linear-gradient(90deg, #14C2B0, #18D9C5)', progressStatus: 'BOOKED' },
];

const PLACEHOLDER_APPOINTMENT_OUTCOMES = [
  { name: 'Scheduled', value: 35 },
  { name: 'Attended', value: 22 },
  { name: 'Not attended', value: 8 },
  { name: 'Cancelled', value: 5 },
  { name: 'Rescheduled', value: 4 },
  { name: 'Arrived', value: 3 },
];

// The "Booking progress" tab on the Overview page is keyed "5". Clicking a
// booking status bar deep-links there and pre-fills its "Filter by status"
// control, so each KPI outcome label is mapped to the matching progress status
// key used by that filter (see PatientProgressTable's statusMapping).
const BOOKING_PROGRESS_TAB_KEY = '5';

const OUTCOME_TO_PROGRESS_STATUS = {
  'Scheduled': 'BOOKED',
  'Attended': 'ATTENDED',
  'Not attended': 'NOT_ATTENDED',
  'Cancelled': 'CANCELLED',
  'Rescheduled': 'RESCHEDULED',
  'Arrived': 'ARRIVED',
  'Sent in': 'SENT_IN',
  'Quiet sent in': 'QUIET_SENT_IN',
  'Walked out': 'WALKED_OUT',
  'Not updated': 'NOT_UPDATED',
};

const areAllAppointmentOutcomesZero = (values) =>
  values.every((value) => Number(value ?? 0) === 0);

const isMissing = (value) => value === null || value === undefined || value === '' || Number(value) < 0;

const displayValue = (value, isPercentage = false) => {
  if (isMissing(value)) return '—';
  if (isPercentage) return `${Number(value).toFixed(1)}%`;
  return Number(value).toLocaleString();
};

const formatPercentageChangeDisplay = (value) => {
  if (value == null || isNaN(value)) return null;
  const clamped = Math.max(-100, Math.min(100, Number(value)));
  const formattedValue = Math.abs(clamped).toFixed(1);
  return clamped < 0 ? `-${formattedValue}%` : `+${formattedValue}%`;
};
const formatValueChangeDisplay = (value) => {
  if (value == null || isNaN(value)) return null;
  const num = Math.abs(Number(value));
  return `+${num}`;
};
const calculateValueChange = (currentValue, previousValue) => {
  const current = Number(currentValue ?? 0);
  const previous = Number(previousValue ?? 0);
  if (!Number.isFinite(current) || !Number.isFinite(previous)) return null;
  return current - previous;
};

// Invited patients who never received a delivered message count as failed.
const calculateMessagesFailed = (invited, delivered) => {
  if (isMissing(invited) || isMissing(delivered)) return -1;
  return Math.max(Number(invited) - Number(delivered), 0);
};

// Modern pill-shaped delta indicator. Green for positive momentum, red for
// negative, neutral grey when a direction shouldn't be implied.
const DeltaBadge = ({ change, changeType = 'percentage', isMobile = false }) => {
  if (change == null || typeof change !== 'number' || isNaN(change)) return null;

  const isPositive = change > 0;
  const isNegative = change < 0;
  const isUp = changeType !== 'decrease' && isPositive;
  const isDown = changeType !== 'increase' && isNegative;

  const palette = isUp
    ? { color: '#0E9F6E', bg: 'rgba(24, 217, 197, 0.12)' }
    : isDown
      ? { color: '#E5484D', bg: 'rgba(229, 72, 77, 0.10)' }
      : { color: MUTED_COLOR, bg: 'rgba(114, 132, 154, 0.10)' };

  const label = changeType === 'percentage'
    ? formatPercentageChangeDisplay(change)
    : formatValueChangeDisplay(change);

  if (!label) return null;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 2,
        fontSize: isMobile ? 11 : 12,
        fontWeight: 600,
        lineHeight: 1,
        color: palette.color,
        background: palette.bg,
        padding: isMobile ? '3px 7px' : '4px 9px',
        borderRadius: 999,
        whiteSpace: 'nowrap',
      }}
    >
      {isUp ? '▲' : isDown ? '▼' : ''} {label}
    </span>
  );
};

const StatCard = ({ title, value, subtitle, color = HEADING_COLOR, change = null, changeType = 'percentage', style = {}, bare = false, compact = false, isMobile = false, onClick = undefined }) => {
  const [hovered, setHovered] = useState(false);
  const isClickable = typeof onClick === 'function';

  const changeNode = change != null && typeof change !== 'object'
    ? <DeltaBadge change={change} changeType={changeType} isMobile={isMobile} />
    : null;

  const content = (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
      <div style={{ fontSize: isMobile ? '22px' : '26px', fontWeight: 700, color, letterSpacing: '-0.02em' }}>
        {value}
      </div>
      {changeNode}
    </div>
  );

  if (bare) {
    return (
      <div style={{ height: isMobile ? '80px' : '100px', textAlign: 'left', ...style }}>
        <Text type="secondary" style={{ display: 'block', fontSize: isMobile ? '13px' : '14px', lineHeight: '22px', marginBottom: isMobile ? '4px' : '8px' }}>
          {title}
        </Text>
        {content}
        {subtitle ? (
          <Text type="secondary" style={{ display: 'block', fontSize: isMobile ? '10px' : '11px', marginTop: 4 }}>
            {subtitle}
          </Text>
        ) : null}
      </div>
    );
  }

  return (
    <div
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onClick={isClickable ? onClick : undefined}
      onKeyDown={isClickable ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      } : undefined}
      onMouseEnter={isClickable ? () => setHovered(true) : undefined}
      onMouseLeave={isClickable ? () => setHovered(false) : undefined}
      style={{
        background: isClickable && hovered ? 'rgba(93, 78, 191, 0.06)' : '#fff',
        border: isClickable && hovered ? '1px solid rgba(93, 78, 191, 0.25)' : CARD_BORDER,
        borderRadius: 14,
        padding: isMobile ? '14px' : compact ? '10px 16px' : '16px 18px',
        height: compact ? 'auto' : '100%',
        cursor: isClickable ? 'pointer' : 'default',
        transition: 'background 0.2s ease, border-color 0.2s ease',
        outline: 'none',
        ...style,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: isMobile ? 6 : compact ? 6 : 10 }}>
        <Text type="secondary" style={{ fontSize: isMobile ? '13px' : '14px' }}>
          {title}
        </Text>
        {isClickable ? (
          <RightOutlined
            style={{
              fontSize: isMobile ? 11 : 12,
              color: hovered ? '#5D4EBF' : MUTED_COLOR,
              opacity: hovered ? 1 : 0.5,
              transform: hovered ? 'translateX(2px)' : 'none',
              transition: 'color 0.2s ease, opacity 0.2s ease, transform 0.2s ease',
            }}
          />
        ) : null}
      </div>
      {content}
      {subtitle ? (
        <Text type="secondary" style={{ display: 'block', fontSize: isMobile ? '11px' : '12px', marginTop: 8 }}>
          {subtitle}
        </Text>
      ) : null}
    </div>
  );
};

// Supporting rate tile used alongside the funnel. A coloured accent dot keeps
// the metrics visually tied to the brand without competing with the funnel.
const RateTile = ({ label, value, change, changeType = 'percentage', accent = '#5D4EBF', subtitle, isMobile = false }) => (
  <div
    style={{
      background: '#fff',
      border: CARD_BORDER,
      borderRadius: 14,
      padding: isMobile ? '12px 14px' : '14px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: accent, flexShrink: 0 }} />
      <Text type="secondary" style={{ fontSize: isMobile ? 13 : 14 }}>{label}</Text>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
      <span style={{ fontSize: isMobile ? 22 : 26, fontWeight: 700, color: HEADING_COLOR, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
        {value}
      </span>
      <DeltaBadge change={change} changeType={changeType} isMobile={isMobile} />
    </div>
    {subtitle ? (
      <Text type="secondary" style={{ fontSize: isMobile ? 10 : 11 }}>{subtitle}</Text>
    ) : null}
  </div>
);

// Side-by-side vertical gauges. Every stage shares an equal-height track and is
// filled from the bottom in proportion to the largest stage, so the funnel
// drop-off is read by comparing bar heights at a glance — the count sits on top
// and a conversion pill underneath shows how many carried over from the
// previous step.
const ConversionFunnel = ({ stages, isMobile, onStageClick }) => {
  const [hoveredKey, setHoveredKey] = useState(null);
  const numericValues = stages.map((s) => (isMissing(s.value) ? 0 : Number(s.value)));
  const maxValue = Math.max(...numericValues, 1);
  const chartHeight = isMobile ? 150 : 200;
  const barWidth = isMobile ? 34 : 56;
  const isClickable = typeof onStageClick === 'function';

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: isMobile ? 8 : 16 }}>
      {stages.map((stage, index) => {
        const rawValue = isMissing(stage.value) ? null : Number(stage.value);
        const value = rawValue ?? 0;
        const fillPx = rawValue == null ? 0 : Math.max((value / maxValue) * chartHeight, value > 0 ? 6 : 0);

        const prevValue = index === 0 ? null : numericValues[index - 1];
        const stepConversion = index === 0
          ? 100
          : prevValue > 0 ? (value / prevValue) * 100 : null;

        const pillText = index === 0
          ? '100%'
          : stepConversion != null
            ? `${stepConversion.toFixed(0)}%`
            : '—';

        const isHovered = hoveredKey === stage.key;

        return (
          <div
            key={stage.key}
            role={isClickable ? 'button' : undefined}
            tabIndex={isClickable ? 0 : undefined}
            onClick={isClickable ? () => onStageClick(stage) : undefined}
            onKeyDown={isClickable ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onStageClick(stage);
              }
            } : undefined}
            onMouseEnter={isClickable ? () => setHoveredKey(stage.key) : undefined}
            onMouseLeave={isClickable ? () => setHoveredKey(null) : undefined}
            style={{
              flex: 1,
              minWidth: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: isClickable ? 'pointer' : 'default',
              borderRadius: 12,
              padding: isMobile ? '6px 2px' : '8px 4px',
              background: isClickable && isHovered ? 'rgba(93, 78, 191, 0.06)' : 'transparent',
              transition: 'background 0.2s ease',
              outline: 'none',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: 10 }}>
              <div style={{ fontSize: isMobile ? 12 : 14, fontWeight: 600, color: HEADING_COLOR, lineHeight: 1.2 }}>
                {stage.label}
              </div>
              <div style={{ fontSize: isMobile ? 18 : 24, fontWeight: 700, color: HEADING_COLOR, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                {rawValue == null ? '—' : value.toLocaleString()}
              </div>
            </div>

            <div
              style={{
                position: 'relative',
                width: barWidth,
                maxWidth: '70%',
                height: chartHeight,
                borderRadius: 12,
                background: TRACK_COLOR,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: 0,
                  height: fillPx,
                  borderRadius: fillPx >= chartHeight ? 12 : '12px 12px 0 0',
                  background: stage.gradient,
                  transition: 'height 0.7s cubic-bezier(0.22, 1, 0.36, 1)',
                }}
              />
            </div>

            <span
              style={{
                marginTop: 12,
                fontSize: isMobile ? 10 : 12,
                fontWeight: 600,
                color: index === 0 ? MUTED_COLOR : '#5D4EBF',
                background: index === 0 ? 'rgba(114, 132, 154, 0.10)' : 'rgba(93, 78, 191, 0.10)',
                padding: isMobile ? '2px 7px' : '3px 9px',
                borderRadius: 999,
                whiteSpace: 'nowrap',
              }}
            >
              {pillText}
            </span>
          </div>
        );
      })}
    </div>
  );
};

const SectionCard = ({ title, extra, children, style, isMobile, fillHeight = false }) => (
  <Card
    title={<span style={{ fontSize: isMobile ? 15 : 16, fontWeight: 600, color: HEADING_COLOR }}>{title}</span>}
    extra={extra}
    style={{
      borderRadius: CARD_RADIUS,
      border: CARD_BORDER,
      boxShadow: CARD_SHADOW,
      ...(fillHeight ? { display: 'flex', flexDirection: 'column' } : {}),
      ...style,
    }}
    styles={{
      header: {
        borderBottom: 'none',
        paddingTop: isMobile ? 16 : 0,
        paddingInline: 16,
        minHeight: 'auto',
      },
      body: {
        paddingTop: isMobile ? 4 : 8,
        ...(fillHeight ? { flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 } : {}),
      },
    }}
  >
    {children}
  </Card>
);

const ClinicStats = ({ title, previousPeriod, isMobile = false, country }) => {
  const history = useHistory();
  const [hoveredOutcome, setHoveredOutcome] = useState(null);
  const [hoveredConcernKey, setHoveredConcernKey] = useState(null);
  const { PASProvider } = useSelector((state) => state.auth.user || {});
  const isMedbridge = PASProvider?.toLowerCase() === 'medbridge';

  // Deep-link to the Overview "Booking progress" tab. When a progress status is
  // provided it is pre-selected in the tab's "Filter by status" control via
  // router state; passing a falsy status opens the tab unfiltered.
  const goToBookingProgress = (progressStatus) => {
    const state = { activeTabKey: BOOKING_PROGRESS_TAB_KEY };
    if (progressStatus) {
      state.progressFilterStatus = progressStatus;
    }
    history.push({
      pathname: `${APP_PAGES_PREFIX_PATH}/overview`,
      state,
    });
  };

  const handleOutcomeClick = (outcomeName) => {
    const progressStatus = OUTCOME_TO_PROGRESS_STATUS[outcomeName];
    if (!progressStatus) return;
    goToBookingProgress(progressStatus);
  };
  const {
    engagement_rate,
    booking_rate,
    total_patients_added,
    total_patients_invited,
    total_patients_engaged,
    total_patients_read_but_no_response,
    bookings,
    reschedule,
    cancelled,
    attended,
    non_attended,
    booking_time_distribution,
    walked_out,
    quiet_sent_in,
    sent_in,
    arrived,
    not_updated,
    declines,
    opt_out,
    snoozed,
    emergency_situation,
    human_intervention,
    already_screened,
    percentage_changes,
    loading
  } = useSelector(makeSelectClinicStatsData);

  const calculateAfterHoursBookings = () => {
    if (!booking_time_distribution) return -1;
    // const evening = booking_time_distribution.evening ?? 0;
    const night = booking_time_distribution.night ?? 0;
    return night;
  };

  const otherAppointmentOutcomeCounts =
    (reschedule ?? 0)
    + (attended ?? 0)
    + (non_attended ?? 0)
    + (cancelled ?? 0)
    + (arrived ?? 0)
    + (sent_in ?? 0)
    + (quiet_sent_in ?? 0)
    + (walked_out ?? 0)
    + (not_updated ?? 0);

  const scheduledOnlyCount = Math.max((bookings ?? 0) - otherAppointmentOutcomeCounts, 0);

  const appointmentOutcomeValues = [
    scheduledOnlyCount,
    attended,
    non_attended,
    cancelled,
    reschedule,
    arrived,
    sent_in,
    quiet_sent_in,
    walked_out,
    not_updated,
  ];

  const appointmentOutcomes = [
    { name: 'Scheduled', value: scheduledOnlyCount, color: '#6366F1' },
    { name: 'Attended', value: attended ?? -1, color: '#10B981' },
    { name: 'Not attended', value: non_attended ?? -1, color: '#F59E0B' },
    { name: 'Cancelled', value: cancelled ?? -1, color: '#EF4444' },
    { name: 'Rescheduled', value: reschedule ?? -1, color: '#6B7280' },
    { name: 'Arrived', value: arrived ?? -1, color: '#8B5CF6' },
    { name: 'Sent in', value: sent_in ?? -1, color: '#06B6D4' },
    { name: 'Quiet sent in', value: quiet_sent_in ?? -1, color: '#84CC16' },
    { name: 'Walked out', value: walked_out ?? -1, color: '#F97316' },
    { name: 'Not updated', value: not_updated ?? -1, color: '#64748B' }
  ].filter(item => item.value > 0);

  const usePlaceholderAppointmentOutcomes =
    !loading && areAllAppointmentOutcomesZero(appointmentOutcomeValues);

  const appointmentOutcomesForChart = usePlaceholderAppointmentOutcomes
    ? PLACEHOLDER_APPOINTMENT_OUTCOMES
    : appointmentOutcomes;

  const appointmentOutcomesTotal = appointmentOutcomesForChart.reduce(
    (sum, item) => sum + Number(item.value ?? 0),
    0
  );

  const sortedAppointmentOutcomes = [...appointmentOutcomesForChart]
    .sort((a, b) => Number(b.value ?? 0) - Number(a.value ?? 0));

  const interventionData = [
    {
      titleMessage: 'Emergency situation',
      value: emergency_situation ?? -1,
      change: calculateValueChange(emergency_situation, percentage_changes?.pc_emergency_situation),
      progressStatus: 'EMERGENCY_SITUATION',
    },
    {
      titleMessage: 'Human intervention',
      value: human_intervention ?? -1,
      change: calculateValueChange(human_intervention, percentage_changes?.pc_human_intervention),
      progressStatus: 'HUMAN_INTERVENTION',
    },
    {
      titleMessage: isMedbridge ? 'Study taken elsewhere' : 'Screened elsewhere',
      value: already_screened ?? -1,
      change: calculateValueChange(already_screened, percentage_changes?.pc_already_screened),
      progressStatus: 'SCREENED_ELSEWHERE',
    },
    {
      titleMessage: 'Declined',
      value: declines ?? -1,
      change: calculateValueChange(declines, percentage_changes?.pc_declined),
      progressStatus: 'DECLINED',
    },
    {
      titleMessage: 'Opt-out',
      value: opt_out ?? -1,
      change: calculateValueChange(opt_out, percentage_changes?.pc_opt_out),
      progressStatus: 'OPT_OUT',
    },
    {
      titleMessage: 'Snoozed',
      value: snoozed ?? -1,
      change: calculateValueChange(snoozed, percentage_changes?.pc_snoozed),
      progressStatus: 'SNOOZED',
    }
  ];

  const previousAfterHours =
    (percentage_changes?.pc_booking_time_distribution?.evening ?? 0)
    + (percentage_changes?.pc_booking_time_distribution?.night ?? 0);
  const afterHoursChange = calculateValueChange(calculateAfterHoursBookings(), previousAfterHours);
  const messagesFailedCount = calculateMessagesFailed(
    total_patients_added,
    total_patients_invited
  );
  const previousMessagesFailedCount =
    percentage_changes?.pc_total_patients_added != null
      && percentage_changes?.pc_total_patients_invited != null
      ? calculateMessagesFailed(
        percentage_changes.pc_total_patients_added,
        percentage_changes.pc_total_patients_invited
      )
      : percentage_changes?.pc_failed_messages;
  const failedMessagesChange = calculateValueChange(
    messagesFailedCount,
    previousMessagesFailedCount
  );
  const deliveredUnengagedChange = calculateValueChange(
    total_patients_read_but_no_response,
    percentage_changes?.pc_delivered_unengaged
  );

  const funnelStages = FUNNEL_STAGES_META.map((meta) => ({
    ...meta,
    value: {
      invited: total_patients_added,
      delivered: total_patients_invited,
      engaged: total_patients_engaged,
      booked: bookings,
    }[meta.key],
  }));

  const mobileShortFormat = getDateFormatByCountry(country).replace('YYYY', 'YY');

  const previousPeriodLabel = previousPeriod ? (
    <Text type="secondary" style={{ fontSize: isMobile ? 11 : 13 }}>
      vs {isMobile
        ? `${dayjs(previousPeriod[0]).format(mobileShortFormat)} – ${dayjs(previousPeriod[1]).format(mobileShortFormat)}`
        : `${formatDateByCountry(previousPeriod[0], country)} – ${formatDateByCountry(previousPeriod[1], country)}`}
    </Text>
  ) : null;

  // Concern metrics highlighted with a soft red accent so they read as
  // "needs attention" without shouting.
  const concernMetrics = [
    {
      key: 'failed',
      label: 'Messages failed',
      value: displayValue(messagesFailedCount),
      change: failedMessagesChange,
      progressStatus: null,
    },
    {
      key: 'unengaged',
      label: 'Delivered · unengaged',
      value: displayValue(total_patients_read_but_no_response),
      change: deliveredUnengagedChange,
      progressStatus: 'NO_RESPONSE',
    },
  ];

  return (
    <Spin spinning={loading}>
      <SectionCard title="Patient communication flow" extra={previousPeriodLabel} isMobile={isMobile}>
        <Row gutter={[isMobile ? 16 : 28, 16]}>
          <Col xs={24} lg={15}>
            <ConversionFunnel
              stages={funnelStages}
              isMobile={isMobile}
              onStageClick={(stage) => goToBookingProgress(stage.progressStatus)}
            />
          </Col>

          <Col xs={24} lg={9}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, height: '100%' }}>
              <RateTile
                label="Engagement rate"
                value={displayValue(engagement_rate, true)}
                change={percentage_changes?.pc_engagement_rate}
                changeType="percentage"
                accent="#5D4EBF"
                isMobile={isMobile}
              />
              <RateTile
                label="Booking rate"
                value={displayValue(booking_rate, true)}
                change={percentage_changes?.pc_booking_rate}
                changeType="percentage"
                accent="#18D9C5"
                isMobile={isMobile}
              />
              <RateTile
                label="Bookings after hours"
                value={displayValue(calculateAfterHoursBookings())}
                change={afterHoursChange}
                changeType="value"
                accent="#E880FF"
                isMobile={isMobile}
              />
            </div>
          </Col>
        </Row>

        <Row gutter={[12, 12]} style={{ marginTop: isMobile ? 16 : 20 }}>
          {concernMetrics.map((metric) => {
            const isClickable = Boolean(metric.progressStatus);
            const isHovered = hoveredConcernKey === metric.key;

            return (
              <Col xs={24} sm={12} key={metric.key}>
                <div
                  role={isClickable ? 'button' : undefined}
                  tabIndex={isClickable ? 0 : undefined}
                  onClick={isClickable ? () => goToBookingProgress(metric.progressStatus) : undefined}
                  onKeyDown={isClickable ? (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      goToBookingProgress(metric.progressStatus);
                    }
                  } : undefined}
                  onMouseEnter={isClickable ? () => setHoveredConcernKey(metric.key) : undefined}
                  onMouseLeave={isClickable ? () => setHoveredConcernKey(null) : undefined}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 12,
                    padding: isMobile ? '12px 14px' : '14px 16px',
                    borderRadius: 14,
                    background: isClickable && isHovered ? 'rgba(229, 72, 77, 0.1)' : 'rgba(229, 72, 77, 0.05)',
                    border: isClickable && isHovered ? '1px solid rgba(229, 72, 77, 0.25)' : '1px solid rgba(229, 72, 77, 0.12)',
                    cursor: isClickable ? 'pointer' : 'default',
                    transition: 'background 0.2s ease, border-color 0.2s ease',
                    outline: 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#E5484D', flexShrink: 0 }} />
                    <Text style={{ fontSize: isMobile ? 13 : 14, color: HEADING_COLOR }}>{metric.label}</Text>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: isMobile ? 18 : 20, fontWeight: 700, color: HEADING_COLOR }}>{metric.value}</span>
                    <DeltaBadge change={metric.change} changeType="value" isMobile={isMobile} />
                    {isClickable ? (
                      <RightOutlined
                        style={{
                          fontSize: isMobile ? 11 : 12,
                          color: isHovered ? '#E5484D' : MUTED_COLOR,
                          opacity: isHovered ? 1 : 0.5,
                          transform: isHovered ? 'translateX(2px)' : 'none',
                          transition: 'color 0.2s ease, opacity 0.2s ease, transform 0.2s ease',
                        }}
                      />
                    ) : null}
                  </div>
                </div>
              </Col>
            );
          })}
        </Row>
      </SectionCard>

      <Row gutter={[isMobile ? 12 : 16, isMobile ? 12 : 16]} style={{ marginTop: isMobile ? 12 : 16 }} align="stretch">
        <Col xs={24} md={12} style={{ display: 'flex' }}>
          <SectionCard
            title="Booking statuses"
            isMobile={isMobile}
            fillHeight={!isMobile}
            extra={usePlaceholderAppointmentOutcomes ? (
              <Text type="secondary" style={{ fontSize: 12 }}>Sample data</Text>
            ) : null}
            style={isMobile ? { height: 'auto', width: '100%' } : { minHeight: 425, height: '100%', width: '100%' }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: isMobile ? 18 : 22 }}>
                <span style={{ fontSize: isMobile ? 30 : 38, fontWeight: 700, color: HEADING_COLOR, letterSpacing: '-0.02em', lineHeight: 1 }}>
                  {appointmentOutcomesTotal.toLocaleString()}
                </span>
                <span style={{ fontSize: isMobile ? 13 : 14, color: MUTED_COLOR }}>total bookings</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 14 : 16 }}>
                {sortedAppointmentOutcomes.map((item, index) => {
                  const value = Number(item.value ?? 0);
                  const pct = appointmentOutcomesTotal > 0 ? (value / appointmentOutcomesTotal) * 100 : 0;
                  const color = item.color || pieChartColors[index % pieChartColors.length];
                  const isClickable = Boolean(OUTCOME_TO_PROGRESS_STATUS[item.name]);
                  const isHovered = hoveredOutcome === item.name;

                  return (
                    <div
                      key={item.name}
                      role={isClickable ? 'button' : undefined}
                      tabIndex={isClickable ? 0 : undefined}
                      onClick={isClickable ? () => handleOutcomeClick(item.name) : undefined}
                      onKeyDown={isClickable ? (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleOutcomeClick(item.name);
                        }
                      } : undefined}
                      onMouseEnter={isClickable ? () => setHoveredOutcome(item.name) : undefined}
                      onMouseLeave={isClickable ? () => setHoveredOutcome(null) : undefined}
                      style={{
                        cursor: isClickable ? 'pointer' : 'default',
                        margin: '0 -8px',
                        padding: '8px',
                        borderRadius: 10,
                        background: isClickable && isHovered ? 'rgba(93, 78, 191, 0.06)' : 'transparent',
                        transition: 'background 0.2s ease',
                        outline: 'none',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
                        <Text style={{ fontSize: isMobile ? 13 : 14, color: HEADING_COLOR }}>{item.name}</Text>
                        <span style={{ display: 'inline-flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
                          <span style={{ fontSize: isMobile ? 13 : 14, color: HEADING_COLOR }}>
                            <span style={{ fontWeight: 700 }}>{value.toLocaleString()}</span>
                            <span style={{ color: MUTED_COLOR, marginLeft: 8 }}>{pct.toFixed(1)}%</span>
                          </span>
                          {isClickable ? (
                            <RightOutlined
                              style={{
                                fontSize: isMobile ? 11 : 12,
                                marginLeft: 10,
                                color: isHovered ? '#5D4EBF' : MUTED_COLOR,
                                opacity: isHovered ? 1 : 0.5,
                                transform: isHovered ? 'translateX(2px)' : 'none',
                                transition: 'color 0.2s ease, opacity 0.2s ease, transform 0.2s ease',
                              }}
                            />
                          ) : null}
                        </span>
                      </div>
                      <div style={{ height: isMobile ? 8 : 10, borderRadius: 999, background: TRACK_COLOR, overflow: 'hidden' }}>
                        <div
                          style={{
                            height: '100%',
                            width: `${Math.max(pct, value > 0 ? 2 : 0)}%`,
                            borderRadius: 999,
                            background: color,
                            transition: 'width 0.7s cubic-bezier(0.22, 1, 0.36, 1)',
                          }}
                        />
                      </div>
                      */}
                    </div>
                  );
                })}
              </div>
            </div>
          </SectionCard>
        </Col>

        <Col xs={24} md={12} style={{ display: 'flex', alignSelf: 'flex-start' }}>
          <SectionCard
            title="Intervention & special cases"
            isMobile={isMobile}
            style={{ height: 'auto', width: '100%', flex: 'none' }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                gridTemplateRows: 'auto',
                gap: isMobile ? 8 : 12,
              }}
            >
              {interventionData.map((item, index) => (
                <StatCard
                  key={index}
                  title={item.titleMessage}
                  value={displayValue(item.value)}
                  change={item.change}
                  changeType="value"
                  compact={!isMobile}
                  style={{ width: '100%' }}
                  isMobile={isMobile}
                  onClick={item.progressStatus ? () => goToBookingProgress(item.progressStatus) : undefined}
                />
              ))}
            </div>
          </SectionCard>
        </Col>
      </Row>
    </Spin>
  );
};

export default ClinicStats;
