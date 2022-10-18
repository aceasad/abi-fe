import React, { useEffect, useState } from 'react';
import { Layout, Space, Table, Tag, Typography } from 'antd';
import documentsService from 'services/DocumentsService';
import EditModal from './EditModal';
import Uploader from './Uploader';
import DeleteModal from './DeleteModal';
const { Title } = Typography;

const DocumentsPage = () => {
  const [listOfDocuments, setListOfDocuments] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response = await documentsService.getDocuments();

      const data = response.data.results.map((item, index) => {
        return {
          ...item,
          key: item.id,
        };
      });

      setListOfDocuments(data);
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

  const columns = [
    {
      title: 'Document Name',
      dataIndex: 'document_name',
      key: 'document_name',
    },
    {
      title: 'File Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Appointment Type',
      dataIndex: 'appointment_type',
      key: 'appointment_type',
      render: (appointment_type) => (
        <>
          <Tag color="red">{appointment_type.toUpperCase()}</Tag>
        </>
      ),
    },
    {
      title: 'Download',
      dataIndex: 'file',
      key: 'file',
      render: (appointment_type) => (
        <a href={appointment_type} target="_blank" rel="noreferrer">
          Download File
        </a>
      ),
    },
    {
      title: 'Actions',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <EditModal
            initialValues={record}
            handleUpdateDataSource={handleUpdateDataSource}
          />
          <DeleteModal
            initialValues={record}
            handleUpdateDataSource={handleUpdateDataSource}
          />
        </Space>
      ),
    },
  ];

  return (
    <Layout>
      <Title level={2} type="primary" className="text-wrap">
        Documents
      </Title>
      <Uploader handleUpdateDataSource={handleUpdateDataSource} />
      <Table columns={columns} dataSource={listOfDocuments} />
    </Layout>
  );
};

export default DocumentsPage;
