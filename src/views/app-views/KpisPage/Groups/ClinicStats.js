import React from 'react';
import { useSelector } from 'react-redux';
import { makeSelectClinicStatsData } from 'redux/selectors/Overview';
import { Card, Row, Col, Typography } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, LabelList } from 'recharts';


const { Title, Text } = Typography;


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


  const displayValue = (value, isPercentage = false) => {
    if (value === null || value === undefined || value === '') {
      return '-1';
    }
    if (isPercentage) {
      return `${Number(value).toFixed(1)}%`;
    }
    return value;
  };
  const displayPreviousMonthValue = (value) => {
    if (value === null || value === undefined) {
      return null;
    }
    return value;
  };
  // Helper function to compare current and previous values
  const compareValues = (current, previous) => {
    if (previous === undefined || previous === null || current === -1 || previous === 0) return null;
    if (current > previous) return { type: 'increase', value: previous };
    if (current < previous) return { type: 'decrease', value: previous };
    return null;
  };
  // Helper function to display percentage change with proper formatting
  const displayPercentageChange = (value) => {
    console.log('Display Percentage Change Input:', value);
    if (value === null || value === undefined) {
      return null;
    }
    const result = Number(value).toFixed(1);
    console.log('Display Percentage Change Result:', result);
    return result;
  };

  // Helper function to format percentage change display with + for positive values
  const formatPercentageChangeDisplay = (value) => {
    if (value === null || value === undefined) {
      return null;
    }
    const formattedValue = Number(value).toFixed(1);
    return value > 0 ? `+${formattedValue}` : formattedValue;
  };

  // Calculate after hours bookings (evening + night)
  const calculateAfterHoursBookings = () => {
    if (!booking_time_distribution) return -1;
    const evening = booking_time_distribution.evening ?? 0;
    const night = booking_time_distribution.night ?? 0;
    return evening + night;
  };

  // Calculate after hours bookings percentage change
  const calculateAfterHoursBookingsPercentageChange = () => {
    if (!percentage_changes?.pc_booking_time_distribution) return null;
    const evening = percentage_changes.pc_booking_time_distribution.evening ?? 0;
    const night = percentage_changes.pc_booking_time_distribution.night ?? 0;
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

  const StatCard = ({ title, value, subtitle, color = '#000000', percentageChange }) => (
    <Card size="small" style={{ height: '120px', display: 'flex', alignItems: 'center' }}>
      <div style={{ textAlign: 'center', width: '100%' }}>
        <Text type="secondary" style={{ display: 'block', marginBottom: '8px' }}>{title}</Text>
        <div style={{ fontSize: '24px', fontWeight: 'bold', color, margin: '8px 0' }}>
          {value}
        </div>
        {(percentageChange !== null && percentageChange !== undefined) && (
          <div style={{
            color: percentageChange > 0 ? '#10B981' : percentageChange < 0 ? '#EF4444' : '#6B7280',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px'
          }}>
            {percentageChange > 0 ? <ArrowUpOutlined /> : percentageChange < 0 ? <ArrowDownOutlined /> : null}
            {formatPercentageChangeDisplay(percentageChange)}%
          </div>
        )}
        {subtitle && <Text type="secondary">{subtitle}</Text>}
      </div>
    </Card>
  );

  // Communication flow data - only use API data
  const communicationFlowData = [
    { name: 'Invited', value: total_patients_added ?? -1 },
    { name: 'Delivered', value: total_patients_sent_message_status ?? -1 },
    { name: 'Engaged', value: total_patients_engaged ?? -1 },
    { name: 'Booked', value: bookings ?? -1 }
  ];

  return (
    <Card title="Patient Communication Flow" style={{ padding: window.innerWidth < 768 ? '12px' : '20px' }}>
      {previousPeriod && (
        <Text type="secondary" style={{ position: "absolute", top: 39, left: 280 }}>
          Previous period {previousPeriod[0].format('MMMM D, YYYY')} - {previousPeriod[1].format('MMMM D, YYYY')}
        </Text>
      )}

      {/* Top Stats Row */}
      <Row style={{ marginBottom: '24px' }} justify="space-between">
        <Col xs={12} sm={8} md={4} lg={4}>
          <StatCard
            title="Patients invited"
            value={displayValue(total_patients_added)}
          />
        </Col>
        <Col xs={12} sm={8} md={4} lg={4}>
          <StatCard
            title="Invites delivered"
            value={displayValue(total_patients_sent_message_status)}
          />
        </Col>
        <Col xs={12} sm={8} md={4} lg={4}>
          <StatCard
            title="Patients engaged"
            value={displayValue(total_patients_engaged)}
          />
        </Col>
        <Col xs={12} sm={8} md={4} lg={4}>
          <StatCard
            title="Bookings made"
            value={displayValue(bookings)}
          />
        </Col>
        <Col xs={12} sm={8} md={4} lg={4}>
          <StatCard
            title="Booking rate"
            value={displayValue(booking_rate, true)}
            percentageChange={displayPercentageChange(percentage_changes?.pc_booking_rate)}
          />
        </Col>
      </Row>

      <Row justify='space-between' >
        {/* Communication Flow Bar Chart */}
        <Col xs={24} sm={24} md={13} lg={13}>
          <Card title=" " style={{ height: 'auto', minHeight: '400px' }}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={communicationFlowData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <Bar dataKey="value" fill="#5B4CDB" radius={[4, 4, 0, 0]} >
                  <LabelList dataKey="name" position="top" style={{ fill: '#000000', fontSize: '14px' }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Failed Messages and Engagement Rate - Updated to 2x2 grid */}
        <Col xs={24} sm={24} md={12} lg={10}>
          <div style={{ height: 'auto', minHeight: '400px' }}>
            <Row gutter={[16, 16]} style={{ height: '100%' }}>
              <Col xs={12} sm={12} md={12} lg={12}>
                <StatCard
                  title="Engagement"
                  value={displayValue(engagement_rate, true)}
                  percentageChange={displayPercentageChange(percentage_changes?.pc_engagement_rate)}
                />
              </Col>
              <Col xs={12} sm={12} md={12} lg={12}>
                <StatCard
                  title={<Text type="secondary" style={{ display: 'block', marginBottom: '12px' }}><span style={{ color: "#EF4444" }}>Failed</span> - Message failed</Text>}
                  value={displayValue(total_patients_failed_message_status)}
                  percentageChange={displayPercentageChange(percentage_changes?.pc_failed_messages)}
                />
              </Col>
              <Col xs={12} sm={12} md={12} lg={12}>
                <StatCard
                  title="Bookings made after hours"
                  value={displayValue(calculateAfterHoursBookings())}
                  percentageChange={displayPercentageChange(percentage_changes?.pc_booking_time_distribution)}
                />
              </Col>
              <Col xs={12} sm={12} md={12} lg={12}>
                <StatCard
                  title={<Text type="secondary" style={{ display: 'block', marginBottom: '12px' }}><span style={{ color: "#EF4444" }}>Failed</span> - Unengaged</Text>}
                  value={displayValue(total_patients_read_but_no_response)}
                  percentageChange={displayPercentageChange(percentage_changes?.pc_failed_messages)}
                />
              </Col>
            </Row>
          </div>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
        {/* Appointment Outcomes Pie Chart */}
        <Col xs={24} sm={24} md={12} lg={12}>
          <Card title="Appointment Outcomes" style={{ height: 'auto', minHeight: '400px' }}>
            <div style={{ display: 'flex', flexDirection: window.innerWidth < 768 ? 'column' : 'row', height: 'auto', minHeight: '300px' }}>
              <div style={{ flex: 1, minHeight: '200px' }}>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={appointmentOutcomes}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, value }) => value > 0 ? `${name}: ${value}` : ''}
                      labelLine={{ stroke: '#666', strokeWidth: 1 }}
                      labelPosition="outside"
                    >
                      {appointmentOutcomes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{
                width: window.innerWidth < 768 ? '100%' : '120px',
                paddingLeft: window.innerWidth < 768 ? '0' : '16px',
                paddingTop: window.innerWidth < 768 ? '16px' : '0',
                display: 'flex',
                flexDirection: window.innerWidth < 768 ? 'row' : 'column',
                flexWrap: 'wrap',
                justifyContent: window.innerWidth < 768 ? 'center' : 'center',
                gap: window.innerWidth < 768 ? '16px' : '12px'
              }}>
                {appointmentOutcomes.map((item, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      backgroundColor: item.color,
                      borderRadius: '50%',
                      marginRight: '8px',
                      flexShrink: 0
                    }} />
                    <Text style={{ display: 'flex', alignItems: 'center' }}>{item.name}</Text>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </Col>

        {/* Intervention & Special Cases */}
        <Col xs={24} sm={24} md={12} lg={12}>
          <Card title="Intervention & Special Cases" style={{ height: 'auto', minHeight: '400px' }}>
            <Row gutter={[16, 16]} style={{ height: 'auto' }}>
              {interventionData.map((item, index) => {
                const comparison = compareValues(item.value, item.previousValue);
                return (
                  <Col xs={12} sm={12} md={12} lg={12} key={index} style={{ marginBottom: '16px' }}>
                    <Card size="small" style={{
                      textAlign: 'center',
                      height: '120px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <div>
                        <Text style={{ display: 'block', marginBottom: '8px', color: '#000000' }}>
                          {item.title}
                        </Text>
                        <div style={{
                          fontSize: '20px',
                          fontWeight: 'bold',
                          color: '#000000',
                          margin: '8px 0',
                        }}>
                          {item.value}
                        </div>
                        {comparison && (
                          <div style={{
                            fontSize: '10px',
                            color: comparison.type === 'increase' ? '#10B981' : '#EF4444',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px'
                          }}>
                            {comparison.type === 'increase' ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                            {comparison.value}
                          </div>
                        )}
                      </div>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </Card>
        </Col>


      </Row>

    </Card>
  );
};

export default ClinicStats;

// const ClinicStats = ({ title }) => {
//   const { formatMessage } = useIntl();

//   const { engagement_rate, booking_rate, total_patients_added, total_patients_invited, total_patients_failed_message_status, total_patients_sent_message_status,
//     total_patients_engaged, total_patients_read_but_no_response, open_conversations, bookings,
//     reschedule, cancelled, attended, non_attended, booking_time_distribution,
//     declines, opt_out, snoozed, emergency_situation, human_intervention, already_screened } = useSelector(
//       makeSelectClinicStatsData
//     );
//   return (
//     <div className="mb-4">
//       <GroupRow>
//         <OverviewCard
//           span={6}
//           title={formatMessage(messages.clinicStatsPatientEnrolled)}
//           // tooltip={formatMessage(messages.clinicStatsPatientEnrolled)}
//           content={`${parseInt((total_patients_added) ?? 0, 10)}`}
//           styleTitle={title}
//           icon={<MdAssignmentTurnedIn color="#ffffff" size="40" />}
//           noTooltip
//         />
//         <OverviewCard
//           span={6}
//           title={formatMessage(messages.clinicStatsInvitesRecieved)}
//           content={`${parseInt((total_patients_invited) ?? 0, 10)}`}
//           styleTitle={title}
//           icon={<MdAssignmentTurnedIn color="#ffffff" size="40" />}
//           noTooltip
//         />
//         <OverviewCard
//           span={6}
//           title={formatMessage(messages.clinicStatsOpenConversation)}
//           // tooltip={formatMessage(messages.clinicStatsOpenConversation)}
//           content={`${parseInt(total_patients_engaged ?? 0, 10)}`}
//           styleTitle={title}
//           icon={<MdShowChart color="#ffffff" size="40" />}
//           noTooltip
//         />
//         <OverviewCard
//           span={6}
//           title={formatMessage(messages.clnincStatsInvitationRate)}
//           // tooltip={formatMessage(messages.clinicStatsBookings)}
//           content={`${parseInt(((engagement_rate)) ?? 0, 10)}%`}
//           styleTitle={title}
//           icon={<MdShowChart color="#ffffff" size="40" />}
//           noTooltip
//         />

//       </GroupRow>
//       <GroupRow>
//         <OverviewCard
//           span={6}
//           title={formatMessage(messages.clinicStatsBookings)}
//           // tooltip={formatMessage(messages.clinicStatsBookings)}
//           content={`${parseInt(bookings ?? 0, 10)}`}
//           styleTitle={title}
//           icon={<MdShowChart color="#ffffff" size="40" />}
//           noTooltip
//         />
//         <OverviewCard
//           span={6}
//           title={"Booking rate"}
//           // tooltip={formatMessage(messages.clinicStatsBookings)}
//           content={`${parseInt(((booking_rate)) ?? 0, 10)}%`}
//           styleTitle={title}
//           icon={<MdShowChart color="#ffffff" size="40" />}
//           noTooltip
//         />
//         <OverviewCard
//           span={6}
//           title={formatMessage(messages.clinicStatsDecline)}
//           // tooltip={formatMessage(messages.clinicStatsDecline)}
//           content={`${parseInt(declines ?? 0, 10)}`}
//           styleTitle={title}
//           icon={<MdShowChart color="#ffffff" size="40" />}
//           noTooltip
//         />
//         <OverviewCard
//           span={6}
//           title={formatMessage(messages.clinicStatsAlreadyScreened)}
//           // tooltip={formatMessage(messages.clinicStatsAlreadyScreened)}
//           content={`${parseInt(already_screened ?? 0, 10)}`}
//           styleTitle={title}
//           icon={<MdShowChart color="#ffffff" size="40" />}
//           noTooltip
//         />
//       </GroupRow>
//       <GroupRow>
//         <OverviewCard
//           span={6}
//           title={"Opt-out"}
//           // tooltip={formatMessage(messages.clinicStatsBookings)}
//           content={`${parseInt(opt_out ?? 0, 10)}`}
//           styleTitle={title}
//           icon={<MdShowChart color="#ffffff" size="40" />}
//           noTooltip
//         />


//         <OverviewCard
//           span={6}
//           title={formatMessage(messages.clinicStatsSnoozed)}
//           // tooltip={formatMessage(messages.clinicStatsAlreadyScreened)}
//           content={`${parseInt(snoozed ?? 0, 10)}`}
//           styleTitle={title}
//           icon={<MdShowChart color="#ffffff" size="40" />}
//           noTooltip
//         />

//         <OverviewCard
//           span={6}
//           title={"Emergency situation"}
//           // tooltip={formatMessage(messages.clinicStatsAlreadyScreened)}
//           content={`${parseInt(emergency_situation ?? 0, 10)}`}
//           styleTitle={title}
//           icon={<MdShowChart color="#ffffff" size="40" />}
//           noTooltip
//         />


//         <OverviewCard
//           span={6}
//           title={"Human intervention needed"}
//           // tooltip={formatMessage(messages.clinicStatsAlreadyScreened)}
//           content={`${parseInt(human_intervention ?? 0, 10)}`}
//           styleTitle={title}
//           icon={<MdShowChart color="#ffffff" size="40" />}
//           noTooltip
//         />
//       </GroupRow>
//       <GroupRow>
//         <OverviewCard
//           span={6}
//           title={"Attended"}
//           // tooltip={formatMessage(messages.clinicStatsBookings)}
//           content={`${parseInt(attended ?? 0, 10)}`}
//           styleTitle={title}
//           icon={<MdShowChart color="#ffffff" size="40" />}
//           noTooltip
//         />
//         <OverviewCard
//           span={6}
//           title={"Non attended"}
//           // tooltip={formatMessage(messages.clinicStatsBookings)}
//           content={`${parseInt(non_attended ?? 0, 10)}`}
//           styleTitle={title}
//           icon={<MdShowChart color="#ffffff" size="40" />}
//           noTooltip
//         />
//         <OverviewCard
//           span={6}
//           title={"Reschedules"}
//           // tooltip={formatMessage(messages.clinicStatsBookings)}
//           content={`${parseInt(reschedule ?? 0, 10)}`}
//           styleTitle={title}
//           icon={<MdShowChart color="#ffffff" size="40" />}
//           noTooltip
//         />
//         <OverviewCard
//           span={6}
//           title={"Cancelled"}
//           // tooltip={formatMessage(messages.clinicStatsBookings)}
//           content={`${parseInt(cancelled ?? 0, 10)}`}
//           styleTitle={title}
//           icon={<MdShowChart color="#ffffff" size="40" />}
//           noTooltip
//         />

//       </GroupRow>
//       <GroupRow>
//         <OverviewCard
//           span={6}
//           title={"Morning"}
//           // tooltip={formatMessage(messages.clinicStatsAlreadyScreened)}
//           content={`${parseInt(booking_time_distribution['morning'] ?? 0, 10)}`}
//           styleTitle={title}
//           icon={<MdShowChart color="#ffffff" size="40" />}
//           noTooltip
//         />
//         <OverviewCard
//           span={6}
//           title={"Afternoon"}
//           // tooltip={formatMessage(messages.clinicStatsAlreadyScreened)}
//           content={`${parseInt(booking_time_distribution['afternoon'] ?? 0, 10)}`}
//           styleTitle={title}
//           icon={<MdShowChart color="#ffffff" size="40" />}
//           noTooltip
//         />
//         <OverviewCard
//           span={6}
//           title={"Evening"}
//           // tooltip={formatMessage(messages.clinicStatsAlreadyScreened)}
//           content={`${parseInt(booking_time_distribution['evening'] ?? 0, 10)}`}
//           styleTitle={title}
//           icon={<MdShowChart color="#ffffff" size="40" />}
//           noTooltip
//         />
//         <OverviewCard
//           span={6}
//           title={"Night"}
//           // tooltip={formatMessage(messages.clinicStatsAlreadyScreened)}
//           content={`${parseInt(booking_time_distribution['night'] ?? 0, 10)}`}
//           styleTitle={title}
//           icon={<MdShowChart color="#ffffff" size="40" />}
//           noTooltip
//         />
//       </GroupRow>

//     </div>
//   );
// };

// export default ClinicStats;
