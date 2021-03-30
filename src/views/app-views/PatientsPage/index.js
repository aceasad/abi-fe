import React, { useState } from 'react';
import { Card, Table, Input, Button, Menu, Typography } from 'antd';
import { EyeOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import Flex from 'components/shared-components/Flex';
import { useHistory } from 'react-router-dom';
import utils from 'utils';
import Layout, { Content, Header } from 'antd/lib/layout/layout';
import moment from 'moment';
import localeString from 'utils/localeString';

const { Title } = Typography;

const dummyData = [
  {
    id: '1',
    firstName: 'Slobodan',
    lastName: 'Subotic',
    phoneNumber: '100100',
    lastAppointment: '2020-6-11',
  },
  {
    id: '2',
    firstName: 'Dejan',
    lastName: 'Petrovic',
    phoneNumber: '300300',
    lastAppointment: '2019-12-08',
  },
  {
    id: '3',
    firstName: 'Ivana',
    lastName: 'Nikolic',
    phoneNumber: '200200',
    lastAppointment: '2018-3-24',
  },
  {
    id: '4',
    firstName: 'Eleonora',
    lastName: 'Miljkovic',
    phoneNumber: '400400',
    lastAppointment: '2021-02-1',
  },
];

const ProductList = ({ localization = true }) => {
  const history = useHistory();
  const [list, setList] = useState(dummyData);
  const [selectedRows, setSelectedRows] = useState([]);

  const dropdownMenu = (row) => (
    <Menu>
      <Menu.Item onClick={() => viewDetails(row)}>
        <Flex alignItems="center">
          <EyeOutlined />
          <span className="ml-2">
            {localeString(localization, 'patient_list.option.details')}
          </span>
        </Flex>
      </Menu.Item>
      <Menu.Item onClick={() => deleteRow(row)}>
        <Flex alignItems="center">
          <DeleteOutlined />
          <span className="ml-2">
            {localeString(localization, 'patient_list.option.delete')}
          </span>
        </Flex>
      </Menu.Item>
    </Menu>
  );

  const addProduct = () => {
    history.push(`/app/apps/ecommerce/add-product`);
  };

  const viewDetails = (row) => {
    history.push(`/app/apps/ecommerce/edit-product/${row.id}`);
  };

  const deleteRow = (row) => {
    const objKey = 'id';
    let data = list;
    if (selectedRows.length > 1) {
      selectedRows.forEach((elm) => {
        data = utils.deleteArrayRow(data, objKey, elm.id);
        setList(data);
        setSelectedRows([]);
      });
    } else {
      data = utils.deleteArrayRow(data, objKey, row.id);
      setList(data);
    }
  };

  const tableColumns = [
    {
      title: localeString(localization, 'patient_list.title.first_name'),
      dataIndex: 'firstName',
      render: (firstName) => <span>{firstName}</span>,
      sorter: (a, b) => utils.antdTableSorter(a, b, 'firstName'),
    },
    {
      title: localeString(localization, 'patient_list.title.last_name'),
      dataIndex: 'lastName',
      render: (lastName) => <span>{lastName}</span>,
      sorter: (a, b) => utils.antdTableSorter(a, b, 'lastName'),
    },
    {
      title: localeString(localization, 'patient_list.title.phone_number'),
      dataIndex: 'phoneNumber',
      render: (phoneNumber) => <span>{phoneNumber}</span>,
      sorter: (a, b) => utils.antdTableSorter(a, b, 'phoneNumber'),
    },
    {
      title: localeString(localization, 'patient_list.title.last_appointment'),
      dataIndex: 'lastAppointment',
      render: (lastAppointment) => (
        <span>{moment(lastAppointment).format('MM/DD/YYYY')}</span>
      ),
      sorter: (a, b) => utils.antdTableSorter(a, b, 'lastAppointment'),
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

  const onSearch = (e) => {
    const value = e.currentTarget.value;
    const searchArray = e.currentTarget.value ? list : dummyData;
    const data = utils.wildCardSearch(searchArray, value);
    setList(data);
  };

  return (
    <Layout>
      <Header className="ant-layout-page-header shadow-sm d-flex justify-content-sm-between">
        <Title className="mb-sm-0">
          {localeString(localization, 'patient_list.header.title')}
        </Title>
        <div className="d-flex">
          <Input
            className="mr-4"
            placeholder="Search"
            prefix={<SearchOutlined />}
            onChange={onSearch}
          />
          <Button onClick={addProduct} type="primary">
            {localeString(localization, 'patient_list.button.new')}
          </Button>
        </div>
      </Header>
      <Content>
        <Card className="m-4">
          <div className="table-responsive">
            <Table
              columns={tableColumns}
              dataSource={list}
              pagination={{ defaultPageSize: 10 }}
            />
          </div>
        </Card>
      </Content>
    </Layout>
  );
};

export default ProductList;
