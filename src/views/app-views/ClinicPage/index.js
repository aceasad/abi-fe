import { Button, Card, Typography } from 'antd';
import { PageHeader } from '@ant-design/pro-components';
import ClinicForm from 'containers/Forms/ClinicForm/ClinicForm';
import React from 'react';
import { useDispatch } from 'react-redux';
import { signOut } from 'redux/actions/Auth';

const ClinicPage = () => {
  const dispatch = useDispatch();

  return (
    <>
      <PageHeader
        title={
          <Typography.Title level={3} className="mb-0">
            Clinic Settings
          </Typography.Title>
        }
        extra={[
          <Button
            key="0"
            type="primary"
            onClick={() => {
              dispatch(signOut());
            }}
          >
            {"Logout"}
          </Button>,
        ]}
      />
      <Card className="m-4">
        <ClinicForm />
      </Card>
    </>
  );
};

export default ClinicPage;
