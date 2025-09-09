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
  Space,
  Typography,
  Tooltip,
  Grid,
} from 'antd';
import { PageHeader } from '@ant-design/pro-components';
import {
  EditFilled,
  DeleteOutlined,
  SearchOutlined,
  FormOutlined,
} from '@ant-design/icons';
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
import { DEFAULT_PAGINATION_LIMIT, SET_DEFAULT_PAGINATION_LIMIT } from 'constants/ApiConstant';
import { makeSelectPatients } from 'redux/selectors/Patient';
import Modal from 'components/shared-components/Modal';
import dayjs from 'utils/dayjs';
import utils from 'utils';
import UploaderPatient from './UploaderPatient';
import patientService from 'services/PatientService';

const { useBreakpoint } = Grid;

const PatientList = ({ showCreate, updatePatient, showPreview }) => {
  const [search, setSearch] = useState('');
  const [patientForDelete, setPatientForDelete] = useState(null);

  const dispatch = useDispatch();
  const { formatMessage } = useIntl();
  const screens = utils.getBreakPoint(useBreakpoint());
  const isMobile = !screens.includes('lg');
  const [isUploadCompleted, setIsUploadCompleted] = useState(false);
  const { count, patients, loading, page } = useSelector(makeSelectPatients());

  useEffect(() => {
    dispatch(getPatients());
  }, [dispatch, isUploadCompleted]);

  // Callback to set upload completion status
  const handleUploadCompletion = () => {
    setIsUploadCompleted(prev => !prev);  // Toggle state to rerun useEffect
  };

  // Callback to set upload completion status
  const downloadNotOnWhatsapp = async () => {
    try {
      const res = await patientService.postDownloadPatientsNotOnWhatsapp();

      // Create blob from the response data
      const blob = new Blob([res.data], { type: 'text/plain' });

      // Create a temporary URL for the blob
      const url = window.URL.createObjectURL(blob);

      // Create temporary link element
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'patients_not_on_whatsapp.txt');

      // Append link to body, click it, and remove it
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the URL
      window.URL.revokeObjectURL(url);
    } catch (error) {
      message.error(formatMessage(messages.downloadError));
    }
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
      render: (lastAppointment) => (
        <span>
          {lastAppointment ? dayjs(lastAppointment).format('D/MM/yyyy') : '-'}
        </span>
      ),
      sorter: true,
    },
    // {
    //   title: '',
    //   dataIndex: 'actions',
    //   render: (_, elm) => (
    //     <div className="text-right">
    //       <EllipsisDropdown menu={dropdownMenu(elm)} />
    //     </div>
    //   ),
    // },
    {
      title: '',
      dataIndex: 'actions',
      render: (_, row) => (
        <div className="text-right">
          <Space>
            <Tooltip title={formatMessage(messages.editPatient)}>
              <Button
                icon={<FormOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  updatePatient(row.id);
                }}
                size="small"
              />
            </Tooltip>
            <Tooltip title={formatMessage(messages.patientDelete)}>
              <Button
                icon={<DeleteOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  setPatientForDelete(row);
                }}
                size="small"
              />
            </Tooltip>
          </Space>
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
  const handlePaginationSizeChange = (current, size) => {
    SET_DEFAULT_PAGINATION_LIMIT(size)
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
        title={
          isMobile ? (
            <Typography.Title level={2} className="mb-0">
              {formatMessage(messages.patientsTitle)}
            </Typography.Title>
          ) : (
            ''
          )
        }
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
            <UploaderPatient onUploadComplete={handleUploadCompletion} />
            <Button onClick={downloadNotOnWhatsapp} type="primary">
              {formatMessage(messages.notonwhatsappPatient)}
            </Button>
          </Space>,
        ]}
      />
      <Card>
        <div className="table-responsive ant-table-row-pointer">
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
              onShowSizeChange: (current, size) => handlePaginationSizeChange(current, size), // Custom handler for page size change
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
        open={patientForDelete}
        handlePrimaryAction={handleDelete}
        handleSecondaryAction={() => setPatientForDelete(null)}
      />
    </>
  );
};

export default PatientList;
