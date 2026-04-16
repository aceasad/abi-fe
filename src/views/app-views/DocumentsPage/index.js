import React, { useEffect, useState } from 'react';
import { Layout, Space, Table, Tag, Typography, Grid, Card, Row, Col, Button, Tooltip, message, Input } from 'antd';
import documentsService from 'services/DocumentsService';
import patientService from 'services/PatientService';
import EditModal from './EditModal';
import Uploader from './Uploader';
import AskQuestions from './AskQuestions';
import utils from 'utils';
import Modal from 'components/shared-components/Modal';
import { FileTextOutlined, DownloadOutlined, TagOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
const { Title } = Typography;

const { useBreakpoint } = Grid;

const DocumentsPage = () => {
  const [listOfDocuments, setListOfDocuments] = useState([]);
  const [appointmentTypes, setAppointmentTypes] = useState([]);
  const [locations, setLocations] = useState([]);
  const [documentToDelete, setDocumentToDelete] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [bulkDeleteLoading, setBulkDeleteLoading] = useState(false);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const { PASProvider } = useSelector((state) => state.auth.user || {});
  const isMedbridge = (PASProvider || '').toLowerCase() === 'medbridge';

  const screens = utils.getBreakPoint(useBreakpoint());
  const isMobile = !screens.includes('lg');

  useEffect(() => {
    async function fetchData() {
      const response = await documentsService.getDocuments();

      const data = response.data.results.map((item) => {
        return {
          ...item,
          key: item.id,
        };
      });
      var filtered_data = data.filter(function (obj) {
        return obj.document_name != 'Context Document';
      });
      setListOfDocuments(filtered_data);
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      const response = await documentsService.getAppointments();

      setAppointmentTypes(response.data.results);
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (!isMedbridge) {
      setLocations([]);
      return;
    }
    async function fetchLocations() {
      try {
        const response = await patientService.getPatientLocations();
        setLocations(Array.isArray(response.data) ? response.data : []);
      } catch {
        setLocations([]);
      }
    }
    fetchLocations();
  }, [isMedbridge]);

  useEffect(() => {
    const ids = new Set((listOfDocuments || []).map((item) => item.id));
    setSelectedRowKeys((prev) => prev.filter((key) => ids.has(key)));
  }, [listOfDocuments]);

  const getLocationLabel = (locationId) => {
    if (!locationId) return '-';
    const location = (locations || []).find(
      (item) => String(item?.location_id) === String(locationId)
    );
    const locationName = location?.location_description || location?.location_name;
    return locationName ? `${locationName} (${locationId})` : `(${locationId})`;
  };

  const handleUpdateDataSource = (newValues, type) => {
    if (type === 'delete') {
      const filteredData = listOfDocuments.filter(
        (item) => item.id !== newValues
      );
      setListOfDocuments(filteredData);
      return;
    }

    const incomingValues = Array.isArray(newValues) ? newValues : [newValues];
    const hasArrayResponse = Array.isArray(newValues);

    if (hasArrayResponse) {
      const updated = [...listOfDocuments];
      incomingValues.forEach((value) => {
        const existingIndex = updated.findIndex((item) => item.id === value.id);
        const mappedValue = {
          ...value,
          key: value.id,
        };
        if (existingIndex >= 0) {
          updated[existingIndex] = mappedValue;
        } else {
          updated.push(mappedValue);
        }
      });
      setListOfDocuments(updated);
      return;
    }

    const shouldUpdateListOfDocuments = listOfDocuments.find(
      (item) => item.id === newValues.id
    );

    if (shouldUpdateListOfDocuments) {
      const updatedDataSource = listOfDocuments.map((item) => {
        if (item.id === newValues.id) {
          return {
            ...newValues,
            key: newValues.id,
          };
        }
        return item;
      });

      setListOfDocuments(updatedDataSource);
    } else {
      setListOfDocuments([
        ...listOfDocuments,
        {
          ...newValues,
          key: newValues.id,
        },
      ]);
    }
  };

  const handleDelete = () => {
    documentsService.deleteDocumentById(documentToDelete.id).then(() => {
      handleUpdateDataSource(documentToDelete.id, 'delete');
      setDocumentToDelete(null);
      message.success('Document deleted successfully');
    }).catch(() => {
      message.error('Failed to delete document');
      setDocumentToDelete(null);
    });
  };

  const handleBulkDelete = async () => {
    if (!selectedRowKeys.length) {
      setIsBulkDeleteModalOpen(false);
      return;
    }
    setBulkDeleteLoading(true);
    const results = await Promise.allSettled(
      selectedRowKeys.map((id) => documentsService.deleteDocumentById(id))
    );

    const deletedIds = [];
    let failedCount = 0;
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        deletedIds.push(selectedRowKeys[index]);
      } else {
        failedCount += 1;
      }
    });

    if (deletedIds.length) {
      setListOfDocuments((prev) => prev.filter((item) => !deletedIds.includes(item.id)));
      setSelectedRowKeys((prev) => prev.filter((id) => !deletedIds.includes(id)));
    }

    if (failedCount === 0) {
      message.success(`${deletedIds.length} document(s) deleted successfully`);
    } else if (deletedIds.length) {
      message.warning(
        `${deletedIds.length} document(s) deleted, ${failedCount} failed`
      );
    } else {
      message.error('Failed to delete selected documents');
    }

    setBulkDeleteLoading(false);
    setIsBulkDeleteModalOpen(false);
  };

  const columns = [
    {
      title: 'Document name',
      dataIndex: 'document_name',
      key: 'document_name',
    },
    {
      title: 'Appointment type',
      dataIndex: 'appointment_type',
      key: 'appointment_type',
      render: (appointment_type) => (
        <>
          <Tag color="red">{appointment_type.toUpperCase()}</Tag>
        </>
      ),
      responsive: ['md'], // Hide on mobile
    },
    ...(isMedbridge
      ? [{
        title: 'Location',
        dataIndex: 'location_id',
        key: 'location_id',
        render: (location_id) => getLocationLabel(location_id),
        responsive: ['md'],
      }]
      : []),
    {
      title: '',
      dataIndex: 'actions',
      render: (_, record) => (
        <div className="text-right">
          <Space>
            <Tooltip title="Download">
              <Button
                icon={<DownloadOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(record.file, '_blank');
                }}
                size="small"
              />
            </Tooltip>
            <EditModal
              record={record}
              appointmentTypes={appointmentTypes}
              locations={locations}
              isMedbridge={isMedbridge}
              handleUpdateDataSource={handleUpdateDataSource}
            />
            <Tooltip title="Delete">
              <Button
                icon={<DeleteOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  setDocumentToDelete(record);
                }}
                size="small"
                danger
              />
            </Tooltip>
          </Space>
        </div>
      ),
    },
  ];

  const filteredDocuments = listOfDocuments.filter((document) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;
    const appointmentType = (document.appointment_type || '').toLowerCase();
    const documentName = (document.document_name || '').toLowerCase();
    const locationLabel = getLocationLabel(document.location_id).toLowerCase();
    return (
      documentName.includes(query) ||
      appointmentType.includes(query) ||
      locationLabel.includes(query)
    );
  });

  // Mobile Card Component
  const DocumentCard = ({ document }) => (
    <Card
      hoverable
      styles={{ body: { padding: '16px' } }}
      style={{ height: '100%', borderRadius: '8px' }}
    >
      <Space direction="vertical" size="small" style={{ width: '100%' }}>
        <Space>
          <FileTextOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
          <Typography.Text strong style={{ fontSize: '16px' }}>
            {document.document_name}
          </Typography.Text>
        </Space>

        {document.appointment_type && (
          <Space size="small">
            <TagOutlined style={{ fontSize: '12px', color: '#8c8c8c' }} />
            <Tag color="red">{document.appointment_type.toUpperCase()}</Tag>
          </Space>
        )}
        {isMedbridge && (
          <Space size="small">
            <TagOutlined style={{ fontSize: '12px', color: '#8c8c8c' }} />
            <Typography.Text type="secondary">
              {getLocationLabel(document.location_id)}
            </Typography.Text>
          </Space>
        )}

        <Space style={{ width: '100%', justifyContent: 'flex-end', marginTop: '8px' }}>
          <EditModal
            record={document}
            appointmentTypes={appointmentTypes}
            locations={locations}
            isMedbridge={isMedbridge}
            handleUpdateDataSource={handleUpdateDataSource}
          />
          <Tooltip title="Download">
            <Button
              icon={<DownloadOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                window.open(document.file, '_blank');
              }}
              size="small"
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              icon={<DeleteOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                setDocumentToDelete(document);
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
    <Layout style={{ maxWidth: '100%', overflowX: 'hidden' }}>
      <div className="mb-4" style={{ paddingTop: isMobile ? 0 : '24px', marginBottom: '16px' }}>
        {isMobile ? (
          <>
            <Typography.Title level={2} style={{ margin: 0, marginBottom: '16px' }}>
              Documents
            </Typography.Title>
            <Input
              placeholder="Search documents"
              prefix={<SearchOutlined />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ marginBottom: '12px' }}
            />
            <Space wrap size="small">
              <Uploader
                handleUpdateDataSource={handleUpdateDataSource}
                appointmentTypes={appointmentTypes}
                locations={locations}
                isMedbridge={isMedbridge}
              />
            </Space>
          </>
        ) : (
          <Row gutter={16} align="middle">
            <Col flex="auto">
              <Typography.Title level={2} style={{ margin: 0 }}>
                Documents
              </Typography.Title>
            </Col>
            <Col>
              <Space size="middle">
                <Input
                  placeholder="Search documents"
                  prefix={<SearchOutlined />}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ width: '220px' }}
                />
                <Uploader
                  handleUpdateDataSource={handleUpdateDataSource}
                  appointmentTypes={appointmentTypes}
                  locations={locations}
                  isMedbridge={isMedbridge}
                />
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  disabled={!selectedRowKeys.length}
                  onClick={() => setIsBulkDeleteModalOpen(true)}
                >
                  Delete selected ({selectedRowKeys.length})
                </Button>
              </Space>
            </Col>
          </Row>
        )}
      </div>

      {isMobile ? (
        // Mobile Card View
        filteredDocuments.length > 0 ? (
          <Row gutter={[12, 12]}>
            {filteredDocuments.map((document) => (
              <Col xs={24} sm={12} key={document.id}>
                <DocumentCard document={document} />
              </Col>
            ))}
          </Row>
        ) : (
          <Card>
            <Typography.Text type="secondary">No documents available</Typography.Text>
          </Card>
        )
      ) : (
        // Desktop Table View
        <Table
          columns={columns}
          dataSource={filteredDocuments}
          rowSelection={{
            selectedRowKeys,
            onChange: (keys) => setSelectedRowKeys(keys),
          }}
        />
      )}

      <Modal
        title="Delete Document"
        description={`Are you sure you want to delete "${documentToDelete?.document_name}"?`}
        primaryAction="Delete"
        secondaryAction="Cancel"
        visible={!!documentToDelete}
        handlePrimaryAction={handleDelete}
        handleSecondaryAction={() => setDocumentToDelete(null)}
      />
      <Modal
        title="Delete Selected Documents"
        description={`Are you sure you want to delete ${selectedRowKeys.length} selected document(s)?`}
        primaryAction="Delete"
        secondaryAction="Cancel"
        visible={isBulkDeleteModalOpen}
        handlePrimaryAction={handleBulkDelete}
        handleSecondaryAction={() => setIsBulkDeleteModalOpen(false)}
        confirmLoading={bulkDeleteLoading}
      />
    </Layout>
  );
};

export default DocumentsPage;
