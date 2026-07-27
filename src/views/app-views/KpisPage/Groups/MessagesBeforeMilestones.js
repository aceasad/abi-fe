import React, { useEffect, useState } from 'react';
import { Card, Typography, Spin, Empty } from 'antd';
import overviewService from 'services/OverviewService';
import ChartWidget from 'components/shared-components/ChartWidget';

const { Text } = Typography;

const HEADING_COLOR = '#1a3353';
const CARD_RADIUS = 16;
const CARD_BORDER = '1px solid #eef0f4';
const CARD_SHADOW = '0 1px 2px rgba(26, 51, 83, 0.04), 0 8px 24px -16px rgba(26, 51, 83, 0.18)';

// Blue for "before first reply", green for "before first booking" - matches
// the two color keys requested for this chart.
const ENGAGEMENT_COLOR = '#1890FF';
const BOOKING_COLOR = '#52C41A';

// Merge the two independent {messages, patients} histograms into a shared,
// sorted set of x-axis categories so both series line up on the same chart.
const buildChartData = (engagementRows, bookingRows) => {
  const allMessageCounts = new Set([
    ...engagementRows.map((row) => row.messages),
    ...bookingRows.map((row) => row.messages),
  ]);
  const categories = Array.from(allMessageCounts).sort((a, b) => a - b);

  const engagementByMessages = new Map(engagementRows.map((row) => [row.messages, row.patients]));
  const bookingByMessages = new Map(bookingRows.map((row) => [row.messages, row.patients]));

  return {
    categories: categories.map((count) => String(count)),
    engagementData: categories.map((count) => engagementByMessages.get(count) ?? 0),
    bookingData: categories.map((count) => bookingByMessages.get(count) ?? 0),
  };
};

const MessagesBeforeMilestones = ({ startTime, endTime, campaignId, isMobile = false }) => {
  const [loading, setLoading] = useState(false);
  const [engagementRows, setEngagementRows] = useState([]);
  const [bookingRows, setBookingRows] = useState([]);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      setLoading(true);
      try {
        const { data } = await overviewService.getMessagesBeforeMilestones(startTime, endTime, campaignId);
        if (cancelled) return;
        setEngagementRows(data?.messages_before_first_engagement ?? []);
        setBookingRows(data?.messages_before_first_booking ?? []);
      } catch (err) {
        if (!cancelled) {
          setEngagementRows([]);
          setBookingRows([]);
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

  const { categories, engagementData, bookingData } = buildChartData(engagementRows, bookingRows);
  const hasData = categories.length > 0;

  const totalEngagementPatients = engagementRows.reduce((sum, row) => sum + row.patients, 0);
  const totalBookingPatients = bookingRows.reduce((sum, row) => sum + row.patients, 0);

  const series = [
    { name: 'Before first reply', data: engagementData },
    { name: 'Before first booking', data: bookingData },
  ];

  return (
    <Card
      title={
        <span style={{ fontSize: isMobile ? 15 : 16, fontWeight: 600, color: HEADING_COLOR }}>
          Messages sent before key milestones
        </span>
      }
      style={{ borderRadius: CARD_RADIUS, border: CARD_BORDER, boxShadow: CARD_SHADOW }}
      styles={{
        header: { borderBottom: 'none', paddingInline: 16, minHeight: 'auto' },
        body: { paddingTop: 8 },
      }}
    >
      <Spin spinning={loading}>
        <div style={{ display: 'flex', gap: 20, marginBottom: 12, flexWrap: 'wrap' }}>
          <Text type="secondary" style={{ fontSize: isMobile ? 12 : 13 }}>
            <span
              style={{
                display: 'inline-block',
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: ENGAGEMENT_COLOR,
                marginRight: 6,
              }}
            />
            {totalEngagementPatients.toLocaleString()} patients replied at least once
          </Text>
          <Text type="secondary" style={{ fontSize: isMobile ? 12 : 13 }}>
            <span
              style={{
                display: 'inline-block',
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: BOOKING_COLOR,
                marginRight: 6,
              }}
            />
            {totalBookingPatients.toLocaleString()} patients booked at least once
          </Text>
        </div>

        {hasData ? (
          <ChartWidget
            series={series}
            xAxis={categories}
            type="bar"
            height={300}
            card={false}
            customOptions={{
              colors: [ENGAGEMENT_COLOR, BOOKING_COLOR],
              plotOptions: {
                bar: {
                  horizontal: false,
                  columnWidth: isMobile ? '55%' : '35%',
                  borderRadius: 4,
                },
              },
              xaxis: {
                categories,
                title: { text: 'Number of messages sent' },
              },
              yaxis: {
                title: { text: 'Number of patients' },
                allowDecimals: false,
              },
            }}
          />
        ) : (
          <Empty description="No data for the selected period" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </Spin>
    </Card>
  );
};

export default MessagesBeforeMilestones;
