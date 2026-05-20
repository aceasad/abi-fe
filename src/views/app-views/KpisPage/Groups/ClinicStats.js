import React from 'react';
import { useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import { makeSelectClinicStatsData } from 'redux/selectors/Overview';
import { Card, Row, Col, Typography, Spin } from 'antd';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, LabelList } from 'recharts';
import { formatDateByCountry, getDateFormatByCountry } from 'utils/helpers';
import dayjs from 'utils/dayjs';
import messages from '../messages';

const { Text } = Typography;

const pieChartColors = ['#5D4EBF', '#E880FF', '#FFBFB0', '#18D9C5', '#121E38', '#8C3B87', '#e8fbf9'];

const displayValue = (value, isPercentage = false) => {
  if (value === null || value === undefined || value === '') return '-1';
  if (isPercentage) return `${Number(value).toFixed(1)}%`;
  return value;
};
// Helper function to format percentage change display with + for positive values
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
const calculatePercentChange = (currentValue, previousValue) => {
  const current = Number(currentValue ?? 0);
  const previous = Number(previousValue ?? 0);
  if (!Number.isFinite(current) || !Number.isFinite(previous) || previous === 0) return null;
  return ((current - previous) / previous) * 100;
};
const calculateValueChange = (currentValue, previousValue) => {
  const current = Number(currentValue ?? 0);
  const previous = Number(previousValue ?? 0);
  if (!Number.isFinite(current) || !Number.isFinite(previous)) return null;
  return current - previous;
};

const StatCard = ({ title, value, subtitle, color = '#000000', change = null, changeType = "percentage", style = {}, bare = false, isMobile = false }) => {
  const changeIsObject = change != null && typeof change === 'object';
  const changeNode = !changeIsObject && change != null ? (
        <Text
          type="secondary"
          style={{
            color: (changeType !== "decrease" && typeof change === 'number' && change > 0) ? '#10B981' : (changeType !== "increase" && typeof change === 'number' && change < 0) ? '#EF4444' : '#6B7280',
            justifyContent: 'center',
            fontSize: isMobile ? '12px' : '16px',
          }}>
          {changeType === "percentage"
            ? formatPercentageChangeDisplay(change)
            : formatValueChangeDisplay(change)}
        </Text>
      ) : null;

  const content = (
    <div style={{ display: 'flex', alignItems: "center", gap: '8px', flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
      <div style={{ fontSize: isMobile ? '20px' : '28px', fontWeight: 'bold', color }}>
        {value}
      </div>
      {changeNode}
    </div>
  );
  if (bare) {
    return (
      <div style={{ height: isMobile ? '80px' : '100px', textAlign: 'left', ...style }}>
        <Text
          type='secondary'
          style={{
            display: 'block',
            fontSize: isMobile ? '12px' : '15px',
            fontWeight: 'strong',
            lineHeight: '22px',
            marginBottom: isMobile ? '4px' : '8px'

          }}
        >
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
    <Card
      title={<Text type='secondary' style={{ fontWeight: 'strong', fontSize: isMobile ? '12px' : '15px' }}>{title}</Text>}
      size="small"
      style={style}
      styles={{ body: { padding: isMobile ? '12px' : '16px' } }}
    >
      {content}
      {subtitle ? (
        <Text type="secondary" style={{ display: 'block', fontSize: isMobile ? '11px' : '12px', marginTop: 8 }}>
          {subtitle}
        </Text>
      ) : null}
    </Card>
  );
};

const ClinicStats = ({ title, previousPeriod, isMobile = false, country }) => {
  const { formatMessage } = useIntl();
  const { PASProvider } = useSelector((state) => state.auth.user || {});
  const isMedbridge = PASProvider?.toLowerCase() === 'medbridge';
  const {
    engagement_rate,
    booking_rate,
    total_patients_added,
    total_patients_invited,
    total_patients_failed_message_status,
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
    const evening = booking_time_distribution.evening ?? 0;
    const night = booking_time_distribution.night ?? 0;
    return evening + night;
  };

  const priorBucketSubtitle =
    percentage_changes?.pc_booking_time_distribution &&
    typeof percentage_changes.pc_booking_time_distribution === 'object'
      ? formatMessage(messages.clinicStatsPriorBucketDetail, {
          morning: percentage_changes.pc_booking_time_distribution.morning ?? 0,
          afternoon: percentage_changes.pc_booking_time_distribution.afternoon ?? 0,
          evening: percentage_changes.pc_booking_time_distribution.evening ?? 0,
          night: percentage_changes.pc_booking_time_distribution.night ?? 0,
        })
      : null;

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

  const interventionData = [
    {
      titleMessage: messages.clinicStatsInterventionEmergency,
      value: emergency_situation ?? -1,
      previousValue: percentage_changes?.pc_emergency_situation,
      change: calculateValueChange(emergency_situation, percentage_changes?.pc_emergency_situation),
    },
    {
      titleMessage: messages.clinicStatsInterventionHuman,
      value: human_intervention ?? -1,
      previousValue: percentage_changes?.pc_human_intervention,
      change: calculateValueChange(human_intervention, percentage_changes?.pc_human_intervention),
    },
    {
      titleMessage: isMedbridge
        ? messages.clinicStatsInterventionScreenedElsewhereMedbridge
        : messages.clinicStatsInterventionScreenedElsewhere,
      value: already_screened ?? -1,
      previousValue: percentage_changes?.pc_already_screened,
      change: calculateValueChange(already_screened, percentage_changes?.pc_already_screened),
    },
    {
      titleMessage: messages.clinicStatsInterventionDeclined,
      value: declines ?? -1,
      previousValue: percentage_changes?.pc_declined,
      change: calculateValueChange(declines, percentage_changes?.pc_declined),
    },
    {
      titleMessage: messages.clinicStatsInterventionOptOut,
      value: opt_out ?? -1,
      previousValue: percentage_changes?.pc_opt_out,
      change: calculateValueChange(opt_out, percentage_changes?.pc_opt_out),
    },
    {
      titleMessage: messages.clinicStatsInterventionSnoozed,
      value: snoozed ?? -1,
      previousValue: percentage_changes?.pc_snoozed,
      change: calculateValueChange(snoozed, percentage_changes?.pc_snoozed),
    }
  ];
  const previousAfterHours =
    (percentage_changes?.pc_booking_time_distribution?.evening ?? 0)
    + (percentage_changes?.pc_booking_time_distribution?.night ?? 0);
  const afterHoursChange = calculateValueChange(calculateAfterHoursBookings(), previousAfterHours);
  const failedMessagesChange = calculateValueChange(
    total_patients_failed_message_status,
    percentage_changes?.pc_failed_messages
  );
  const deliveredUnengagedChange = calculateValueChange(
    total_patients_read_but_no_response,
    percentage_changes?.pc_delivered_unengaged
  );

  const communicationFlowData = [
    { name: formatMessage(messages.clinicStatsFlowInvited), value: total_patients_added ?? -1 },
    { name: formatMessage(messages.clinicStatsFlowDelivered), value: total_patients_invited ?? -1 },
    { name: formatMessage(messages.clinicStatsFlowEngaged), value: total_patients_engaged ?? -1 },
    { name: formatMessage(messages.clinicStatsFlowBooked), value: bookings ?? -1 }
  ];
  const mobileShortFormat = getDateFormatByCountry(country).replace('YYYY', 'YY');

  const failedMessageTitle = (
    <>
      <span style={{ color: '#EF4444' }}>{formatMessage(messages.clinicStatsFailedPrefix)}</span>
      {' — '}
      {formatMessage(messages.clinicStatsFailedMessageDetail)}
    </>
  );
  const deliveredUnengagedTitle = (
    <>
      <span style={{ color: '#EF4444' }}>{formatMessage(messages.clinicStatsDeliveredPrefix)}</span>
      {' — '}
      {formatMessage(messages.clinicStatsFailedUnengagedDetail)}
    </>
  );

  return (
    <Spin spinning={loading}>
    <>
      <Card title={formatMessage(messages.clinicStatsCommunicationFlow)}>
        {previousPeriod && !isMobile && (
          <Text type="secondary" style={{ position: "absolute", top: 20, left: 276 }}>
            {formatMessage(messages.clinicStatsPreviousPeriod)}{' '}
            {formatDateByCountry(previousPeriod[0], country)} - {formatDateByCountry(previousPeriod[1], country)}
          </Text>
        )}

        {previousPeriod && isMobile && (
          <Text type="secondary" style={{ display: 'block', marginBottom: '12px', fontSize: '12px' }}>
            {formatMessage(messages.clinicStatsPreviousPeriod)}:{' '}
            {dayjs(previousPeriod[0]).format(mobileShortFormat)} - {dayjs(previousPeriod[1]).format(mobileShortFormat)}
          </Text>
        )}

        <Row gutter={16}>
          <Col xs={24} lg={18}>
            <Row gutter={isMobile ? 8 : 16}>
              <Col xs={12} sm={6} md={6} lg={6}>
                <StatCard title={formatMessage(messages.clinicStatsPatientEnrolled)} value={displayValue(total_patients_added)} style={{ width: '100%', height: isMobile ? 80 : 100 }} isMobile={isMobile} />
              </Col>
              <Col xs={12} sm={6} md={6} lg={6}>
                <StatCard title={formatMessage(messages.clinicStatsInvitesRecieved)} value={displayValue(total_patients_invited)} style={{ width: '100%', height: isMobile ? 80 : 100 }} isMobile={isMobile} />
              </Col>
              <Col xs={12} sm={6} md={6} lg={6}>
                <StatCard title={formatMessage(messages.clinicStatsOpenConversation)} value={displayValue(total_patients_engaged)} style={{ width: '100%', height: isMobile ? 80 : 100 }} isMobile={isMobile} />
              </Col>
              <Col xs={12} sm={6} md={6} lg={6}>
                <StatCard title={formatMessage(messages.clinicStatsBookingsMade)} value={displayValue(bookings)} style={{ width: '100%', height: isMobile ? 80 : 100 }} isMobile={isMobile} />
              </Col>
            </Row>

            <Card style={{ borderRadius: 8, marginTop: 16 }}>
              {isMobile ? (
                <>
                  <div style={{ width: '100%', marginBottom: '16px' }}>
                    <ResponsiveContainer width="100%" height={175}>
                      <BarChart data={communicationFlowData} margin={{ top: 20, right: 10, left: 10, bottom: 0 }}>
                        <Bar dataKey="value" fill="#5B4CDB" radius={[4, 4, 0, 0]}>
                          <LabelList dataKey="name" position="top" style={{ fill: '#000000', fontSize: '12px' }} />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <Row gutter={8}>
                    <Col span={12}>
                      <StatCard
                        title={formatMessage(messages.clinicStatsEngagement)}
                        value={displayValue(engagement_rate, true)}
                        change={percentage_changes?.pc_engagement_rate}
                        changeType="percentage"
                        bare
                        isMobile={isMobile}
                      />
                    </Col>
                    <Col span={12}>
                      <StatCard
                        title={formatMessage(messages.clinicStatsAfterHours)}
                        value={displayValue(calculateAfterHoursBookings())}
                        change={afterHoursChange}
                        subtitle={priorBucketSubtitle}
                        changeType="value"
                        bare
                        isMobile={isMobile}
                      />
                    </Col>
                  </Row>
                </>
              ) : (
                <div style={{
                  display: 'flex',
                  flexDirection: 'row',
                  flexWrap: 'nowrap',
                  alignItems: 'flex-start',
                  height: '220px',
                }}>
                  <div style={{ flex: 1 }}>
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={communicationFlowData} margin={{ top: 20, right: 30, left: 20, bottom: 0 }}>
                        <Bar dataKey="value" fill="#5B4CDB" radius={[4, 4, 0, 0]}>
                          <LabelList dataKey="name" position="top" style={{ fill: '#000000', fontSize: '14px' }} />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    height: '100%',
                    minWidth: '240px',
                    marginLeft: '16px'
                  }}>
                    <div style={{ width: '100%', marginBottom: '20px' }}>
                      <StatCard
                        title={formatMessage(messages.clinicStatsEngagement)}
                        value={displayValue(engagement_rate, true)}
                        change={percentage_changes?.pc_engagement_rate}
                        changeType="percentage"
                        bare
                        isMobile={false}
                      />
                    </div>
                    <div style={{ width: '100%' }}>
                      <StatCard
                        title={formatMessage(messages.clinicStatsBookingsAfterHours)}
                        value={displayValue(calculateAfterHoursBookings())}
                        change={afterHoursChange}
                        subtitle={priorBucketSubtitle}
                        changeType="value"
                        bare
                        isMobile={false}
                      />
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </Col>

          <Col xs={24} lg={6} style={{ marginTop: isMobile ? 12 : 0 }}>
            <Row gutter={isMobile ? 8 : 16}>
              <Col xs={24} sm={8} lg={24}>
                <StatCard
                  title={formatMessage(messages.clinicStatsBookingRate)}
                  value={displayValue(booking_rate, true)}
                  change={percentage_changes?.pc_booking_rate}
                  changeType="percentage"
                  style={{ width: '100%', height: isMobile ? 80 : 100, marginBottom: 16 }}
                  isMobile={isMobile}
                />
              </Col>
              <Col xs={24} sm={8} lg={24}>
                <StatCard
                  title={failedMessageTitle}
                  value={displayValue(total_patients_failed_message_status)}
                  change={failedMessagesChange}
                  changeType="value"
                  style={{ width: '100%', height: isMobile ? 80 : 100, marginBottom: 16 }}
                  isMobile={isMobile}
                />
              </Col>
              <Col xs={24} sm={8} lg={24}>
                <StatCard
                  title={deliveredUnengagedTitle}
                  value={displayValue(total_patients_read_but_no_response)}
                  change={deliveredUnengagedChange}
                  changeType="value"
                  style={{ width: '100%', height: isMobile ? 80 : 100 }}
                  isMobile={isMobile}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>

      <Row gutter={isMobile ? 12 : 16} style={{ marginTop: isMobile ? 12 : 0 }}>
        <Col xs={24} sm={24} md={12} lg={12} style={{ marginBottom: isMobile ? 12 : 0 }}>
          <Card title={formatMessage(messages.clinicStatsAppointmentOutcomes)} style={isMobile ? { height: 'auto' } : { minHeight: 425 }}>
            <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row' }}>
              <ResponsiveContainer height={isMobile ? 300 : 350}>
                <PieChart>
                  <Pie
                    data={appointmentOutcomes}
                    cx="50%"
                    cy="50%"
                    dataKey="value"
                    label={({ name, value }) => value > 0 ? (isMobile ? `${value}` : `${name}: ${value}`) : ''}
                    labelLine={{ stroke: '#666', strokeWidth: 1 }}
                    labelPosition="outside"
                    style={{ fontWeight: 'bold', fontSize: isMobile ? '12px' : '14px' }}
                  >
                    {appointmentOutcomes.map((_entry, index) => <Cell key={`cell-${index}`} fill={pieChartColors[index]} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div style={{
                width: isMobile ? '100%' : '120px',
                display: 'flex',
                flexDirection: isMobile ? 'row' : 'column',
                flexWrap: 'wrap',
                justifyContent: isMobile ? 'center' : 'center',
                gap: isMobile ? '12px' : '12px',
                marginTop: isMobile ? '12px' : 0
              }}>
                {appointmentOutcomes.map((item, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      backgroundColor: pieChartColors[index],
                      borderRadius: '50%',
                      marginRight: '8px',
                      flexShrink: 0
                    }} />
                    <Text strong style={{ fontSize: isMobile ? '12px' : '14px' }}>{item.name}</Text>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={24} md={12} lg={12}>
          <Card title={formatMessage(messages.clinicStatsInterventionTitle)} style={isMobile ? { height: 'auto' } : { minHeight: 425 }}>
            <Row gutter={isMobile ? 8 : 16}>
              {interventionData.map((item, index) => (
                  <Col key={index} xs={12} sm={12} md={12} lg={12} style={{ marginBottom: isMobile ? 8 : 0 }}>
                    <StatCard
                      title={formatMessage(item.titleMessage)}
                      value={item.value}
                      change={item.change}
                      subtitle={undefined}
                      changeType="value"
                      style={{ width: '100%' }}
                      isMobile={isMobile}
                    />
                  </Col>
                ))}
            </Row>
          </Card>
        </Col>
      </Row>
    </>
    </Spin>
  );
};

export default ClinicStats;