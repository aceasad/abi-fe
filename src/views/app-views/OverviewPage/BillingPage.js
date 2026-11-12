import { useState } from 'react';
import { Card, Layout, Tabs, Typography, Grid } from 'antd';
import { Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { makeSelectIsOrganizationOwner } from 'redux/selectors/Auth';
import { APP_PAGES_PREFIX_PATH } from 'configs/AppConfig';
import utils from 'utils';
import BillingPeriodFilter, { currentMonthRange } from './BillingPeriodFilter';
import ClinicBills from './ClinicBills';
import UsageDashboard from './UsageDashboard';

const { useBreakpoint } = Grid;

const BillingPage = () => {
  const screens = utils.getBreakPoint(useBreakpoint());
  const isMobile = !screens.includes('lg');
  const isOrganizationOwner = useSelector(makeSelectIsOrganizationOwner());
  const [grain, setGrain] = useState('day');
  const [range, setRange] = useState(currentMonthRange);
  const start = range?.[0] ? range[0].format('YYYY-MM-DD') : '';
  const end = range?.[1] ? range[1].format('YYYY-MM-DD') : '';

  if (!isOrganizationOwner) {
    return <Redirect to={`${APP_PAGES_PREFIX_PATH}/overview`} />;
  }

  return (
    <>
      <div className="mb-4" style={{ paddingTop: isMobile ? 0 : '24px' }}>
        <Typography.Title level={3} style={{ marginTop: '8px', marginBottom: isMobile ? '16px' : 0 }}>
          Billing and usage
        </Typography.Title>
      </div>
      <Layout>
        <Card>
          <BillingPeriodFilter
            grain={grain}
            onGrainChange={setGrain}
            range={range}
            onRangeChange={setRange}
          />
          <Tabs
            defaultActiveKey="usage"
            items={[
              {
                key: 'usage',
                label: 'Usage',
                children: <UsageDashboard start={start} end={end} grain={grain} />,
              },
              {
                key: 'billing',
                label: 'Billing',
                children: <ClinicBills start={start} end={end} />,
              },
            ]}
          />
        </Card>
      </Layout>
    </>
  );
};

export default BillingPage;
