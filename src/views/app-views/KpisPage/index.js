import {
  Col,
  Row,
  DatePicker,
  Typography,
  Tabs,
  Card,
  Layout,
  Button,
  Select,
} from 'antd';
import { PageHeader } from '@ant-design/pro-components';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import messages from './messages';
import GroupCollapse from './Groups/GroupCollapse';
import Booking from './Groups/Booking';
import Appointments from './Groups/Appointments';
import AbiData from './Groups/AbiData';
import Uptake from './Groups/Uptake';
import ClinicStats from './Groups/ClinicStats';
import { getOverviewClinicStatsData } from 'redux/actions/Overview';
import { getCampaigns } from 'redux/actions/Patient';
import { makeSelectCampaigns } from 'redux/selectors/Patient';
import { DownloadOutlined } from '@ant-design/icons';
import overviewService from 'services/OverviewService';
import {
  SHOW_KPIS,
} from 'configs/AppConfig';
import moment from 'moment';
const { RangePicker } = DatePicker;
const { Option } = Select;

const downloadKpiData = async (start_time, end_time, campaign_id) => {
  try {
    const response = await overviewService.downloadClinicStatsData(start_time, end_time, campaign_id);
    return response;
  } catch (error) {
    throw error;
  }
};

const KpisPage = () => {
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const campaignsSelector = useSelector(makeSelectCampaigns());
  const { campaigns, loading: campaignsLoading } = campaignsSelector;

  const startDate = moment('2024-05-01');

  const [dateRange, setDateRange] = useState([
    startDate.clone().startOf('day'),
    moment().endOf('day')
  ]);

  const [previousPeriod, setPreviousPeriod] = useState([
    startDate.clone().subtract(30, 'days').startOf('day'),
    startDate.clone().subtract(1, 'days').endOf('day')
  ]);

  const [selectedCampaign, setSelectedCampaign] = useState(null);

  // Fetch campaigns on component mount
  useEffect(() => {
    dispatch(getCampaigns());
  }, [dispatch]);

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

  const handleCampaignChange = (value) => {
    setSelectedCampaign(value);

    if (value && campaigns) {
      const selectedCampaignData = campaigns.find(campaign => campaign.id === value);
      if (selectedCampaignData) {
        const campaignIndex = campaigns.findIndex(campaign => campaign.id === value);
        const nextCampaign = campaigns[campaignIndex + 1];

        // Set start date to selected campaign's created_at
        const startDate = moment(selectedCampaignData.created_at);

        // Set end date to next campaign's created_at or current date if it's the last campaign
        let endDate;
        if (nextCampaign) {
          endDate = moment(nextCampaign.created_at);
        } else {
          endDate = moment().endOf('day');
        }

        setDateRange([startDate, endDate]);

        // Update previous period
        const previousStart = moment(startDate).subtract(30, 'days');
        const previousEnd = moment(startDate).subtract(1, 'days');
        setPreviousPeriod([previousStart, previousEnd]);
      }
    }
  };

  const handleDownload = async () => {
    try {
      const start_time = dateRange[0] ? dateRange[0].format('YYYY-MM-DD') : undefined;
      const end_time = dateRange[1] ? dateRange[1].format('YYYY-MM-DD') : undefined;

      const filename = dateRange[0] && dateRange[1]
        ? `kpi-data-${start_time}-to-${end_time}${selectedCampaign ? `-campaign-${selectedCampaign}` : ''}.zip`
        : 'kpi-data-all-time.zip';

      const response = await downloadKpiData(start_time, end_time, selectedCampaign);
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

      dispatch(getOverviewClinicStatsData({ start_time, end_time, campaign_id: selectedCampaign }));
    }
  }, [dispatch, dateRange, selectedCampaign]);

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
                <Row gutter={16} align="middle">
                  <Col>
                    <RangePicker
                      onChange={handleDateRangeChange}
                      value={dateRange}
                      format="DD/MM/YYYY"
                      disabledDate={(current) => current && current > moment().endOf('day')}
                    />
                  </Col>
                  <Col>
                    <Select
                      placeholder="Select Campaign"
                      style={{ width: 200 }}
                      value={selectedCampaign}
                      onChange={handleCampaignChange}
                      loading={campaignsLoading}
                      allowClear
                    >
                      {campaigns && campaigns.map((campaign) => (
                        <Option key={campaign.id} value={campaign.id}>
                          {campaign.campaign_name}
                        </Option>
                      ))}
                    </Select>
                  </Col>
                </Row>
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
