import React, { useEffect, useState } from 'react';
import { Card, Typography, Spin, Empty, Row, Col } from 'antd';
import Chart from 'react-apexcharts';
import overviewService from 'services/OverviewService';
import { apexPieChartDefaultOption } from 'constants/ChartConstant';

const { Text } = Typography;

const HEADING_COLOR = '#1a3353';
const CARD_RADIUS = 16;
const CARD_BORDER = '1px solid #eef0f4';
const CARD_SHADOW = '0 1px 2px rgba(26, 51, 83, 0.04), 0 8px 24px -16px rgba(26, 51, 83, 0.18)';

// Shades of blue for "before first reply" slices, shades of green for
// "before first booking" slices - keeps the two-color-family distinction
// requested for this chart, while still giving each message-count slice its
// own shade within that family.
const BLUE_SHADES = ['#0B3D91', '#1450B8', '#1890FF', '#4DA6FF', '#82C4FF', '#B3DBFF', '#D6ECFF', '#EAF5FF'];
const GREEN_SHADES = ['#135200', '#237804', '#389E0D', '#52C41A', '#73D13D', '#95DE64', '#B7EB8F', '#D9F7BE'];

// Engagement chart: which outbound template the patient replied after.
// 1 = Invitation, 2–5 = 1st–4th intro, 6+ = raw message count.
const ENGAGEMENT_TEMPLATE_LABELS = {
  1: 'Invitation',
  2: '1st intro',
  3: '2nd intro',
  4: '3rd intro',
  5: '4th intro',
};

const engagementLabel = (count) =>
  ENGAGEMENT_TEMPLATE_LABELS[count] ?? `${count} messages`;

const bookingLabel = (count) => `${count} message${count === 1 ? '' : 's'}`;

const buildSlices = (rows, palette, labelFn) => {
  const sorted = [...rows].sort((a, b) => a.messages - b.messages);
  return {
    labels: sorted.map((row) => labelFn(row.messages)),
    series: sorted.map((row) => row.patients),
    colors: sorted.map((_, index) => palette[index % palette.length]),
    total: sorted.reduce((sum, row) => sum + row.patients, 0),
  };
};

const MilestonePie = ({ title, rows, palette, isMobile, labelFn }) => {
  const { labels, series, colors, total } = buildSlices(rows, palette, labelFn);
  const hasData = series.some((value) => value > 0);

  const options = {
    ...apexPieChartDefaultOption,
    labels,
    colors,
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
              label: 'Patients',
              fontSize: '13px',
              color: HEADING_COLOR,
              formatter: () => total.toLocaleString(),
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
        formatter: (val) => `${val} patient${val === 1 ? '' : 's'}`,
      },
    },
  };

  return (
    <div>
      <Text
        style={{
          display: 'block',
          textAlign: 'center',
          fontSize: isMobile ? 13 : 14,
          color: HEADING_COLOR,
          fontWeight: 600,
          marginBottom: 8,
        }}
      >
        {title}
      </Text>
      {hasData ? (
        <Chart type="donut" options={options} series={series} height={isMobile ? 260 : 300} />
      ) : (
        <Empty
          description="No data for the selected period"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          style={{ margin: isMobile ? '30px 0' : '48px 0' }}
        />
      )}
    </div>
  );
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
        <Row gutter={[isMobile ? 16 : 24, 16]}>
          <Col xs={24} md={12}>
            <MilestonePie
              title="Before first reply"
              rows={engagementRows}
              palette={BLUE_SHADES}
              isMobile={isMobile}
              labelFn={engagementLabel}
            />
          </Col>
          <Col xs={24} md={12}>
            <MilestonePie
              title="Before first booking"
              rows={bookingRows}
              palette={GREEN_SHADES}
              isMobile={isMobile}
              labelFn={bookingLabel}
            />
          </Col>
        </Row>
      </Spin>
    </Card>
  );
};

export default MessagesBeforeMilestones;
