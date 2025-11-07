import React from 'react';
import { useSelector } from 'react-redux';
import { makeSelectClinicStatsData } from 'redux/selectors/Overview';
import { Card, Row, Col, Typography } from 'antd';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, LabelList } from 'recharts';

const { Text } = Typography;

const pieChartColors = ['#5D4EBF', '#E880FF', '#FFBFB0', '#18D9C5', '#121E38', '#8C3B87', '#e8fbf9'];

const displayValue = (value, isPercentage = false) => {
  if (value === null || value === undefined || value === '') return '-1';
  if (isPercentage) return `${Number(value).toFixed(1)}%`;
  return value;
};
// Helper function to compare current and previous values
const compareValues = (current, previous) => {
  if (previous === undefined || previous === null || current === -1 || previous === 0) return null;
  if (current > previous) return { type: 'increase', value: previous };
  if (current < previous) return { type: 'decrease', value: previous };
  return null;
};

// Helper function to format percentage change display with + for positive values
const formatPercentageChangeDisplay = (value) => {
  if (value == null || isNaN(value)) return null;
  const formattedValue = Number(value).toFixed(1);
  return value < 0 ? `-${formattedValue}%` : `+${formattedValue}%`;
};

const StatCard = ({ title, value, subtitle, color = '#000000', change = "12", changeType = "percentage", style = {}, bare = false, isMobile = false }) => {
  const content = (
    <div style={{ display: 'flex', alignItems: "center", gap: '8px', flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
      <div style={{ fontSize: isMobile ? '20px' : '28px', fontWeight: 'bold', color }}>
        {value}
      </div>
      {change != null && (
        <Text
          type="secondary"
          style={{
            color: (changeType !== "decrease" && change > 0) ? '#10B981' : (changeType !== "increase" && change < 0) ? '#EF4444' : '#6B7280',
            justifyContent: 'center',
            fontSize: isMobile ? '12px' : '16px',
          }}>
          {changeType === "percentage" ? formatPercentageChangeDisplay(change) : change}
        </Text>
      )}
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
    </Card>
  );
};

const ClinicStats = ({ title, previousPeriod, isMobile = false }) => {
  const {
    engagement_rate,
    booking_rate,
    total_patients_added,
    total_patients_invited,
    total_patients_failed_message_status,
    total_patients_sent_message_status,
    total_patients_engaged,
    total_patients_read_but_no_response,
    open_conversations,
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
    percentage_changes
  } = useSelector(makeSelectClinicStatsData);

  // Calculate after hours bookings (evening + night)
  const calculateAfterHoursBookings = () => {
    if (!booking_time_distribution) return -1;
    const evening = booking_time_distribution.evening ?? 0;
    const night = booking_time_distribution.night ?? 0;
    return evening + night;
  };

  // Appointment outcomes - only use API data, show -1 for missing, filter out zero values
  const appointmentOutcomes = [
    { name: 'Bookings', value: bookings ?? -1, color: '#6366F1' },
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
  // Intervention data with proper percentage change mapping
  const interventionData = [
    {
      title: 'Emergency situation',
      value: emergency_situation ?? -1,
      previousValue: percentage_changes?.pc_emergency_situation
    },
    {
      title: 'Human intervention',
      value: human_intervention ?? -1,
      previousValue: percentage_changes?.pc_human_intervention
    },
    {
      title: 'Screened elsewhere',
      value: already_screened ?? -1,
      previousValue: percentage_changes?.pc_already_screened
    },
    {
      title: 'Declined',
      value: declines ?? -1,
      previousValue: percentage_changes?.pc_declined
    },
    {
      title: 'Opt-out',
      value: opt_out ?? -1,
      previousValue: percentage_changes?.pc_opt_out
    },
    {
      title: 'Snoozed',
      value: snoozed ?? -1,
      previousValue: percentage_changes?.pc_snoozed
    }
  ];

  // Communication flow data - only use API data
  const communicationFlowData = [
    { name: 'Invited', value: total_patients_added ?? -1 },
    { name: 'Delivered', value: total_patients_invited ?? -1 },
    { name: 'Engaged', value: total_patients_engaged ?? -1 },
    { name: 'Booked', value: bookings ?? -1 }
  ];

  return (
    <>
      <Card title="Patient Communication Flow">
        {previousPeriod && !isMobile && (
          <Text type="secondary" style={{ position: "absolute", top: 20, left: 276 }}>
            Previous period {previousPeriod[0].format('D MMMM YYYY')} - {previousPeriod[1].format('D MMMM YYYY')}
          </Text>
        )}

        {previousPeriod && isMobile && (
          <Text type="secondary" style={{ display: 'block', marginBottom: '12px', fontSize: '12px' }}>
            Previous: {previousPeriod[0].format('DD/MM/YY')} - {previousPeriod[1].format('DD/MM/YY')}
          </Text>
        )}

        <Row gutter={16}>
          {/* LEFT COLUMN */}
          <Col xs={24} lg={18}>
            {/* Top 4 StatCards */}
            <Row gutter={isMobile ? 8 : 16}>
              <Col xs={12} sm={6} md={6} lg={6}>
                <StatCard title="Patients invited" value={displayValue(total_patients_added)} style={{ width: '100%', height: isMobile ? 80 : 100 }} isMobile={isMobile} />
              </Col>
              <Col xs={12} sm={6} md={6} lg={6}>
                <StatCard title="Invites delivered" value={displayValue(total_patients_invited)} style={{ width: '100%', height: isMobile ? 80 : 100 }} isMobile={isMobile} />
              </Col>
              <Col xs={12} sm={6} md={6} lg={6}>
                <StatCard title="Patients engaged" value={displayValue(total_patients_engaged)} style={{ width: '100%', height: isMobile ? 80 : 100 }} isMobile={isMobile} />
              </Col>
              <Col xs={12} sm={6} md={6} lg={6}>
                <StatCard title="Bookings made" value={displayValue(bookings)} style={{ width: '100%', height: isMobile ? 80 : 100 }} isMobile={isMobile} />
              </Col>
            </Row>

            {/* Graph + Engagement/AfterHours inside same Card */}
            <Card style={{ borderRadius: 8, marginTop: 16 }}>
              {isMobile ? (
                // Mobile: Stack everything vertically
                <>
                  {/* Bar Chart */}
                  <div style={{ width: '100%', marginBottom: '16px' }}>
                    <ResponsiveContainer width="100%" height={175}>
                      <BarChart data={communicationFlowData} margin={{ top: 20, right: 10, left: 10, bottom: 0 }}>
                        <Bar dataKey="value" fill="#5B4CDB" radius={[4, 4, 0, 0]}>
                          <LabelList dataKey="name" position="top" style={{ fill: '#000000', fontSize: '12px' }} />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Engagement & After Hours stacked */}
                  <Row gutter={8}>
                    <Col span={12}>
                      <StatCard
                        title="Engagement"
                        value={displayValue(engagement_rate, true)}
                        change={percentage_changes?.pc_engagement_rate}
                        changeType="percentage"
                        bare
                        isMobile={isMobile}
                      />
                    </Col>
                    <Col span={12}>
                      <StatCard
                        title="After hours"
                        value={displayValue(calculateAfterHoursBookings())}
                        change={percentage_changes?.pc_booking_time_distribution}
                        changeType="percentage"
                        bare
                        isMobile={isMobile}
                      />
                    </Col>
                  </Row>
                </>
              ) : (
                // Desktop: Side by side
                <div style={{
                  display: 'flex',
                  flexDirection: 'row',
                  flexWrap: 'nowrap',
                  alignItems: 'flex-start',
                  height: '220px',
                }}>
                  {/* Bar Chart */}
                  <div style={{ flex: 1 }}>
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={communicationFlowData} margin={{ top: 20, right: 30, left: 20, bottom: 0 }}>
                        <Bar dataKey="value" fill="#5B4CDB" radius={[4, 4, 0, 0]}>
                          <LabelList dataKey="name" position="top" style={{ fill: '#000000', fontSize: '14px' }} />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Inline Engagement & After Hours (no card borders) */}
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
                        title="Engagement"
                        value={displayValue(engagement_rate, true)}
                        change={percentage_changes?.pc_engagement_rate}
                        changeType="percentage"
                        bare
                        isMobile={false}
                      />
                    </div>
                    <div style={{ width: '100%' }}>
                      <StatCard
                        title="Bookings made after hours"
                        value={displayValue(calculateAfterHoursBookings())}
                        change={percentage_changes?.pc_booking_time_distribution}
                        changeType="percentage"
                        bare
                        isMobile={false}
                      />
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </Col>

          {/* RIGHT COLUMN */}
          <Col xs={24} lg={6} style={{ marginTop: isMobile ? 12 : 0 }}>
            <Row gutter={isMobile ? 8 : 16}>
              <Col xs={24} sm={8} lg={24}>
                <StatCard
                  title="Booking rate"
                  value={displayValue(booking_rate, true)}
                  change={percentage_changes?.pc_booking_rate}
                  changeType="percentage"
                  style={{ width: '100%', height: isMobile ? 80 : 100, marginBottom: 16 }}
                  isMobile={isMobile}
                />
              </Col>
              <Col xs={24} sm={8} lg={24}>
                <StatCard
                  title={<><span style={{ color: "#EF4444" }}>Failed</span> - Message failed</>}
                  value={displayValue(total_patients_failed_message_status)}
                  change={percentage_changes?.pc_failed_messages}
                  changeType="percentage"
                  style={{ width: '100%', height: isMobile ? 80 : 100, marginBottom: 16 }}
                  isMobile={isMobile}
                />
              </Col>
              <Col xs={24} sm={8} lg={24}>
                <StatCard
                  title={<><span style={{ color: "#EF4444" }}>Failed</span> - Unengaged</>}
                  value={displayValue(total_patients_read_but_no_response)}
                  change={percentage_changes?.pc_failed_messages}
                  changeType="percentage"
                  style={{ width: '100%', height: isMobile ? 80 : 100 }}
                  isMobile={isMobile}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>

      <Row gutter={isMobile ? 12 : 16} style={{ marginTop: isMobile ? 12 : 0 }}>
        {/* Appointment Outcomes Pie Chart */}
        <Col xs={24} sm={24} md={12} lg={12} style={{ marginBottom: isMobile ? 12 : 0 }}>
          <Card title="Appointment Outcomes" style={{ height: isMobile ? 'auto' : 425 }}>
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

        {/* Intervention & Special Cases */}
        <Col xs={24} sm={24} md={12} lg={12}>
          <Card title="Intervention & Special Cases" style={{ height: isMobile ? 'auto' : 425 }}>
            <Row gutter={isMobile ? 8 : 16}>
              {interventionData.map((item, index) => {
                const comparison = compareValues(item.value, item.previousValue);
                return (
                  <Col key={index} xs={12} sm={12} md={12} lg={12} style={{ marginBottom: isMobile ? 8 : 0 }}>
                    <StatCard
                      title={item.title}
                      value={item.value}
                      change={comparison?.value}
                      changeType={comparison?.type}
                      style={{ width: '100%' }}
                      isMobile={isMobile}
                    />
                  </Col>
                );
              })}
            </Row>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ClinicStats;