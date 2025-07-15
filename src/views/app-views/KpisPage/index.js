import {
  Col,
  PageHeader,
  Row,
  DatePicker,
  Typography,
  Tabs,
  Card,
  Layout,
  Button,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import messages from './messages';
import GroupCollapse from './Groups/GroupCollapse';
import Booking from './Groups/Booking';
import Appointments from './Groups/Appointments';
import AbiData from './Groups/AbiData';
import Uptake from './Groups/Uptake';
import ClinicStats from './Groups/ClinicStats';
import { useDispatch } from 'react-redux';
import { getOverviewClinicStatsData } from 'redux/actions/Overview';
import { DownloadOutlined } from '@ant-design/icons';
import overviewService from 'services/OverviewService';
import {
  SHOW_KPIS,
} from 'configs/AppConfig';
import moment from 'moment';
const { RangePicker } = DatePicker;

const downloadKpiData = async (start_time, end_time) => {
  try {
    const response = await overviewService.downloadClinicStatsData(start_time, end_time);
    return response;
  } catch (error) {
    throw error;
  }
};

const KpisPage = () => {
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();

  const [dateRange, setDateRange] = useState([
    moment().subtract(1, 'month').startOf('day'),
    moment().endOf('day')
  ]);

  const [previousPeriod, setPreviousPeriod] = useState([
    moment().subtract(2, 'month').startOf('day'),
    moment().subtract(1, 'month').startOf('day')
  ]);


  const handleDateRangeChange = (dates) => {
    if (dates) {
      setDateRange(dates);
      const startDate = dates[0];
      const previousStart = moment(startDate).subtract(30, 'days');
      const previousEnd = moment(startDate).subtract(1, 'days');
      setPreviousPeriod([previousStart, previousEnd]);
    } else {
      setDateRange(null);
      setPreviousPeriod(null);
    }
  };

  const handleDownload = async () => {
    try {
      const start_time = dateRange[0] ? dateRange[0].format('YYYY-MM-DD') : undefined;
      const end_time = dateRange[1] ? dateRange[1].format('YYYY-MM-DD') : undefined;

      const filename = dateRange[0] && dateRange[1]
        ? `kpi-data-${start_time}-to-${end_time}.zip`
        : 'kpi-data-all-time.zip';

      const response = await downloadKpiData(start_time, end_time);
      const blob = new Blob([response.data], { type: 'application/zip' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  useEffect(() => {
    if (SHOW_KPIS) {
      const start_time = dateRange[0] ? dateRange[0].format('YYYY-MM-DD') : null;
      const end_time = dateRange[1] ? dateRange[1].format('YYYY-MM-DD') : null;

      dispatch(getOverviewClinicStatsData({ start_time, end_time }));
    }
  }, [dispatch, dateRange]);

  return (
    <>
      <PageHeader
        className="p-0 mb-4"
        title={
          <Typography.Title level={2} className="mb-0">
            {'Key Performance Indicators'}
          </Typography.Title>
        }
      />
      <Layout>
        {SHOW_KPIS && (
          <>
            <Row justify="space-between" align="middle">
              <Col>
                <RangePicker
                  onChange={handleDateRangeChange}
                  value={dateRange}
                  disabledDate={(current) => current && current > moment().endOf('day')}
                />
              </Col>
              <Col>
                <Button
                  type="primary"
                  icon={<DownloadOutlined />}
                  onClick={handleDownload}
                >
                  Export Data
                </Button>
              </Col>
            </Row>
            <Row gutter={48}>
              <Col span={24} className="mt-4">
                <ClinicStats title={formatMessage(messages.bookingTitle)} previousPeriod={previousPeriod} />
              </Col>
            </Row>
          </>
        )}
      </Layout>
    </>
  );
};

export default KpisPage;
