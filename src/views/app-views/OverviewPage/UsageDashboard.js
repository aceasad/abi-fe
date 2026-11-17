import { useEffect, useState } from 'react';
import { Alert, Card, Col, Row, Spin, Typography } from 'antd';
import ApexChart from 'react-apexcharts';
import billingService from 'services/BillingService';
import dayjs from 'utils/dayjs';
import { COLOR_6 } from 'constants/ChartConstant';
import { billingErrorMessage } from '../SettingsPage/billingStatus';

const { Text } = Typography;

const axisLabel = (isoDate, grain) => {
  const date = dayjs(isoDate);
  if (grain === 'month') {
    return date.format('MMM YYYY');
  }
  return date.format('MMM D');
};

const chartOptions = (categories) => ({
  chart: {
    toolbar: { show: false },
    zoom: { enabled: false },
    fontFamily: 'inherit',
  },
  colors: [COLOR_6],
  stroke: { curve: 'smooth', width: 2 },
  fill: {
    type: 'gradient',
    gradient: { opacityFrom: 0.35, opacityTo: 0.02 },
  },
  dataLabels: { enabled: false },
  grid: { strokeDashArray: 4, borderColor: '#edf2f9' },
  xaxis: {
    categories,
    labels: { hideOverlappingLabels: true, style: { colors: '#455560' } },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: {
    min: 0,
    stepSize: 1,
    labels: {
      style: { colors: '#455560' },
      formatter: (value) => `${Math.round(value)}`,
    },
  },
  tooltip: { y: { formatter: (value) => `${value}` } },
});

const UsageDashboard = ({ start, end, grain }) => {
  const [metrics, setMetrics] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!start || !end) {
      return undefined;
    }
    let cancelled = false;
    setLoading(true);
    setError('');
    billingService.getUsage(start, end, grain)
      .then((response) => {
        if (!cancelled) {
          setMetrics(response.data?.metrics || []);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(billingErrorMessage(err));
          setMetrics([]);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [start, end, grain]);

  if (loading) {
    return <Spin />;
  }

  if (error) {
    return <Alert type="error" showIcon message={error} />;
  }

  return (
    <Row gutter={[16, 16]}>
      {metrics.map((metric) => (
        <Col key={metric.key} xs={24} lg={12} xl={8}>
          <Card
            size="small"
            title={metric.name}
            extra={<Text type="secondary">{metric.total}</Text>}
          >
            <ApexChart
              type="area"
              height={180}
              series={[{ name: metric.name, data: (metric.points || []).map((point) => point.quantity) }]}
              options={chartOptions((metric.points || []).map((point) => axisLabel(point.date, grain)))}
            />
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default UsageDashboard;
