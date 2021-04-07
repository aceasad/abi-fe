import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card,
  Table,
  Input,
  Button,
  Menu,
  message,
  PageHeader,
  Space,
} from 'antd';
import { EditFilled, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
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

const PatientList = ({ showCreate, updatePatient, showPreview }) => {
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
        onClick={({ domEvent }) => {
          domEvent.stopPropagation();
          updatePatient(row.id);
        }}
      >
        <Flex alignItems="center">
          <EditFilled />
          <span className="ml-2">{formatMessage(messages.editPatient)}</span>
        </Flex>
      </Menu.Item>
      <Menu.Item
        onClick={({ domEvent }) => {
          domEvent.stopPropagation();
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

  const handleChange = (_, __, sortInfo, e) => {
    if (e.action === 'sort') dispatch(setOrder(sortInfo));
  };

  const afterDelete = () => {
    setPatientForDelete(null);
    message.success(formatMessage(messages.patientDeleted));
  };

  const handleDelete = () => {
    dispatch(deletePatient({ data: patientForDelete.id, afterDelete }));
  };

  return (
    <>
      <PageHeader
        className="p-0 mb-4"
        title={formatMessage(messages.patientsTitle)}
        extra={[
          <Space key="0">
            <form onSubmit={handleSearch}>
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
          </Space>,
        ]}
      />
      <Card>
        <div className="table-responsive">
          <Table
            onRow={(record) => ({
              onClick: () => showPreview(record.id),
            })}
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
    </>
  );
};

export default PatientList;
