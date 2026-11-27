import { useEffect, useState } from 'react';
import { Card, Segmented, Typography, Grid } from 'antd';
import { Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { makeSelectIsOrganizationOwner } from 'redux/selectors/Auth';
import { APP_PAGES_PREFIX_PATH } from 'configs/AppConfig';
import billingService from 'services/BillingService';
import utils from 'utils';
import ClinicBills from './ClinicBills';
import CopaysPanel from './CopaysPanel';
import UsageDashboard from './UsageDashboard';

const { useBreakpoint } = Grid;

const TABS = [
  { label: 'Usage', value: 'usage' },
  { label: 'Bill', value: 'bill' },
  { label: 'Copays', value: 'copays' },
];

const BillingPage = () => {
  const screens = utils.getBreakPoint(useBreakpoint());
  const isMobile = !screens.includes('lg');
  const isOrganizationOwner = useSelector(makeSelectIsOrganizationOwner());
  const [tab, setTab] = useState('usage');
  const [sandbox, setSandbox] = useState(false);

  useEffect(() => {
    let cancelled = false;
    billingService.getStatus()
      .then((response) => {
        if (!cancelled) {
          setSandbox(Boolean(response.data?.sandbox));
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  if (!isOrganizationOwner) {
    return <Redirect to={`${APP_PAGES_PREFIX_PATH}/overview`} />;
  }

  const tabs = <Segmented value={tab} onChange={setTab} options={TABS} />;

  return (
    <>
      <div
        className="mb-4"
        style={{
          paddingTop: isMobile ? 0 : '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <Typography.Title level={3} style={{ marginTop: '8px', marginBottom: isMobile ? '16px' : 0 }}>
          Billing and usage
        </Typography.Title>
        {sandbox && (
          <span
            style={{
              background: '#f4e7c8',
              color: '#8d6b2f',
              borderRadius: 999,
              padding: '4px 12px',
              fontSize: 13,
              whiteSpace: 'nowrap',
            }}
          >
            Sandbox · no real money moves
          </span>
        )}
      </div>
      {tab === 'bill' ? (
        <ClinicBills tabs={tabs} />
      ) : (
        <Card>
          <div style={{ marginBottom: 16 }}>{tabs}</div>
          {tab === 'usage' ? <UsageDashboard /> : <CopaysPanel />}
        </Card>
      )}
    </>
  );
};

export default BillingPage;
