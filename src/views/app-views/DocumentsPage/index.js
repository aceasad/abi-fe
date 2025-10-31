import React, { useEffect, useState } from 'react';
import { Layout, Space, Table, Tag, Typography, Grid, Card, Row, Col, Button, Tooltip, message } from 'antd';
import documentsService from 'services/DocumentsService';
import EditModal from './EditModal';
import Uploader from './Uploader';
import AskQuestions from './AskQuestions';
import utils from 'utils';
import Modal from 'components/shared-components/Modal';
import { FileTextOutlined, DownloadOutlined, TagOutlined, DeleteOutlined } from '@ant-design/icons';
const { Title } = Typography;

const { useBreakpoint } = Grid;

const DocumentsPage = () => {
  const [listOfDocuments, setListOfDocuments] = useState([]);
  const [appointmentTypes, setAppointmentTypes] = useState([]);
  const [documentToDelete, setDocumentToDelete] = useState(null);

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

  const handleUpdateDataSource = (newValues, type) => {
    if (type === 'delete') {
      const filteredData = listOfDocuments.filter(
        (item) => item.id !== newValues
      );
      setListOfDocuments(filteredData);
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

        <Space style={{ width: '100%', justifyContent: 'flex-end', marginTop: '8px' }}>
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
      <div className="mb-4" style={{ paddingTop: isMobile ? 0 : '24px' }}>
        <Typography.Title level={2} style={{ margin: 0, marginBottom: '16px' }}>
          Documents
        </Typography.Title>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <Uploader
          handleUpdateDataSource={handleUpdateDataSource}
          appointmentTypes={appointmentTypes}
        />
      </div>

      {isMobile ? (
        // Mobile Card View
        listOfDocuments.length > 0 ? (
          <Row gutter={[12, 12]}>
            {listOfDocuments.map((document) => (
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
        <Table columns={columns} dataSource={listOfDocuments} />
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
    </Layout>
  );
};

export default DocumentsPage;
