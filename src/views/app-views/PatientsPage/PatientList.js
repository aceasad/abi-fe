import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Table, Input, Button, Menu, Typography, message } from 'antd';
import {
  EditFilled,
  EyeOutlined,
  DeleteOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import Layout, { Content, Header } from 'antd/lib/layout/layout';

import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import Flex from 'components/shared-components/Flex';
import {
  getPatients,
  setPatientPage,
  setOrder,
  setPatientSearch,
  deletePatient,
} from 'redux/actions/Patient';
import messages from './messages';
import { DEFAULT_PAGINATION_LIMIT } from 'constants/ApiConstant';
import { makeSelectPatients } from 'redux/selectors/Patient';
import Modal from 'components/shared-components/Modal';

const PatientList = ({ showCreate, updatePatient }) => {
  const [search, setSearch] = useState('');
  const [patientForDelete, setPatientForDelete] = useState(null);

  const dispatch = useDispatch();
  const { formatMessage } = useIntl();

  const { count, patients, loading, page } = useSelector(makeSelectPatients());

  useEffect(() => {
    dispatch(getPatients());
  }, [dispatch]);

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
          updatePatient(row.id);
        }}
      >
        <Flex alignItems="center">
          <EditFilled />
          <span className="ml-2">{formatMessage(messages.editPatient)}</span>
        </Flex>
      </Menu.Item>
      <Menu.Item
        onClick={() => {
          setPatientForDelete(row);
        }}
      >
        <Flex alignItems="center">
          <DeleteOutlined />
          <span className="ml-2">{formatMessage(messages.patientDelete)}</span>
        </Flex>
      </Menu.Item>
    </Menu>
  );

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

  const afterDelete = () => {
    setPatientForDelete(null);
    message.success(formatMessage(messages.patientDeleted));
  };

  const handleDelete = () => {
    dispatch(deletePatient({ data: patientForDelete.id, afterDelete }));
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
          <Button onClick={showCreate} type="primary">
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
              dataSource={patients.map((pat) => ({ ...pat, key: pat.id }))}
              pagination={{
                defaultPageSize: DEFAULT_PAGINATION_LIMIT,
                total: count,
                onChange: handlePaginationChange,
                hideOnSinglePage: true,
                current: page,
              }}
              loading={loading}
            />
          </div>
        </Card>
      </Content>
      <Modal
        title={formatMessage(messages.deleteTitle)}
        description={formatMessage(messages.deleteDescription, {
          label: patientForDelete
            ? patientForDelete.first_name + ' ' + patientForDelete.last_name
            : '',
        })}
        primaryAction={formatMessage(messages.delete)}
        secondaryAction={formatMessage(messages.cancel)}
        visible={patientForDelete}
        handlePrimaryAction={handleDelete}
        handleSecondaryAction={() => setPatientForDelete(null)}
      />
    </Layout>
  );
};

export default PatientList;
