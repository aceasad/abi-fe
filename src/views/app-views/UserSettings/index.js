import React, { useEffect, useState } from 'react';
import { Card, Table, Tooltip, Typography, Button, Modal, message } from 'antd';
import { FormOutlined, DeleteOutlined } from '@ant-design/icons';
import Layout, { Content, Header } from 'antd/lib/layout/layout';
import { useIntl } from 'react-intl';
import messages from './messages';
import { useDispatch, useSelector } from 'react-redux';
import { deleteUser, getUsers, setUsersPage } from 'redux/actions/User';
import { makeSelectUsers } from 'redux/selectors/Users';
import { DEFAULT_PAGINATION_LIMIT } from 'constants/ApiConstant';
import CreateUser from './CreateUser';
import UpdateUser from './UpdateUser';

const { Text, Title } = Typography;
const { confirm } = Modal;

const USER_FORM = {
  CREATE: 1,
  UPDATE: 2,
};

const UserSettings = () => {
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const { users, page, count, loading } = useSelector(makeSelectUsers());

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  const [activeForm, setActiveForm] = useState();

  const afterDelete = () => {
    message.success(formatMessage(messages.userDeleted));
  };

  const showDeleteConfirm = (element) => {
    confirm({
      title: formatMessage(messages.deleteConfirmation, {
        user: element.name,
      }),
      okText: formatMessage(messages.formConfirmationButton),
      okType: 'danger',
      cancelText: formatMessage(messages.formCancelButton),
      onOk() {
        dispatch(deleteUser({ id: element.id, afterDelete }));
      },
    });
  };

  const closeUserForm = () => setActiveForm(null);

  const getActiveUserForm = () => {
    switch (activeForm?.id) {
      case USER_FORM.UPDATE:
        return (
          <UpdateUser closeModal={closeUserForm} userId={activeForm.data} />
        );
      case USER_FORM.CREATE:
        return <CreateUser closeModal={closeUserForm} />;
      default:
        return null;
    }
  };

  const handlePaginationChange = (page) => {
    dispatch(setUsersPage(page));
  };

  const tableColumns = [
    {
      title: formatMessage(messages.formName),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: formatMessage(messages.formEmail),
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '',
      dataIndex: 'actions',
      render: (_, elm) => (
        <div className="text-right">
          {elm.is_organization_owner && (
            <Text strong className="text-primary mr-2">
              {formatMessage(messages.superadmin)}
            </Text>
          )}
          <Tooltip title={formatMessage(messages.editUser)}>
            <Button
              className="mr-2"
              icon={<FormOutlined />}
              onClick={() =>
                setActiveForm({ id: USER_FORM.UPDATE, data: elm.id })
              }
              size="small"
            />
          </Tooltip>
          {!elm.is_organization_owner && (
            <Tooltip title={formatMessage(messages.deleteUser)}>
              <Button
                icon={<DeleteOutlined />}
                onClick={() => showDeleteConfirm(elm)}
                size="small"
              />
            </Tooltip>
          )}
        </div>
      ),
    },
  ];
  return (
    <Layout>
      <Header className="ant-layout-page-header shadow-sm d-flex justify-content-sm-between">
        <Title className="mb-sm-0">{formatMessage(messages.title)}</Title>
        <Button
          type="primary"
          onClick={() => setActiveForm({ id: USER_FORM.CREATE })}
        >
          {formatMessage(messages.buttonNew)}
        </Button>
      </Header>
      <Content>
        <Card className="m-4 p-3">
          <Table
            columns={tableColumns}
            rowKey="id"
            dataSource={users.map((pat) => ({ ...pat, key: pat.id }))}
            pagination={{
              defaultPageSize: DEFAULT_PAGINATION_LIMIT,
              total: count,
              onChange: handlePaginationChange,
              hideOnSinglePage: true,
              current: page,
            }}
            loading={loading}
          />
          {getActiveUserForm()}
        </Card>
      </Content>
    </Layout>
  );
};

export default UserSettings;
