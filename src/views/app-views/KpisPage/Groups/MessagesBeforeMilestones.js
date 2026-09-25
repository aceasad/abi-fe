import React, { useEffect, useState } from 'react';
import { Card, Spin, Empty, Tooltip } from 'antd';
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
  'Among patients we successfully messaged, how many first replied after the intro vs after reminder 1–4. “Other” is everyone else (no prior outbound, or 6+ messages before their first reply). Closely related to Engaged, but grouped by which message they answered.';

// Same palette as the Booking statuses bar chart in ClinicStats.
const SLICE_COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#6B7280'];
const SLICE_COLORS_EXTENDED = [...SLICE_COLORS, '#94A3B8'];

// Which outbound touch the patient replied after. 6+ collapsed into "Other".
const ENGAGEMENT_TEMPLATE_LABELS = {
  1: 'Intro',
  2: 'Reminder 1',
  3: 'Reminder 2',
  4: 'Reminder 3',
  5: 'Reminder 4',
};

const buildSlices = (rows) => {
  const byMessages = new Map();
  (rows || []).forEach((row) => {
    const n = Number(row.messages);
    const patients = Number(row.patients) || 0;
    if (!Number.isFinite(n) || patients <= 0) return;
    // 1–5 = Intro…Reminder 4; 0 or 6+ → Other so chart total matches delivered patients who replied.
    const key = (n >= 1 && n <= 5) ? n : 6;
    byMessages.set(key, (byMessages.get(key) || 0) + patients);
  });

  const keys = [...byMessages.keys()].sort((a, b) => a - b);
  return {
    labels: keys.map((k) => (k >= 6 ? 'Other' : ENGAGEMENT_TEMPLATE_LABELS[k])),
    series: keys.map((k) => byMessages.get(k)),
    colors: keys.map((k) => (k >= 6 ? SLICE_COLORS_EXTENDED[5] : SLICE_COLORS[k - 1])),
    total: keys.reduce((sum, k) => sum + byMessages.get(k), 0),
  };
};

const MessagesBeforeMilestones = ({ startTime, endTime, campaignId, isMobile = false }) => {
  const [loading, setLoading] = useState(false);
  const [engagementRows, setEngagementRows] = useState([]);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      setLoading(true);
      try {
        const { data } = await overviewService.getMessagesBeforeMilestones(startTime, endTime, campaignId);
        if (cancelled) return;
        setEngagementRows(data?.messages_before_first_engagement ?? []);
      } catch (err) {
        if (!cancelled) {
          setEngagementRows([]);
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

  const { labels, series, colors, total } = buildSlices(engagementRows);
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
    <Card
      title={(
        <span style={{ fontSize: isMobile ? 15 : 16, fontWeight: 600, color: HEADING_COLOR, display: 'inline-flex', alignItems: 'center' }}>
          Patient’s first engagement
          <Tooltip title={FIRST_ENGAGEMENT_TIP}>
            <InfoCircleOutlined
              style={{ color: MUTED_COLOR, fontSize: 12, marginLeft: 6, cursor: 'help' }}
            />
          </Tooltip>
        </span>
      )}
      style={{ borderRadius: CARD_RADIUS, border: CARD_BORDER, boxShadow: CARD_SHADOW }}
      styles={{
        header: { borderBottom: 'none', paddingInline: 16, minHeight: 'auto' },
        body: { paddingTop: 8 },
      }}
    >
      <Spin spinning={loading}>
        {hasData ? (
          <Chart type="donut" options={options} series={series} height={isMobile ? 280 : 320} />
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

export default MessagesBeforeMilestones;
