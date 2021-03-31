import { Button, Typography } from 'antd';
import { Header } from 'antd/lib/layout/layout';
import React from 'react';
import localeString from 'utils/localeString';

const { Title } = Typography;

const PatientHeader = ({ title, localization }) => {
  return (
    <Header className="ant-layout-page-header shadow-sm d-flex justify-content-sm-between">
      <Title className="mb-sm-0">{title}</Title>
      <div>
        <Button type="primary" danger className="mr-3">
          {localeString(localization, 'patient_details.cancel')}
        </Button>
        <Button type="primary">
          {localeString(localization, 'patient_details.save')}
        </Button>
      </div>
    </Header>
  );
};

export default PatientHeader;
