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
  console.log('Display Percentage Change Input:', value);
  if (value == null || isNaN(value)) return null;
  const formattedValue = Number(value).toFixed(1);
  console.log('Display Percentage Change Result:', formattedValue);
  return value < 0 ? `-${formattedValue}%` : `+${formattedValue}%`;
};

const StatCard = ({ title, value, subtitle, color = '#000000', change = "12", changeType = "percentage", style = {}, bare = false }) => {
  const content = (
    <div style={{ display: 'flex', alignItems: "center", gap: '8px' }}>
      <div style={{ fontSize: '24px', fontWeight: 'bold', color }}>
        {value}
      </div>
      {change != null && (
        <Text
          type="secondary"
          style={{
            color: (changeType !== "decrease" && change > 0) ? '#10B981' : (changeType !== "increase" && change < 0) ? '#EF4444' : '#6B7280',
            justifyContent: 'center',
          }}>
          {changeType === "percentage" ? formatPercentageChangeDisplay(change) : change}
        </Text>
      )}
    </div>
  );
  if (bare) {
    return (
      <div style={{ height: '80px', textAlign: 'left', ...style }}>
        <Text
          type='secondary'
          style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: 'strong',
            lineHeight: '22px',
            marginBottom: '4px'

          }}
        >
          {title}
        </Text>
        {content}
      </div>
    );
  }

  return (
    <Card title={<Text type='secondary' style={{ fontWeight: 'strong', }}>{title}</Text>} size="small">
      {content}
    </Card>
  );
};

const ClinicStats = ({ title, previousPeriod }) => {
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

  // Appointment outcomes - only use API data, show -1 for missing
  const appointmentOutcomes = [
    { name: 'Scheduled', value: bookings ?? -1, color: '#6366F1' },
    { name: 'Attended', value: attended ?? -1, color: '#10B981' },
    { name: 'Not attended', value: non_attended ?? -1, color: '#F59E0B' },
    { name: 'Cancelled', value: cancelled ?? -1, color: '#EF4444' },
    { name: 'Rescheduled', value: reschedule ?? -1, color: '#6B7280' }
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
        {previousPeriod && (
          <Text type="secondary" style={{ position: "absolute", top: 20, left: 276 }}>
            Previous period {previousPeriod[0].format('D MMMM YYYY')} - {previousPeriod[1].format('D MMMM YYYY')}
          </Text>
        )}

        <Row gutter={16}>
          {/* LEFT COLUMN */}
          <Col xs={24} md={18}>
            {/* Top 4 StatCards */}
            <Row gutter={16} justify="space-between">
              <Col xs={12} sm={8} md={4} lg={6}>
                <StatCard title="Patients invited" value={displayValue(total_patients_added)} style={{ width: 218, height: 80 }} />
              </Col>
              <Col xs={12} sm={8} md={4} lg={6}>
                <StatCard title="Invites delivered" value={displayValue(total_patients_invited)} style={{ width: 218, height: 80 }} />
              </Col>
              <Col xs={12} sm={8} md={4} lg={6}>
                <StatCard title="Patients engaged" value={displayValue(total_patients_engaged)} style={{ width: 218, height: 80 }} />
              </Col>
              <Col xs={12} sm={8} md={4} lg={6}>
                <StatCard title="Bookings made" value={displayValue(bookings)} style={{ width: 218, height: 80 }} />
              </Col>
            </Row>

            {/* Graph + Engagement/AfterHours inside same Card */}
            <Card style={{ borderRadius: 8, }}>
              <div style={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'nowrap',
                alignItems: 'flex-start',
                height: '175px',
              }}>
                {/* Bar Chart */}
                <div style={{ flex: 2 }}>
                  <ResponsiveContainer width="100%" height={175}>
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
                  minWidth: '218px'
                }}>
                  <div style={{ width: '218px', height: '80px' }}>
                    <StatCard
                      title="Engagement"
                      value={displayValue(engagement_rate, true)}
                      change={percentage_changes?.pc_engagement_rate}
                      changeType="percentage"
                      bare
                    />
                  </div>
                  <div style={{ width: '218px', height: '80px' }}>
                    <StatCard
                      title="Bookings made after hours"
                      value={displayValue(calculateAfterHoursBookings())}
                      change={percentage_changes?.pc_booking_time_distribution}
                      changeType="percentage"
                      bare
                    />
                  </div>
                </div>
              </div>
            </Card>
          </Col>

          {/* RIGHT COLUMN */}
          <Col xs={24} md={5} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <StatCard
              title="Booking rate"
              value={displayValue(booking_rate, true)}
              change={percentage_changes?.pc_booking_rate}
              changeType="percentage"
              style={{ width: 218, height: 80 }}
            />
            <StatCard
              title={<><span style={{ color: "#EF4444" }}>Failed</span> - Message failed</>}
              value={displayValue(total_patients_failed_message_status)}
              change={percentage_changes?.pc_failed_messages}
              changeType="percentage"
              style={{ width: 218, height: 80 }}
            />
            <StatCard
              title={<><span style={{ color: "#EF4444" }}>Failed</span> - Unengaged</>}
              value={displayValue(total_patients_read_but_no_response)}
              change={percentage_changes?.pc_failed_messages}
              changeType="percentage"
              style={{ width: 218, height: 80 }}
            />
          </Col>
        </Row>
      </Card>

      <Row gutter={16}>
        {/* Appointment Outcomes Pie Chart */}
        <Col xs={24} sm={24} md={12} lg={12}>
          <Card title="Appointment Outcomes" style={{ height: 425 }}>
            <div style={{ display: 'flex', flexDirection: window.innerWidth < 768 ? 'column' : 'row' }}>
              <ResponsiveContainer height={350}>
                <PieChart>
                  <Pie
                    data={appointmentOutcomes}
                    cx="50%"
                    cy="50%"
                    dataKey="value"
                    label={({ name, value }) => value > 0 ? `${name}: ${value}` : ''}
                    labelLine={{ stroke: '#666', strokeWidth: 1 }}
                    labelPosition="outside"
                    style={{ fontWeight: 'bold' }}
                  >
                    {appointmentOutcomes.map((_entry, index) => <Cell key={`cell-${index}`} fill={pieChartColors[index]} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div style={{
                width: window.innerWidth < 768 ? '100%' : '120px',
                display: 'flex',
                flexDirection: window.innerWidth < 768 ? 'row' : 'column',
                flexWrap: 'wrap',
                justifyContent: window.innerWidth < 768 ? 'center' : 'center',
                gap: window.innerWidth < 768 ? '16px' : '12px'
              }}>
                {appointmentOutcomes.map((item, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      backgroundColor: item.color,
                      borderRadius: '50%',
                      marginRight: '8px',
                      flexShrink: 0
                    }} />
                    <Text strong>{item.name}</Text>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </Col>

        {/* Intervention & Special Cases */}
        <Col xs={24} sm={24} md={12} lg={12}>
          <Card title="Intervention & Special Cases" style={{ height: 425 }}>
            <Row gutter={16}>
              {interventionData.map((item, index) => {
                const comparison = compareValues(item.value, item.previousValue);
                return (
                  <Col key={index} xs={12} sm={12} md={12} lg={12}>
                    <StatCard
                      title={item.title}
                      value={item.value}
                      change={comparison?.value}
                      changeType={comparison?.type} />
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