import { useEffect, useState } from 'react';
import { Card, Segmented, Typography, Grid } from 'antd';
import { Redirect, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { makeSelectIsOrganizationOwner } from 'redux/selectors/Auth';
import { makeSelectClinic } from 'redux/selectors/Clinic';
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
  const clinic = useSelector(makeSelectClinic());
  const userBillingEnabled = useSelector((state) => state.auth.user?.billing_enabled);
  const billingEnabled = Boolean(clinic?.billing_enabled ?? userBillingEnabled);
  const location = useLocation();
  const requestedTab = new URLSearchParams(location.search).get('tab');
  const [tab, setTab] = useState(TABS.some((item) => item.value === requestedTab) ? requestedTab : 'usage');
  const [sandbox, setSandbox] = useState(false);

  useEffect(() => {
    if (!billingEnabled) return undefined;
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
  }, [billingEnabled]);

  if (!isOrganizationOwner || !billingEnabled) {
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
