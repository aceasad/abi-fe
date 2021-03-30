import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Table, Input, Button, Menu, Typography } from 'antd';
import { EyeOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import Layout, { Content, Header } from 'antd/lib/layout/layout';

import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import Flex from 'components/shared-components/Flex';
import {
  getPatients,
  setPatientPage,
  setOrder,
  setPatientSearch,
} from 'redux/actions/Patient';
import messages from './messages';
import { DEFAULT_PAGINATION_LIMIT } from 'constants/ApiConstant';
import { makeSelectPatients } from 'redux/selectors/Patient';

const ProductList = () => {
  const [search, setSearch] = useState('');

  const history = useHistory();
  const dispatch = useDispatch();
  const { formatMessage } = useIntl();

  const { count, patients, loading } = useSelector(makeSelectPatients());

  useEffect(() => {
    dispatch(getPatients());
  }, []);

  const dropdownMenu = (row) => (
    <Menu>
      <Menu.Item
        onClick={() => {
          /* TO DO */
        }}
      >
        <Flex alignItems="center">
          <EyeOutlined />
          <span className="ml-2">{formatMessage(messages.patientDetails)}</span>
        </Flex>
      </Menu.Item>
      <Menu.Item
        onClick={() => {
          /* TO DO */
        }}
      >
        <Flex alignItems="center">
          <DeleteOutlined />
          <span className="ml-2">{formatMessage(messages.patientDelete)}</span>
        </Flex>
      </Menu.Item>
    </Menu>
  );

  const createPatient = () => {
    // TO DO
    history.push('/');
  };

  const tableColumns = [
    {
      title: formatMessage(messages.firstName),
      dataIndex: 'first_name',
      render: (firstName) => <span>{firstName}</span>,
      sorter: true,
    },
    {
      title: formatMessage(messages.lastName),
      dataIndex: 'last_name',
      render: (lastName) => <span>{lastName}</span>,
      sorter: true,
    },
    {
      title: formatMessage(messages.phoneNumber),
      dataIndex: 'phone_number',
      render: (phoneNumber) => <span>{phoneNumber}</span>,
      sorter: true,
    },
    {
      title: formatMessage(messages.lastAppointment),
      dataIndex: 'last_appointment',
      render: (lastAppointment) => <span>{lastAppointment || '-'}</span>,
    },
    {
      title: '',
      dataIndex: 'actions',
      render: (_, elm) => (
        <div className="text-right">
          <EllipsisDropdown menu={dropdownMenu(elm)} />
        </div>
      ),
    },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setPatientSearch(search));
  };

  const handlePaginationChange = (page) => {
    dispatch(setPatientPage(page));
  };

  const handleChange = (_, __, sortInfo) => {
    dispatch(setOrder(sortInfo));
  };

  return (
    <Layout>
      <Header className="ant-layout-page-header shadow-sm d-flex justify-content-sm-between">
        <Typography.Title className="mb-sm-0">
          {formatMessage(messages.patientsTitle)}
        </Typography.Title>
        <div className="d-flex align-items-center">
          <form className="mr-4" onSubmit={handleSearch}>
            <Input
              placeholder={formatMessage(messages.search)}
              prefix={<SearchOutlined />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>
          <Button onClick={createPatient} type="primary">
            {formatMessage(messages.newPatient)}
          </Button>
        </div>
      </Header>
      <Content>
        <Card className="m-4">
          <div className="table-responsive">
            <Table
              columns={tableColumns}
              onChange={handleChange}
              dataSource={patients}
              pagination={{
                defaultPageSize: DEFAULT_PAGINATION_LIMIT,
                total: count,
                onChange: handlePaginationChange,
              }}
              loading={loading}
            />
          </div>
        </Card>
      </Content>
    </Layout>
  );
};

export default ProductList;
