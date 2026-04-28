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
  Row,
  Col,
  Avatar,
} from 'antd';
import { PageHeader } from '@ant-design/pro-components';
import {
  EditFilled,
  DeleteOutlined,
  SearchOutlined,
  FormOutlined,
  PlusOutlined,
  UploadOutlined,
  DownloadOutlined,
  UserOutlined,
  PhoneOutlined,
  CalendarOutlined,
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
import { makeSelectClinic } from 'redux/selectors/Clinic';
import Modal from 'components/shared-components/Modal';
import utils from 'utils';
import UploaderPatient from './UploaderPatient';
import patientService from 'services/PatientService';
import { formatDateByCountry } from 'utils/helpers';

const { useBreakpoint } = Grid;

const PatientList = ({ showCreate, updatePatient, showPreview }) => {
  const [search, setSearch] = useState('');
  const [patientForDelete, setPatientForDelete] = useState(null);

  const dispatch = useDispatch();
  const { formatMessage } = useIntl();
  const screens = utils.getBreakPoint(useBreakpoint());
  const isMobile = !screens.includes('lg');
  const { PASProvider } = useSelector((state) => state.auth.user || {});
  const isMedbridge = PASProvider?.toLowerCase() === 'medbridge';
  const [isUploadCompleted, setIsUploadCompleted] = useState(false);
  const { count, patients, loading, page } = useSelector(makeSelectPatients());
  const clinic = useSelector(makeSelectClinic());

  const getHomeLocationDisplay = (homeLocation) => {
    if (!homeLocation) return '-';

    if (typeof homeLocation === 'object') {
      if (homeLocation.location_name && homeLocation.location_id) {
        return `${homeLocation.location_name} (${homeLocation.location_id})`;
      }
      return homeLocation.location_name || homeLocation.location_id || '-';
    }

    return homeLocation;
  };

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
      responsive: ['md'], // Hide on mobile
    },
    ...(isMedbridge
      ? [
          {
            title: formatMessage(messages.homeLocation),
            dataIndex: 'home_location',
            render: (homeLocation) => <span>{getHomeLocationDisplay(homeLocation)}</span>,
            responsive: ['lg'],
          },
        ]
      : []),
    {
      title: formatMessage(messages.lastAppointment),
      dataIndex: 'last_appointment',
      render: (lastAppointment) => (
        <span>
          {lastAppointment
            ? formatDateByCountry(lastAppointment, clinic?.country)
            : '-'}
        </span>
      ),
      sorter: true,
      responsive: ['lg'], // Hide on mobile and tablet
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

  // Mobile Card View Component
  const PatientCard = ({ patient }) => (
    <Card
      hoverable
      onClick={() => showPreview(patient.id)}
      styles={{ body: { padding: '16px' } }}
      style={{ height: '100%', borderRadius: '8px' }}
    >
      <Space direction="vertical" size="small" style={{ width: '100%' }}>
        <Space align="start" style={{ width: '100%', justifyContent: 'space-between' }}>
          <Space>
            <Avatar icon={<UserOutlined />} size="large" />
            <div>
              <Typography.Text strong style={{ fontSize: '16px', display: 'block' }}>
                {patient.first_name} {patient.last_name}
              </Typography.Text>
              <Space size="small" style={{ marginTop: '4px' }}>
                <PhoneOutlined style={{ fontSize: '12px', color: '#8c8c8c' }} />
                <Typography.Text type="secondary" style={{ fontSize: '12px' }}>
                  {patient.phone_number}
                </Typography.Text>
              </Space>
            </div>
          </Space>
        </Space>

        {isMedbridge && (
          <Typography.Text type="secondary" style={{ fontSize: '12px' }}>
            {formatMessage(messages.homeLocation)}: {getHomeLocationDisplay(patient.home_location)}
          </Typography.Text>
        )}
        {patient.last_appointment && (
          <Space size="small">
            <CalendarOutlined style={{ fontSize: '12px', color: '#8c8c8c' }} />
            <Typography.Text type="secondary" style={{ fontSize: '12px' }}>
              Last: {formatDateByCountry(patient.last_appointment, clinic?.country)}
            </Typography.Text>
          </Space>
        )}

        <Space style={{ width: '100%', justifyContent: 'flex-end', marginTop: '8px' }}>
          <Tooltip title={formatMessage(messages.editPatient)}>
            <Button
              icon={<FormOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                updatePatient(patient.id);
              }}
              size="small"
            />
          </Tooltip>
          <Tooltip title={formatMessage(messages.patientDelete)}>
            <Button
              icon={<DeleteOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                setPatientForDelete(patient);
              }}
              size="small"
              danger
            />
          </Tooltip>
        </Space>
      </Space>
    </Card>
  );

  return (
    <div style={{ maxWidth: '100%', overflowX: 'hidden' }}>
      {isMobile ? (
        // Mobile Layout
        <div className="mb-4">
          <Typography.Title level={2} style={{ fontSize: '20px', marginBottom: '16px' }}>
            {formatMessage(messages.patientsTitle)}
          </Typography.Title>
          <form onSubmit={handleSearch} style={{ marginBottom: '12px', width: '100%' }}>
            <Input
              placeholder={formatMessage(messages.search)}
              prefix={<SearchOutlined />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%' }}
            />
          </form>
          <Space wrap size="small" style={{ width: '100%', display: 'flex', justifyContent: 'flex-start' }}>
            <Tooltip title={formatMessage(messages.newPatient)}>
              <Button
                onClick={showCreate}
                type="primary"
                icon={<PlusOutlined />}
                size="small"
              >
                New
              </Button>
            </Tooltip>
            <UploaderPatient onUploadComplete={handleUploadCompletion} />
            <Tooltip title={formatMessage(messages.notonwhatsappPatient)}>
              <Button
                onClick={downloadNotOnWhatsapp}
                type="primary"
                icon={<DownloadOutlined />}
                size="small"
              >
                Export
              </Button>
            </Tooltip>
          </Space>
        </div>
      ) : (
        // Desktop/Tablet Layout
        <div className="mb-4" style={{ paddingTop: '24px' }}>
          <Row gutter={16} align="middle" style={{ marginBottom: '16px' }}>
            <Col flex="auto">
              <Typography.Title level={2} style={{ margin: 0 }}>
                {formatMessage(messages.patientsTitle)}
              </Typography.Title>
            </Col>
            <Col>
              <Space size="middle">
                <form onSubmit={handleSearch}>
                  <Input
                    placeholder={formatMessage(messages.search)}
                    prefix={<SearchOutlined />}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ width: '200px' }}
                  />
                </form>
                <Button onClick={showCreate} type="primary">
                  {formatMessage(messages.newPatient)}
                </Button>
                <UploaderPatient onUploadComplete={handleUploadCompletion} />
                <Button onClick={downloadNotOnWhatsapp} type="primary">
                  {formatMessage(messages.notonwhatsappPatient)}
                </Button>
              </Space>
            </Col>
          </Row>
        </div>
      )}
      {isMobile ? (
        // Mobile Card Grid View
        <>
          {loading ? (
            <Card loading={loading} />
          ) : (
            <>
              <Row gutter={[12, 12]}>
                {patients.map((patient) => (
                  <Col xs={24} sm={12} key={patient.id}>
                    <PatientCard patient={patient} />
                  </Col>
                ))}
              </Row>
              {count > DEFAULT_PAGINATION_LIMIT && (
                <div style={{ marginTop: '16px', textAlign: 'center' }}>
                  <Space>
                    <Button
                      disabled={page === 1}
                      onClick={() => handlePaginationChange(page - 1)}
                      size="small"
                    >
                      Previous
                    </Button>
                    <Typography.Text>
                      Page {page} of {Math.ceil(count / DEFAULT_PAGINATION_LIMIT)}
                    </Typography.Text>
                    <Button
                      disabled={page >= Math.ceil(count / DEFAULT_PAGINATION_LIMIT)}
                      onClick={() => handlePaginationChange(page + 1)}
                      size="small"
                    >
                      Next
                    </Button>
                  </Space>
                </div>
              )}
            </>
          )}
        </>
      ) : (
        // Desktop Table View
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
                onShowSizeChange: (current, size) => handlePaginationSizeChange(current, size),
                hideOnSinglePage: true,
                current: page,
              }}
              loading={loading}
            />
          </div>
        </Card>
      )}
      <Modal
        title={formatMessage(messages.deleteTitle)}
        description={formatMessage(messages.deleteDescription, {
          label: patientForDelete
            ? patientForDelete.first_name + ' ' + patientForDelete.last_name
            : '',
        })}
        primaryAction={formatMessage(messages.delete)}
        secondaryAction={formatMessage(messages.cancel)}
        visible={!!patientForDelete}
        handlePrimaryAction={handleDelete}
        handleSecondaryAction={() => setPatientForDelete(null)}
      />
    </div>
  );
};

export default PatientList;
