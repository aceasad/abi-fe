import {
  Col,
  Row,
  DatePicker,
  Typography,
  Button,
  Select,
  Grid,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import messages from './messages';
import ClinicStats from './Groups/ClinicStats';
import { getOverviewClinicStatsData } from 'redux/actions/Overview';
import { getCampaigns } from 'redux/actions/Patient';
import { makeSelectCampaigns } from 'redux/selectors/Patient';
import { makeSelectClinic } from 'redux/selectors/Clinic';
import { DownloadOutlined } from '@ant-design/icons';
import overviewService from 'services/OverviewService';
import {
  SHOW_KPIS,
} from 'configs/AppConfig';
import dayjs from 'utils/dayjs';
import utils from 'utils';
import { getDateFormatByCountry } from 'utils/helpers';
const { RangePicker } = DatePicker;
const { Option } = Select;
const { useBreakpoint } = Grid;

const downloadKpiData = async (start_time, end_time, campaign_id) => {
  try {
    const response = await overviewService.downloadClinicStatsData(start_time, end_time, campaign_id);
    return response;
  } catch (error) {
    throw error;
  }
};

const KpisPage = () => {
  const dispatch = useDispatch();
  const campaignsSelector = useSelector(makeSelectCampaigns());
  const clinic = useSelector(makeSelectClinic());
  const { campaigns, loading: campaignsLoading } = campaignsSelector;
  const screens = utils.getBreakPoint(useBreakpoint());
  const isMobile = !screens.includes('lg');
  const datePickerFormat = getDateFormatByCountry(clinic?.country);

  const startDate = dayjs('2024-05-01');

  const [dateRange, setDateRange] = useState([
    startDate.clone().startOf('day'),
    dayjs().endOf('day')
  ]);

  const [previousPeriod, setPreviousPeriod] = useState([
    startDate.clone().subtract(30, 'days').startOf('day'),
    startDate.clone().subtract(1, 'days').endOf('day')
  ]);

  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const normalizedDateRange = Array.isArray(dateRange) ? dateRange : [];

  // Fetch campaigns on component mount
  useEffect(() => {
    dispatch(getCampaigns());
  }, [dispatch]);

  const handleDateRangeChange = (dates) => {
    if (dates) {
      setDateRange(dates);
      const startDate = dates[0];
      const previousStart = dayjs(startDate).subtract(30, 'days');
      const previousEnd = dayjs(startDate).subtract(1, 'days');
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
        const startDate = dayjs(selectedCampaignData.created_at);

        // Set end date to next campaign's created_at or current date if it's the last campaign
        let endDate;
        if (nextCampaign) {
          endDate = dayjs(nextCampaign.created_at);
        } else {
          endDate = dayjs().endOf('day');
        }

        setDateRange([startDate, endDate]);

        // Update previous period
        const previousStart = dayjs(startDate).subtract(30, 'days');
        const previousEnd = dayjs(startDate).subtract(1, 'days');
        setPreviousPeriod([previousStart, previousEnd]);
      }
    }
  };

  const handleDownload = async () => {
    try {
      const start_time = normalizedDateRange[0] ? normalizedDateRange[0].format('YYYY-MM-DD') : undefined;
      const end_time = normalizedDateRange[1] ? normalizedDateRange[1].format('YYYY-MM-DD') : undefined;

      const filename = normalizedDateRange[0] && normalizedDateRange[1]
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
      const start_time = normalizedDateRange[0] ? normalizedDateRange[0].format('YYYY-MM-DD') : null;
      const end_time = normalizedDateRange[1] ? normalizedDateRange[1].format('YYYY-MM-DD') : null;

      dispatch(getOverviewClinicStatsData({ start_time, end_time, campaign_id: selectedCampaign }));
    }
  }, [dispatch, normalizedDateRange, selectedCampaign]);

  return (
    <div style={{ maxWidth: '100%', overflowX: 'hidden' }}>
      <div className="mb-4" style={{ paddingTop: isMobile ? 0 : '24px' }}>
        <Typography.Title level={3} style={{ marginTop: "8px" }}>
          Key Performance Indicators
        </Typography.Title>
      </div>

      {SHOW_KPIS && (
        <>
          {isMobile ? (
            // Mobile/Tablet Layout
            <div style={{ marginBottom: '16px' }}>
              <Row gutter={[12, 12]}>
                <Col xs={24} sm={12}>
                  <RangePicker
                    onChange={handleDateRangeChange}
                    value={dateRange}
                    format={datePickerFormat}
                    disabledDate={(current) => current && current > dayjs().endOf('day')}
                    style={{ width: '100%' }}
                  />
                </Col>
                <Col xs={24} sm={12}>
                  <Select
                    placeholder="Select Campaign"
                    style={{ width: '100%' }}
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
                <Col xs={24} sm={12}>
                  <Button
                    type="primary"
                    icon={<DownloadOutlined />}
                    onClick={handleDownload}
                  >
                    Export Data
                  </Button>
                </Col>
              </Row>
            </div>
          ) : (
            // Desktop/Tablet Layout
            <Row justify="space-between" align="middle" style={{ marginBottom: '8px' }}>
              <Col>
                <Row gutter={16} align="middle">
                  <Col>
                    <RangePicker
                      onChange={handleDateRangeChange}
                      value={dateRange}
                      format={datePickerFormat}
                      disabledDate={(current) => current && current > dayjs().endOf('day')}
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
          )}

          <Row gutter={isMobile ? 12 : 12}>
            <Col span={24}>
              <ClinicStats
                title={messages.bookingTitle}
                previousPeriod={previousPeriod}
                isMobile={isMobile}
                country={clinic?.country}
              />
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default KpisPage;
