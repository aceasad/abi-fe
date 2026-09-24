import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { makeSelectClinicStatsData } from 'redux/selectors/Overview';
import { Card, Row, Col, Typography, Spin, Tooltip } from 'antd';
import { RightOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { APP_PAGES_PREFIX_PATH } from 'configs/AppConfig';
import { formatDateByCountry, getDateFormatByCountry } from 'utils/helpers';
import dayjs from 'utils/dayjs';
import FailedMessagesModal from './FailedMessagesModal';

const { Text } = Typography;

const HEADING_COLOR = '#1a3353';
const MUTED_COLOR = '#72849a';
const TRACK_COLOR = '#eef0f6';
const CARD_RADIUS = 16;
const CARD_BORDER = '1px solid #eef0f4';
const CARD_SHADOW = '0 1px 2px rgba(26, 51, 83, 0.04), 0 8px 24px -16px rgba(26, 51, 83, 0.18)';
const ASA_COLOR = '#14C2B0';
const ASSISTED_COLOR = '#7DD3C8';
const HUMAN_COLOR = '#94A3B8';

const pieChartColors = ['#5D4EBF', '#E880FF', '#FFBFB0', '#18D9C5', '#121E38', '#8C3B87', '#e8fbf9'];

const KPI_TOOLTIPS = {
  invited: 'Patients added in the selected period.',
  delivered: 'Patients who successfully received their first outbound message (SENT, DELIVERED, or READ). Not based on invite template text.',
  engaged: 'Patients who received a message and replied at least once.',
  engagement_rate: 'Share of delivered patients who replied at least once (engaged ÷ delivered).',
  booking_rate: '(ASA booked + ASA assisted) ÷ (engaged patients − sole phone-only bookings).',
  bookings_after_hours: 'Bookings created during night hours (clinic local time).',
  delivered_unengaged: 'Patients who received a successful first message but have not replied.',
  waiting_added: 'Patients still on conversation status Added (or unset) — in the system but waiting for outreach.',
  messages_failed: 'Outbound messages that failed to send (including flood errors).',
  bookings: 'Appointment rows counted for KPI reporting (MSLT pairs count as one). This is not the billed appointment count.',
  booked_handling: 'Patient-level mix in the selected filters: ASA booked (only ASA), ASA assisted (ASA + phone), Human booked (phone only). Hover bar segments for counts.',
  emergency_situation: 'Patients flagged for an emergency situation requiring immediate attention.',
  human_intervention: 'Patients where staff intervention was required to continue the conversation.',
  already_screened: 'Patients who reported already being screened or having the study taken elsewhere.',
  declined: 'Patients who declined the invitation.',
  opt_out: 'Patients who opted out of further messages.',
  snoozed: 'Patients who asked to be contacted later (snoozed).',
  booked_funnel: 'Distinct patients with at least one booking in the period. Hover the Booked bar for ASA booked / ASA assisted / Human booked.',
};

const MetricHint = ({ tip }) => {
  if (!tip) return null;
  return (
    <Tooltip title={tip}>
      <InfoCircleOutlined
        style={{ color: MUTED_COLOR, fontSize: 12, marginLeft: 4, cursor: 'help' }}
        onClick={(e) => e.stopPropagation()}
      />
    </Tooltip>
  );
};

// Each funnel stage moves the eye from the brand purple (outreach) toward the
// booking teal (success). Invited = patients added; Waiting = still on Added;
// Delivered = first successful outbound; Engaged = replied once; Booked =
// patients with ≥1 booking. Waiting sits beside Invited and is excluded from
// the conversion chain so Delivered still compares against Invited.
const FUNNEL_STAGES_META = [
  { key: 'invited', label: 'Invited', gradient: 'linear-gradient(90deg, #6E5FD8, #8C7DEC)', progressStatus: null },
  { key: 'waiting', label: 'Waiting', gradient: 'linear-gradient(90deg, #94A3B8, #B0BBC8)', progressStatus: 'ADDED', excludeFromConversionChain: true },
  { key: 'delivered', label: 'Delivered', gradient: 'linear-gradient(90deg, #5D4EBF, #6E5FD8)', progressStatus: null },
  { key: 'engaged', label: 'Engaged', gradient: 'linear-gradient(90deg, #2FA8C7, #45C2D8)', progressStatus: 'BOOKING' },
  { key: 'booked', label: 'Booked', gradient: 'linear-gradient(90deg, #14C2B0, #18D9C5)', progressStatus: 'BOOKED' },
];

const PLACEHOLDER_APPOINTMENT_OUTCOMES = [
  { name: 'Scheduled', value: 35 },
  { name: 'Attended', value: 25 },
  { name: 'Not attended', value: 8 },
  { name: 'Cancelled', value: 5 },
  { name: 'Rescheduled', value: 4 },
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

const StatCard = ({ title, value, subtitle, color = HEADING_COLOR, change = null, changeType = 'percentage', style = {}, bare = false, compact = false, isMobile = false, onClick = undefined, tip = undefined }) => {
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
          <MetricHint tip={tip} />
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
          <MetricHint tip={tip} />
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
const RateTile = ({ label, value, change, changeType = 'percentage', accent = '#5D4EBF', subtitle, tip, isMobile = false }) => (
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
      <MetricHint tip={tip} />
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
  const barWidth = isMobile ? 28 : 48;
  const isClickable = typeof onStageClick === 'function';
  const invitedIndex = stages.findIndex((s) => s.key === 'invited');
  const invitedValue = invitedIndex >= 0 ? numericValues[invitedIndex] : 0;

  // Conversion chain skips side metrics (e.g. Waiting) so drop-off still reads
  // Invited → Delivered → Engaged → Booked.
  const chainPrevValue = (index) => {
    for (let i = index - 1; i >= 0; i -= 1) {
      if (!stages[i].excludeFromConversionChain) {
        return numericValues[i];
      }
    }
    return null;
  };

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: isMobile ? 6 : 12 }}>
      {stages.map((stage, index) => {
        const rawValue = isMissing(stage.value) ? null : Number(stage.value);
        const value = rawValue ?? 0;
        const fillPx = rawValue == null ? 0 : Math.max((value / maxValue) * chartHeight, value > 0 ? 6 : 0);

        let pillText = '—';
        if (index === 0 || stage.key === 'invited') {
          pillText = '100%';
        } else if (stage.excludeFromConversionChain) {
          // Share of Invited still waiting
          pillText = invitedValue > 0
            ? `${((value / invitedValue) * 100).toFixed(0)}%`
            : '—';
        } else {
          const prevValue = chainPrevValue(index);
          const stepConversion = prevValue > 0 ? (value / prevValue) * 100 : null;
          pillText = stepConversion != null ? `${stepConversion.toFixed(0)}%` : '—';
        }

        const isHovered = hoveredKey === stage.key;
        const asa = Number(stage.asa ?? 0);
        const assisted = Number(stage.assisted ?? 0);
        const human = Number(stage.human ?? 0);
        const sourceTotal = asa + assisted + human;
        const showSourceSplit = stage.key === 'booked' && sourceTotal > 0 && fillPx > 0;
        const asaShare = showSourceSplit ? asa / sourceTotal : 0;
        const assistedShare = showSourceSplit ? assisted / sourceTotal : 0;
        const humanShare = showSourceSplit ? human / sourceTotal : 0;
        const isSideMetric = Boolean(stage.excludeFromConversionChain);

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
              <div style={{ fontSize: isMobile ? 12 : 14, fontWeight: 600, color: HEADING_COLOR, lineHeight: 1.2, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                {stage.label}
                <MetricHint tip={stage.tip} />
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
              {showSourceSplit ? (
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    height: fillPx,
                    display: 'flex',
                    flexDirection: 'column-reverse',
                    borderRadius: fillPx >= chartHeight ? 12 : '12px 12px 0 0',
                    overflow: 'hidden',
                    transition: 'height 0.7s cubic-bezier(0.22, 1, 0.36, 1)',
                  }}
                >
                  {asa > 0 ? (
                    <div
                      style={{
                        height: `${asaShare * 100}%`,
                        minHeight: 4,
                        width: '100%',
                        background: ASA_COLOR,
                      }}
                    >
                      <Tooltip title={`ASA booked ${asa.toLocaleString()}`} placement="right">
                        <div
                          style={{ height: '100%', width: '100%' }}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </Tooltip>
                    </div>
                  ) : null}
                  {assisted > 0 ? (
                    <div
                      style={{
                        height: `${assistedShare * 100}%`,
                        minHeight: 4,
                        width: '100%',
                        background: ASSISTED_COLOR,
                      }}
                    >
                      <Tooltip title={`ASA assisted ${assisted.toLocaleString()}`} placement="right">
                        <div
                          style={{ height: '100%', width: '100%' }}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </Tooltip>
                    </div>
                  ) : null}
                  {human > 0 ? (
                    <div
                      style={{
                        height: `${humanShare * 100}%`,
                        minHeight: 4,
                        width: '100%',
                        background: HUMAN_COLOR,
                      }}
                    >
                      <Tooltip title={`Human booked ${human.toLocaleString()}`} placement="right">
                        <div
                          style={{ height: '100%', width: '100%' }}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </Tooltip>
                    </div>
                  ) : null}
                </div>
              ) : (
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
              )}
            </div>

            <span
              style={{
                marginTop: 12,
                fontSize: isMobile ? 10 : 12,
                fontWeight: 600,
                color: index === 0 || isSideMetric ? MUTED_COLOR : '#5D4EBF',
                background: index === 0 || isSideMetric ? 'rgba(114, 132, 154, 0.10)' : 'rgba(93, 78, 191, 0.10)',
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

const ClinicStats = ({ title, previousPeriod, isMobile = false, country, startTime, endTime, campaignId }) => {
  const history = useHistory();
  const [hoveredOutcome, setHoveredOutcome] = useState(null);
  const [hoveredConcernKey, setHoveredConcernKey] = useState(null);
  const [failedMessagesModalOpen, setFailedMessagesModalOpen] = useState(false);
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
    total_patients_failed_message_status,
    total_failed_messages_count,
    total_patients_engaged,
    total_patients_read_but_no_response,
    patients_waiting_added,
    patients_booked,
    bookings,
    booked_asa,
    booked_asa_assisted,
    booked_human,
    scheduled_asa,
    scheduled_asa_assisted,
    scheduled_human,
    attended_asa,
    attended_asa_assisted,
    attended_human,
    arrived_asa,
    arrived_asa_assisted,
    arrived_human,
    cancelled_asa,
    cancelled_asa_assisted,
    cancelled_human,
    reschedule_asa,
    reschedule_asa_assisted,
    reschedule_human,
    non_attended_asa,
    non_attended_asa_assisted,
    non_attended_human,
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
    funnelLoading,
    bookingLoading,
    interventionsLoading,
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
  // Arrived is treated as Attended for the Booking statuses chart (combined count, no separate row).
  const attendedCombinedCount = (attended ?? 0) + (arrived ?? 0);

  const appointmentOutcomeValues = [
    scheduledOnlyCount,
    attendedCombinedCount,
    non_attended,
    cancelled,
    reschedule,
    sent_in,
    quiet_sent_in,
    walked_out,
    not_updated,
  ];

  const appointmentOutcomes = [
    {
      name: 'Scheduled',
      value: scheduledOnlyCount,
      color: '#6366F1',
      asa: scheduled_asa,
      assisted: scheduled_asa_assisted,
      human: scheduled_human,
    },
    {
      name: 'Attended',
      value: attendedCombinedCount,
      color: '#10B981',
      asa: (attended_asa ?? 0) + (arrived_asa ?? 0),
      assisted: (attended_asa_assisted ?? 0) + (arrived_asa_assisted ?? 0),
      human: (attended_human ?? 0) + (arrived_human ?? 0),
    },
    {
      name: 'Not attended',
      value: non_attended ?? -1,
      color: '#F59E0B',
      asa: non_attended_asa,
      assisted: non_attended_asa_assisted,
      human: non_attended_human,
    },
    {
      name: 'Cancelled',
      value: cancelled ?? -1,
      color: '#EF4444',
      asa: cancelled_asa,
      assisted: cancelled_asa_assisted,
      human: cancelled_human,
    },
    {
      name: 'Rescheduled',
      value: reschedule ?? -1,
      color: '#6B7280',
      asa: reschedule_asa,
      assisted: reschedule_asa_assisted,
      human: reschedule_human,
    },
    { name: 'Sent in', value: sent_in ?? -1, color: '#06B6D4' },
    { name: 'Quiet sent in', value: quiet_sent_in ?? -1, color: '#84CC16' },
    { name: 'Walked out', value: walked_out ?? -1, color: '#F97316' },
    { name: 'Not updated', value: not_updated ?? -1, color: '#64748B' }
  ].filter(item => item.value > 0);

  const usePlaceholderAppointmentOutcomes =
    !bookingLoading && areAllAppointmentOutcomesZero(appointmentOutcomeValues);

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
      tip: KPI_TOOLTIPS.emergency_situation,
    },
    {
      titleMessage: 'Human intervention',
      value: human_intervention ?? -1,
      change: calculateValueChange(human_intervention, percentage_changes?.pc_human_intervention),
      progressStatus: 'HUMAN_INTERVENTION',
      tip: KPI_TOOLTIPS.human_intervention,
    },
    {
      titleMessage: isMedbridge ? 'Study taken elsewhere' : 'Screened elsewhere',
      value: already_screened ?? -1,
      change: calculateValueChange(already_screened, percentage_changes?.pc_already_screened),
      progressStatus: 'SCREENED_ELSEWHERE',
      tip: KPI_TOOLTIPS.already_screened,
    },
    {
      titleMessage: 'Declined',
      value: declines ?? -1,
      change: calculateValueChange(declines, percentage_changes?.pc_declined),
      progressStatus: 'DECLINED',
      tip: KPI_TOOLTIPS.declined,
    },
    {
      titleMessage: 'Opt-out',
      value: opt_out ?? -1,
      change: calculateValueChange(opt_out, percentage_changes?.pc_opt_out),
      progressStatus: 'OPT_OUT',
      tip: KPI_TOOLTIPS.opt_out,
    },
    {
      titleMessage: 'Snoozed',
      value: snoozed ?? -1,
      change: calculateValueChange(snoozed, percentage_changes?.pc_snoozed),
      progressStatus: 'SNOOZED',
      tip: KPI_TOOLTIPS.snoozed,
    }
  ];

  const previousAfterHours =
    (percentage_changes?.pc_booking_time_distribution?.evening ?? 0)
    + (percentage_changes?.pc_booking_time_distribution?.night ?? 0);
  const afterHoursChange = calculateValueChange(calculateAfterHoursBookings(), previousAfterHours);
  const messagesFailedCount = total_patients_failed_message_status;
  const previousMessagesFailedCount = percentage_changes?.pc_failed_messages;
  const failedMessagesChange = calculateValueChange(
    messagesFailedCount,
    previousMessagesFailedCount
  );
  const totalFailedMessagesChange = calculateValueChange(
    total_failed_messages_count,
    percentage_changes?.pc_total_failed_messages
  );
  const deliveredUnengagedChange = calculateValueChange(
    total_patients_read_but_no_response,
    percentage_changes?.pc_delivered_unengaged
  );

  const funnelStages = FUNNEL_STAGES_META.map((meta) => ({
    ...meta,
    value: {
      invited: total_patients_added,
      waiting: patients_waiting_added ?? 0,
      delivered: total_patients_invited,
      engaged: total_patients_engaged,
      booked: patients_booked ?? bookings,
    }[meta.key],
    tip: {
      invited: KPI_TOOLTIPS.invited,
      waiting: KPI_TOOLTIPS.waiting_added,
      delivered: KPI_TOOLTIPS.delivered,
      engaged: KPI_TOOLTIPS.engaged,
      booked: KPI_TOOLTIPS.booked_funnel,
    }[meta.key],
    asa: meta.key === 'booked' ? booked_asa : undefined,
    assisted: meta.key === 'booked' ? booked_asa_assisted : undefined,
    human: meta.key === 'booked' ? booked_human : undefined,
  }));

  const mobileShortFormat = getDateFormatByCountry(country).replace('YYYY', 'YY');

  const previousPeriodLabel = previousPeriod ? (
    <Text type="secondary" style={{ fontSize: isMobile ? 11 : 13 }}>
      vs {isMobile
        ? `${dayjs(previousPeriod[0]).format(mobileShortFormat)} – ${dayjs(previousPeriod[1]).format(mobileShortFormat)}`
        : `${formatDateByCountry(previousPeriod[0], country)} – ${formatDateByCountry(previousPeriod[1], country)}`}
    </Text>
  ) : null;

  const concernMetrics = [
    {
      key: 'unengaged',
      label: 'Delivered · unengaged',
      tip: KPI_TOOLTIPS.delivered_unengaged,
      value: displayValue(total_patients_read_but_no_response),
      change: deliveredUnengagedChange,
      onClick: () => goToBookingProgress('NO_RESPONSE'),
    },
    {
      key: 'totalFailedMessages',
      label: 'Messages failed',
      tip: KPI_TOOLTIPS.messages_failed,
      value: displayValue(total_failed_messages_count),
      change: totalFailedMessagesChange,
      onClick: () => setFailedMessagesModalOpen(true),
    },
  ];

  return (
    <>
      <Spin spinning={funnelLoading}>
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
                  tip={KPI_TOOLTIPS.engagement_rate}
                  value={displayValue(engagement_rate, true)}
                  change={percentage_changes?.pc_engagement_rate}
                  changeType="percentage"
                  accent="#5D4EBF"
                  isMobile={isMobile}
                />
                <RateTile
                  label="Booking rate"
                  tip={KPI_TOOLTIPS.booking_rate}
                  value={displayValue(booking_rate, true)}
                  change={percentage_changes?.pc_booking_rate}
                  changeType="percentage"
                  accent="#18D9C5"
                  isMobile={isMobile}
                />
                <RateTile
                  label="Bookings after hours"
                  tip={KPI_TOOLTIPS.bookings_after_hours}
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
              const isClickable = typeof metric.onClick === 'function';
              const isHovered = hoveredConcernKey === metric.key;

              return (
                <Col xs={24} sm={12} key={metric.key}>
                  <div
                    role={isClickable ? 'button' : undefined}
                    tabIndex={isClickable ? 0 : undefined}
                    onClick={isClickable ? metric.onClick : undefined}
                    onKeyDown={isClickable ? (e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        metric.onClick();
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
                      <Text style={{ fontSize: isMobile ? 13 : 14, color: HEADING_COLOR }}>
                        {metric.label}
                        <MetricHint tip={metric.tip} />
                      </Text>
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
      </Spin>

      <Row gutter={[isMobile ? 12 : 16, isMobile ? 12 : 16]} style={{ marginTop: isMobile ? 12 : 16 }} align="stretch">
        <Col xs={24} md={12} style={{ display: 'flex' }}>
          <Spin spinning={bookingLoading} style={{ width: '100%' }}>
            <SectionCard
              title={(
                <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                  Booking statuses
                  <MetricHint tip={KPI_TOOLTIPS.bookings} />
                </span>
              )}
              isMobile={isMobile}
              fillHeight={!isMobile}
              extra={usePlaceholderAppointmentOutcomes ? (
                <Text type="secondary" style={{ fontSize: 12 }}>Sample data</Text>
              ) : (
                <Tooltip title={KPI_TOOLTIPS.booked_handling}>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    ASA {(booked_asa ?? 0).toLocaleString()}
                    {' · '}
                    Assisted {(booked_asa_assisted ?? 0).toLocaleString()}
                    {' · '}
                    Human {(booked_human ?? 0).toLocaleString()}
                  </Text>
                </Tooltip>
              )}
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
                    const asa = Number(item.asa ?? 0);
                    const assisted = Number(item.assisted ?? 0);
                    const human = Number(item.human ?? 0);
                    const sourceTotal = asa + assisted + human;
                    const showSourceSplit =
                      !usePlaceholderAppointmentOutcomes
                      && item.asa != null
                      && sourceTotal > 0
                      && value > 0;
                    const fillWidth = Math.max(pct, value > 0 ? 2 : 0);
                    const asaShare = showSourceSplit ? asa / sourceTotal : 0;
                    const assistedShare = showSourceSplit ? assisted / sourceTotal : 0;
                    const humanShare = showSourceSplit ? human / sourceTotal : 0;

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
                          {showSourceSplit ? (
                            <div
                              style={{
                                height: '100%',
                                width: `${fillWidth}%`,
                                display: 'flex',
                                borderRadius: 999,
                                overflow: 'hidden',
                                transition: 'width 0.7s cubic-bezier(0.22, 1, 0.36, 1)',
                              }}
                            >
                              {asa > 0 ? (
                                <Tooltip title={`ASA booked ${asa.toLocaleString()}`}>
                                  <div
                                    style={{
                                      height: '100%',
                                      width: `${asaShare * 100}%`,
                                      minWidth: 4,
                                      background: ASA_COLOR,
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                </Tooltip>
                              ) : null}
                              {assisted > 0 ? (
                                <Tooltip title={`ASA assisted ${assisted.toLocaleString()}`}>
                                  <div
                                    style={{
                                      height: '100%',
                                      width: `${assistedShare * 100}%`,
                                      minWidth: 4,
                                      background: ASSISTED_COLOR,
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                </Tooltip>
                              ) : null}
                              {human > 0 ? (
                                <Tooltip title={`Human booked ${human.toLocaleString()}`}>
                                  <div
                                    style={{
                                      height: '100%',
                                      width: `${humanShare * 100}%`,
                                      minWidth: 4,
                                      background: HUMAN_COLOR,
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                </Tooltip>
                              ) : null}
                            </div>
                          ) : (
                            <div
                              style={{
                                height: '100%',
                                width: `${fillWidth}%`,
                                borderRadius: 999,
                                background: color,
                                transition: 'width 0.7s cubic-bezier(0.22, 1, 0.36, 1)',
                              }}
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </SectionCard>
          </Spin>
        </Col>

        <Col xs={24} md={12} style={{ display: 'flex', alignSelf: 'flex-start' }}>
          <Spin spinning={interventionsLoading} style={{ width: '100%' }}>
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
                    tip={item.tip}
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
          </Spin>
        </Col>
      </Row>

      <FailedMessagesModal
        open={failedMessagesModalOpen}
        onClose={() => setFailedMessagesModalOpen(false)}
        startTime={startTime}
        endTime={endTime}
        campaignId={campaignId}
      />
    </>
  );
};

export default ClinicStats;
