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
const ALERT_COLOR = '#E5484D';
const STATUS_COLORS = {
  scheduled: '#5D4EBF',
  attended: '#14C2B0',
  no_show: '#F59E0B',
  cancelled: '#94A3B8',
  outcome_pending: '#CBD5E1',
};

const KPI_TOOLTIPS = {
  invited:
    'Everyone added in this date range. Does not exclude people we never reached or whose first message failed.',
  delivered:
    'People who successfully received at least one message from Asa. Does not include failed-only sends.',
  engaged:
    'People we successfully messaged who also replied at least once. Does not include people who never answered.',
  booked_funnel:
    'People who booked at least one appointment in this period. Does not include people who only rescheduled.',
  engagement_rate:
    'Of people we successfully messaged, how many replied. Does not include failed sends or people never messaged.',
  booking_rate:
    'Of people who replied, how many also booked. Does not include people who booked by phone without ever messaging Asa.',
  bookings_after_hours:
    'Appointments Asa booked after the clinic closed, in clinic local time. Does not include staff bookings — those timestamps are when the clinic system synced, not when the patient booked.',
  delivered_unengaged:
    'People we successfully messaged who have not replied yet. Does not include failed sends.',
  messages_failed:
    'People whose messages could not be delivered. The count is people, not message rows.',
  bookings:
    'Appointments booked in this period. Paired overnight slots count as one. Does not include reschedules — those sit under Changes and attendance.',
  booked_asa_end_to_end:
    'Asa booked this appointment with no staff in the conversation before it was confirmed.',
  booked_human_started:
    'Staff entered the conversation, then Asa finished the booking.',
  booked_staff_managed:
    'Staff booked this in the clinic system. Asa still messages the patient and can reschedule.',
  resolved_by_asa:
    'People who replied and never needed a staff takeover. Does not include people flagged for human intervention.',
  status_scheduled:
    'Upcoming appointments that have not happened yet. Does not include attended, no-show, cancelled, or pending outcomes.',
  status_attended:
    'Appointments the patient attended. Does not include no-shows, cancellations, or still-scheduled bookings.',
  status_no_show:
    'Appointments the patient missed. Does not include cancelled or still-scheduled bookings.',
  status_cancelled:
    'Appointments cancelled and not replaced. Does not include reschedules.',
  status_outcome_pending:
    'The clinic has not recorded whether the patient attended. Does not include scheduled, attended, no-show, or cancelled.',
  rescheduled:
    'Appointments moved to a new time. Counted separately from bookings so the invoice still matches.',
  attendance_rate:
    'Of appointments that already happened, how many the patient attended. Does not include cancelled, still scheduled, or pending outcomes.',
  billed_appointments:
    'Bookings plus reschedules — the appointments billed for this period.',
  emergency_situation:
    'People flagged for an emergency that needs immediate staff attention.',
  human_intervention:
    'People where a staff member had to take over the Asa conversation.',
  already_screened:
    'People who said they were already screened or had the study elsewhere.',
  declined:
    'People who declined the invitation.',
  opt_out:
    'People who asked to stop receiving messages.',
  snoozed:
    'People who asked to be contacted again later.',
};

const FUNNEL_STAGES_META = [
  { key: 'invited', label: 'Invited', gradient: 'linear-gradient(180deg, #5D4EBF, #6E5FD8)', progressStatus: null },
  { key: 'delivered', label: 'Delivered', gradient: 'linear-gradient(180deg, #6E5FD8, #8C7DEC)', progressStatus: null },
  { key: 'engaged', label: 'Engaged', gradient: 'linear-gradient(180deg, #8C7DEC, #A99AF0)', progressStatus: 'BOOKING' },
  { key: 'booked', label: 'Patients booked', gradient: 'linear-gradient(180deg, #A99AF0, #C4B9F5)', progressStatus: 'BOOKED' },
];

const fmtCount = (n) => {
  if (n == null || Number.isNaN(Number(n))) return '—';
  return Number(n).toLocaleString();
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

const PLACEHOLDER_APPOINTMENT_OUTCOMES = [
  { name: 'Scheduled', value: 35, percent: 45.5, color: STATUS_COLORS.scheduled },
  { name: 'Attended', value: 25, percent: 32.5, color: STATUS_COLORS.attended },
  { name: 'No-show', value: 8, percent: 10.4, color: STATUS_COLORS.no_show },
  { name: 'Cancelled', value: 5, percent: 6.5, color: STATUS_COLORS.cancelled },
  { name: 'Outcome pending', value: 4, percent: 5.2, color: STATUS_COLORS.outcome_pending },
];

// The "Booking progress" tab on the Overview page is keyed "5". Clicking a
// booking status bar deep-links there and pre-fills its "Filter by status"
// control, so each KPI outcome label is mapped to the matching progress status
// key used by that filter (see PatientProgressTable's statusMapping).
const BOOKING_PROGRESS_TAB_KEY = '5';

const OUTCOME_TO_PROGRESS_STATUS = {
  'Scheduled': 'BOOKED',
  'Attended': 'ATTENDED',
  'No-show': 'NOT_ATTENDED',
  'Cancelled': 'CANCELLED',
  'Outcome pending': 'NOT_UPDATED',
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
  if (change == null || change === '') return null;
  const numericChange = typeof change === 'number' ? change : Number(change);
  if (!Number.isFinite(numericChange) || isNaN(numericChange)) return null;

  const isPositive = numericChange > 0;
  const isNegative = numericChange < 0;
  const isUp = changeType !== 'decrease' && isPositive;
  const isDown = changeType !== 'increase' && isNegative;

  const palette = isUp
    ? { color: '#0E9F6E', bg: 'rgba(24, 217, 197, 0.12)' }
    : isDown
      ? { color: '#E5484D', bg: 'rgba(229, 72, 77, 0.10)' }
      : { color: MUTED_COLOR, bg: 'rgba(114, 132, 154, 0.10)' };

  const label = changeType === 'percentage'
    ? formatPercentageChangeDisplay(numericChange)
    : formatValueChangeDisplay(numericChange);

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
        height: style?.height ?? (compact ? 'auto' : '100%'),
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
const RATE_TILE_MIN_HEIGHT = 110;
const RATE_TILE_MIN_HEIGHT_MOBILE = 100;

const RateTile = ({
  label,
  value,
  change,
  changeType = 'percentage',
  accent = '#5D4EBF',
  subtitle,
  tip,
  valueTip,
  isMobile = false,
}) => (
  <div
    style={{
      background: '#fff',
      border: CARD_BORDER,
      borderRadius: 14,
      padding: isMobile ? '12px 14px' : '14px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      justifyContent: 'space-between',
      minHeight: isMobile ? RATE_TILE_MIN_HEIGHT_MOBILE : RATE_TILE_MIN_HEIGHT,
      height: '100%',
      boxSizing: 'border-box',
    }}
  >
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: accent, flexShrink: 0 }} />
        <Text type="secondary" style={{ fontSize: isMobile ? 13 : 14 }}>{label}</Text>
        <MetricHint tip={tip} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        {valueTip ? (
          <Tooltip title={valueTip} placement="top">
            <span
              style={{
                fontSize: isMobile ? 22 : 26,
                fontWeight: 700,
                color: HEADING_COLOR,
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
                cursor: 'help',
                borderBottom: `1px dotted ${MUTED_COLOR}`,
              }}
            >
              {value}
            </span>
          </Tooltip>
        ) : (
          <span style={{ fontSize: isMobile ? 22 : 26, fontWeight: 700, color: HEADING_COLOR, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            {value}
          </span>
        )}
        <DeltaBadge change={change} changeType={changeType} isMobile={isMobile} />
      </div>
    </div>
    <div
      style={{
        fontSize: isMobile ? 10 : 11,
        color: MUTED_COLOR,
        lineHeight: 1.45,
        minHeight: isMobile ? 28 : 32,
        overflow: 'hidden',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
      }}
    >
      {subtitle || '\u00A0'}
    </div>
  </div>
);

// Side-by-side vertical gauges. Each bar fills to the backend conversion
// for that step (same number as the chip), not the stage count vs invited.
const ConversionFunnel = ({ stages, isMobile, onStageClick }) => {
  const [hoveredKey, setHoveredKey] = useState(null);
  const chartHeight = isMobile ? 150 : 200;
  const barWidth = isMobile ? 28 : 48;
  const isClickable = typeof onStageClick === 'function';

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: isMobile ? 6 : 12 }}>
      {stages.map((stage, index) => {
        const rawValue = isMissing(stage.value) ? null : Number(stage.value);
        const value = rawValue ?? 0;
        const fillPercent = Number(stage.fill_percent ?? 0);
        const fillPx = rawValue == null ? 0 : Math.max((fillPercent / 100) * chartHeight, fillPercent > 0 ? 6 : 0);
        const pillText = stage.chip_label || '—';

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
    after_hours_bookings,
    after_hours_share,
    handled_without_human_rate,
    handled_without_human_numerator,
    handled_without_human_denominator,
    total_patients_invited,
    total_patients_failed_message_status,
    total_failed_messages_count,
    total_patients_engaged,
    total_patients_read_but_no_response,
    engaged_who_booked,
    funnel_stages,
    bookings,
    booked_asa_end_to_end,
    booked_human_started,
    booked_staff_managed,
    booked_human,
    booked_asa_end_to_end_percent,
    booked_human_started_percent,
    booked_staff_managed_percent,
    staff_messages_sent,
    staff_rescheduled_by_asa,
    status_scheduled,
    status_attended,
    status_no_show,
    status_cancelled,
    status_outcome_pending,
    status_scheduled_percent,
    status_attended_percent,
    status_no_show_percent,
    status_cancelled_percent,
    status_outcome_pending_percent,
    attendance_rate,
    billed_appointments,
    reschedule,
    cancelled,
    attended,
    non_attended,
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

  const asaEndToEnd = booked_asa_end_to_end ?? 0;
  const humanStarted = booked_human_started ?? 0;
  const staffManaged = booked_staff_managed ?? booked_human ?? 0;
  const bookingsTotal = Number(bookings ?? 0);

  const statusRows = [
    {
      name: 'Scheduled',
      value: status_scheduled ?? 0,
      percent: status_scheduled_percent ?? 0,
      color: STATUS_COLORS.scheduled,
      tip: KPI_TOOLTIPS.status_scheduled,
    },
    {
      name: 'Attended',
      value: status_attended ?? attended ?? 0,
      percent: status_attended_percent ?? 0,
      color: STATUS_COLORS.attended,
      tip: KPI_TOOLTIPS.status_attended,
    },
    {
      name: 'No-show',
      value: status_no_show ?? non_attended ?? 0,
      percent: status_no_show_percent ?? 0,
      color: STATUS_COLORS.no_show,
      tip: KPI_TOOLTIPS.status_no_show,
    },
    {
      name: 'Cancelled',
      value: status_cancelled ?? cancelled ?? 0,
      percent: status_cancelled_percent ?? 0,
      color: STATUS_COLORS.cancelled,
      tip: KPI_TOOLTIPS.status_cancelled,
    },
    {
      name: 'Outcome pending',
      value: status_outcome_pending ?? not_updated ?? 0,
      percent: status_outcome_pending_percent ?? 0,
      color: STATUS_COLORS.outcome_pending,
      tip: KPI_TOOLTIPS.status_outcome_pending,
    },
  ];
  const statusValues = statusRows.map((row) => Number(row.value ?? 0));
  const usePlaceholderAppointmentOutcomes =
    !bookingLoading && areAllAppointmentOutcomesZero(statusValues);
  const statusForChart = usePlaceholderAppointmentOutcomes
    ? PLACEHOLDER_APPOINTMENT_OUTCOMES
    : statusRows;

  const bookedByRows = [
    {
      label: 'Asa end-to-end',
      value: asaEndToEnd,
      percent: booked_asa_end_to_end_percent ?? 0,
      color: ASA_COLOR,
      tip: KPI_TOOLTIPS.booked_asa_end_to_end,
    },
    {
      label: 'Human-started, Asa-completed',
      value: humanStarted,
      percent: booked_human_started_percent ?? 0,
      color: ASSISTED_COLOR,
      tip: KPI_TOOLTIPS.booked_human_started,
    },
    {
      label: 'Booked by staff, managed by Asa',
      value: staffManaged,
      percent: booked_staff_managed_percent ?? 0,
      color: HUMAN_COLOR,
      tip: KPI_TOOLTIPS.booked_staff_managed,
      extra: `${fmtCount(staff_messages_sent)} messages sent · ${fmtCount(staff_rescheduled_by_asa)} rescheduled by Asa`,
    },
  ];

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
    },
  ];

  const messagesFailedPatients = total_patients_failed_message_status;
  const failedMessagesChange = calculateValueChange(
    messagesFailedPatients,
    percentage_changes?.pc_failed_messages
  );
  const deliveredUnengagedChange = calculateValueChange(
    total_patients_read_but_no_response,
    percentage_changes?.pc_delivered_unengaged
  );
  const messagesFailedTip = total_failed_messages_count
    ? `${KPI_TOOLTIPS.messages_failed} ${fmtCount(total_failed_messages_count)} messages failed to send.`
    : KPI_TOOLTIPS.messages_failed;

  const afterHoursCount = after_hours_bookings ?? 0;
  const afterHoursShareOfAsa = after_hours_share ?? 0;

  const stagesByKey = Object.fromEntries((funnel_stages || []).map((stage) => [stage.key, stage]));
  const funnelStages = FUNNEL_STAGES_META.map((meta) => ({
    ...meta,
    value: stagesByKey[meta.key]?.value,
    fill_percent: stagesByKey[meta.key]?.fill_percent,
    chip_label: stagesByKey[meta.key]?.chip_label,
    tip: {
      invited: KPI_TOOLTIPS.invited,
      delivered: KPI_TOOLTIPS.delivered,
      engaged: KPI_TOOLTIPS.engaged,
      booked: KPI_TOOLTIPS.booked_funnel,
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

  const billedLine = `${fmtCount(bookingsTotal)} bookings + ${fmtCount(reschedule)} reschedules = ${fmtCount(billed_appointments)} billed appointments`;

  const renderBarRow = ({
    key,
    label,
    value,
    percent,
    color,
    tip,
    extra,
    isClickable,
    onClick,
    hovered,
    onHover,
  }) => {
    const pct = Number(percent ?? 0);
    const fillWidth = Math.max(pct, Number(value ?? 0) > 0 ? 2 : 0);
    return (
      <div
        key={key}
        role={isClickable ? 'button' : undefined}
        tabIndex={isClickable ? 0 : undefined}
        onClick={isClickable ? onClick : undefined}
        onKeyDown={isClickable ? (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick();
          }
        } : undefined}
        onMouseEnter={isClickable ? () => onHover(true) : undefined}
        onMouseLeave={isClickable ? () => onHover(false) : undefined}
        style={{
          cursor: isClickable ? 'pointer' : 'default',
          margin: '0 -8px',
          padding: isMobile ? '6px 8px' : '6px 8px',
          borderRadius: 10,
          background: isClickable && hovered ? 'rgba(93, 78, 191, 0.06)' : 'transparent',
          outline: 'none',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
          <Text style={{ fontSize: isMobile ? 13 : 14, color: HEADING_COLOR }}>
            {label}
            <MetricHint tip={tip} />
          </Text>
          <span style={{ fontSize: isMobile ? 13 : 14, color: HEADING_COLOR, whiteSpace: 'nowrap' }}>
            <span style={{ fontWeight: 700 }}>{Number(value ?? 0).toLocaleString()}</span>
            <span style={{ color: MUTED_COLOR, marginLeft: 8 }}>{pct.toFixed(1)}%</span>
          </span>
        </div>
        <div style={{ height: isMobile ? 8 : 10, borderRadius: 999, background: TRACK_COLOR, overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              width: `${fillWidth}%`,
              borderRadius: 999,
              background: color,
              transition: 'width 0.7s cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          />
        </div>
        {extra ? (
          <div style={{ fontSize: 11, color: MUTED_COLOR, marginTop: 6 }}>{extra}</div>
        ) : null}
      </div>
    );
  };

  const journeyAlerts = [
    {
      key: 'unengaged',
      label: 'Delivered · unengaged',
      tip: KPI_TOOLTIPS.delivered_unengaged,
      value: displayValue(total_patients_read_but_no_response),
      change: deliveredUnengagedChange,
      onClick: () => goToBookingProgress('NO_RESPONSE'),
    },
    {
      key: 'failed',
      label: 'Messages failed',
      tip: messagesFailedTip,
      value: displayValue(messagesFailedPatients),
      change: failedMessagesChange,
      onClick: () => setFailedMessagesModalOpen(true),
    },
  ];

  return (
    <>
      <style>
        {`
          .kpi-equal-card-spin {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            flex: 1;
          }
          .kpi-equal-card-spin .ant-spin-container {
            height: 100%;
            display: flex;
            flex-direction: column;
            flex: 1;
          }
        `}
      </style>
      <Spin spinning={funnelLoading}>
        <SectionCard title="Patient journey" extra={previousPeriodLabel} isMobile={isMobile}>
          <Row gutter={[12, 12]} align="top">
            <Col xs={24} lg={16}>
              <ConversionFunnel
                stages={funnelStages}
                isMobile={isMobile}
                onStageClick={(stage) => goToBookingProgress(stage.progressStatus)}
              />
            </Col>
            <Col xs={24} lg={8}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <RateTile
                  label="Engagement rate"
                  tip={KPI_TOOLTIPS.engagement_rate}
                  value={displayValue(engagement_rate, true)}
                  change={percentage_changes?.pc_engagement_rate}
                  changeType="percentage"
                  accent="#5D4EBF"
                  isMobile={isMobile}
                  subtitle={`${fmtCount(total_patients_engaged)} of ${fmtCount(total_patients_invited)} messaged`}
                />
                <RateTile
                  label="Booking rate"
                  tip={KPI_TOOLTIPS.booking_rate}
                  value={displayValue(booking_rate, true)}
                  change={percentage_changes?.pc_booking_rate}
                  changeType="percentage"
                  accent="#6E5FD8"
                  isMobile={isMobile}
                  subtitle={`${fmtCount(engaged_who_booked)} of ${fmtCount(total_patients_engaged)} who replied`}
                />
                <RateTile
                  label="Booked outside clinic hours"
                  tip={KPI_TOOLTIPS.bookings_after_hours}
                  value={displayValue(afterHoursCount)}
                  change={calculateValueChange(afterHoursCount, percentage_changes?.pc_after_hours_bookings)}
                  changeType="value"
                  accent="#8C7DEC"
                  isMobile={isMobile}
                  subtitle={`${displayValue(afterHoursShareOfAsa, true)} of bookings Asa made`}
                />
              </div>
            </Col>
          </Row>
          <Row gutter={[12, 12]} style={{ marginTop: isMobile ? 12 : 16 }}>
            {journeyAlerts.map((metric) => {
              const isHovered = hoveredConcernKey === metric.key;
              return (
                <Col xs={24} sm={12} key={metric.key}>
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={metric.onClick}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        metric.onClick();
                      }
                    }}
                    onMouseEnter={() => setHoveredConcernKey(metric.key)}
                    onMouseLeave={() => setHoveredConcernKey(null)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8,
                      padding: isMobile ? '12px 14px' : '14px 16px',
                      borderRadius: 14,
                      background: '#fff',
                      border: CARD_BORDER,
                      cursor: 'pointer',
                      outline: 'none',
                      boxShadow: isHovered ? '0 4px 12px rgba(26, 51, 83, 0.08)' : 'none',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          background: ALERT_COLOR,
                          flexShrink: 0,
                        }}
                      />
                      <Text type="secondary" style={{ fontSize: isMobile ? 12 : 13 }}>
                        {metric.label}
                        <MetricHint tip={metric.tip} />
                      </Text>
                      <RightOutlined
                        style={{
                          marginLeft: 'auto',
                          fontSize: 11,
                          color: isHovered ? ALERT_COLOR : MUTED_COLOR,
                          opacity: isHovered ? 1 : 0.45,
                        }}
                      />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: isMobile ? 20 : 24, fontWeight: 700, color: HEADING_COLOR, letterSpacing: '-0.02em' }}>
                        {metric.value}
                      </span>
                      <DeltaBadge change={metric.change} changeType="value" isMobile={isMobile} />
                    </div>
                  </div>
                </Col>
              );
            })}
          </Row>
        </SectionCard>
      </Spin>

      <Row gutter={[isMobile ? 12 : 16, isMobile ? 12 : 16]} style={{ marginTop: isMobile ? 12 : 16 }} align="stretch">
        <Col xs={24} lg={12} style={{ display: 'flex' }}>
          <Spin
            spinning={bookingLoading}
            style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}
            wrapperClassName="kpi-equal-card-spin"
          >
            <SectionCard
              title={(
                <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                  Bookings
                  <MetricHint tip={KPI_TOOLTIPS.bookings} />
                </span>
              )}
              isMobile={isMobile}
              fillHeight={!isMobile}
              extra={usePlaceholderAppointmentOutcomes ? (
                <Text type="secondary" style={{ fontSize: 12 }}>Sample data</Text>
              ) : null}
              style={isMobile ? { height: 'auto', width: '100%' } : { minHeight: 520, height: '100%', width: '100%' }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 16 : 20, flex: 1 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                    <span style={{ fontSize: isMobile ? 30 : 36, fontWeight: 700, color: HEADING_COLOR, letterSpacing: '-0.02em', lineHeight: 1 }}>
                      {bookingsTotal.toLocaleString()}
                    </span>
                    <span style={{ fontSize: isMobile ? 13 : 14, color: MUTED_COLOR }}>total bookings</span>
                  </div>
                </div>

                <div>
                  <Text style={{ fontSize: 13, fontWeight: 600, color: HEADING_COLOR, display: 'block', marginBottom: 8 }}>
                    Booked by
                  </Text>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {bookedByRows.map((row) => renderBarRow({
                      key: row.label,
                      label: row.label,
                      value: usePlaceholderAppointmentOutcomes ? 0 : row.value,
                      percent: usePlaceholderAppointmentOutcomes ? 0 : row.percent,
                      color: row.color,
                      tip: row.tip,
                      extra: usePlaceholderAppointmentOutcomes ? null : row.extra,
                    }))}
                  </div>
                  <Text type="secondary" style={{ fontSize: 11, display: 'block', marginTop: 10, lineHeight: 1.45 }}>
                    Staff bookings still sit in Asa’s inbox — Asa messages the patient and can reschedule them.
                  </Text>
                </div>

                <div>
                  <Text style={{ fontSize: 13, fontWeight: 600, color: HEADING_COLOR, display: 'block', marginBottom: 8 }}>
                    Status
                  </Text>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {statusForChart.map((item) => renderBarRow({
                      key: item.name,
                      label: item.name,
                      value: item.value,
                      percent: item.percent,
                      color: item.color,
                      tip: item.tip,
                      isClickable: Boolean(OUTCOME_TO_PROGRESS_STATUS[item.name]) && !usePlaceholderAppointmentOutcomes,
                      onClick: () => handleOutcomeClick(item.name),
                      hovered: hoveredOutcome === item.name,
                      onHover: (on) => setHoveredOutcome(on ? item.name : null),
                    }))}
                  </div>
                </div>
              </div>
            </SectionCard>
          </Spin>
        </Col>

        <Col xs={24} lg={12} style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 12 : 16 }}>
          <Spin
            spinning={interventionsLoading}
            style={{ width: '100%', display: 'flex', flexDirection: 'column' }}
            wrapperClassName="kpi-equal-card-spin"
          >
            <SectionCard title="Intervention & special cases" isMobile={isMobile}>
              <div
                style={{
                  marginBottom: isMobile ? 12 : 16,
                  padding: isMobile ? '12px 14px' : '14px 16px',
                  borderRadius: 14,
                  background: 'rgba(20, 194, 176, 0.08)',
                  border: '1px solid rgba(20, 194, 176, 0.22)',
                }}
              >
                <Text type="secondary" style={{ fontSize: isMobile ? 12 : 13, display: 'block', marginBottom: 6 }}>
                  Resolved by Asa without escalation
                  <MetricHint tip={KPI_TOOLTIPS.resolved_by_asa} />
                </Text>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: isMobile ? 22 : 26, fontWeight: 700, color: HEADING_COLOR, letterSpacing: '-0.02em' }}>
                    {displayValue(handled_without_human_rate, true)}
                  </span>
                  <DeltaBadge
                    change={percentage_changes?.pc_handled_without_human_rate}
                    changeType="percentage"
                    isMobile={isMobile}
                  />
                </div>
                <Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 6 }}>
                  {fmtCount(handled_without_human_numerator)} of {fmtCount(handled_without_human_denominator)} people who replied
                </Text>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
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
                    style={{ width: '100%', height: '100%', minHeight: isMobile ? undefined : 0 }}
                    isMobile={isMobile}
                    onClick={item.progressStatus ? () => goToBookingProgress(item.progressStatus) : undefined}
                  />
                ))}
              </div>
            </SectionCard>
          </Spin>

          <Spin spinning={bookingLoading} style={{ width: '100%' }}>
            <SectionCard
              title={(
                <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                  Changes and attendance
                  <MetricHint tip={KPI_TOOLTIPS.rescheduled} />
                </span>
              )}
              isMobile={isMobile}
            >
              <Row gutter={[12, 12]}>
                <Col xs={24} sm={12}>
                  <RateTile
                    label="Rescheduled"
                    tip={KPI_TOOLTIPS.rescheduled}
                    value={displayValue(reschedule)}
                    accent={HUMAN_COLOR}
                    isMobile={isMobile}
                    subtitle="Moved to a new time"
                  />
                </Col>
                <Col xs={24} sm={12}>
                  <RateTile
                    label="Attendance rate"
                    tip={KPI_TOOLTIPS.attendance_rate}
                    value={displayValue(attendance_rate, true)}
                    accent={ASA_COLOR}
                    isMobile={isMobile}
                    subtitle={`${fmtCount(status_attended ?? attended)} attended of ${fmtCount((Number(status_attended ?? attended ?? 0) + Number(status_no_show ?? non_attended ?? 0)))} taken place`}
                  />
                </Col>
              </Row>
              <div
                style={{
                  marginTop: 12,
                  padding: '10px 12px',
                  borderRadius: 10,
                  background: '#f7f8fc',
                  fontSize: 12,
                  color: HEADING_COLOR,
                }}
              >
                <MetricHint tip={KPI_TOOLTIPS.billed_appointments} />
                {' '}
                {billedLine}
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
