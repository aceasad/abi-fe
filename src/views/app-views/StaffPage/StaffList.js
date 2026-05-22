import React, { useEffect, useState } from 'react';
import { interpolate } from 'utils/interpolate';
import { useDispatch, useSelector } from 'react-redux';
import CardComponent from 'components/shared-components/Card';
import { setStaffPage, getStaff } from 'redux/actions/Staff';

import StaffCardOptions from './StaffCardOptions';
import PaginationComponent from 'components/custom-components/Pagination';
import { makeSelectStaff, makeSelectPagination } from 'redux/selectors/Staff';
import Loading from 'components/shared-components/Loading';
import Modal from 'components/shared-components/Modal';
import { deleteStaff } from 'redux/actions/Staff';
import { message, List, Button, Typography, Grid, Row, Col, Card, Space, Dropdown, Avatar } from 'antd';
import { PageHeader } from '@ant-design/pro-components';
import { UserOutlined, EyeOutlined, MoreOutlined } from '@ant-design/icons';
import utils from 'utils';

const { useBreakpoint } = Grid;

export const OPTION_KEYS = {
  EDIT: '1',
  DELETE: '2',
};

const StaffList = ({ showCreate, editUser, seeAppointments }) => {
  const [staffForDelete, setStaffForDelete] = useState();
  const { isPasIntegrated } = useSelector(state => state.auth.user);
  const { count, page } = useSelector(makeSelectPagination());
  const { staff, loading } = useSelector(makeSelectStaff());

  const dispatch = useDispatch();
  const screens = utils.getBreakPoint(useBreakpoint());
  const isMobile = !screens.includes('lg');

  useEffect(() => {
    dispatch(getStaff());
  }, []);

  useEffect(() => {
    if (staff.length === 0 && page > 1) dispatch(setStaffPage(page - 1));
  }, [staff]);

  const afterDelete = () => {
    setStaffForDelete(null);
    message.success("Staff deleted");
  };

  const handleDelete = () => {
    dispatch(deleteStaff({ id: staffForDelete, afterDelete }));
  };

  const handleOptionClick = (data, key) => {
    // eslint-disable-next-line default-case
    switch (key) {
      case OPTION_KEYS.DELETE:
        setStaffForDelete(data);
        break;
      case OPTION_KEYS.EDIT:
        editUser(data);
        break;
    }
  };

  const getStaffFirstAndLastName = () => {
    if (staffForDelete) {
      const foundStaff = staff.find((s) => s.id === staffForDelete);
      return foundStaff.first_name + ' ' + foundStaff.last_name;
    }
    return '';
  };

  // Mobile Card Component (matching other pages style)
  const StaffCard = ({ staffItem }) => {
    const menuItems = [
      {
        key: OPTION_KEYS.EDIT,
        label: 'Edit',
      },
      {
        key: OPTION_KEYS.DELETE,
        label: 'Delete',
        danger: true,
      },
    ];

    return (
      <Card
        hoverable
        onClick={() => seeAppointments(staffItem.id)}
        styles={{ body: { padding: '16px' } }}
        style={{ height: '100%', borderRadius: '8px' }}
      >
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <Space style={{ width: '100%', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Space align="start">
              <Avatar
                src={staffItem.profile_picture}
                icon={!staffItem.profile_picture && <UserOutlined />}
                size="large"
              />
              <div>
                <Typography.Text strong style={{ fontSize: '16px', display: 'block' }}>
                  {staffItem.first_name + ' ' + staffItem.last_name}
                </Typography.Text>
                {!isPasIntegrated && staffItem.seniority && staffItem.specialization && (
                  <Typography.Text type="secondary" style={{ fontSize: '13px', display: 'block', marginTop: '4px' }}>
                    {staffItem.seniority} {staffItem.specialization}
                  </Typography.Text>
                )}
              </div>
            </Space>
            <Dropdown
              menu={{
                items: menuItems,
                onClick: ({ key }) => {
                  const event = new Event('click');
                  event.stopPropagation();
                  handleOptionClick(staffItem.id, key);
                }
              }}
              trigger={['click']}
              placement="bottomRight"
            >
              <Button
                type="text"
                icon={<MoreOutlined />}
                size="small"
                onClick={(e) => e.stopPropagation()}
              />
            </Dropdown>
          </Space>

          <Button
            type="primary"
            icon={<EyeOutlined />}
            size="small"
            style={{ marginTop: '8px' }}
            onClick={(e) => {
              e.stopPropagation();
              seeAppointments(staffItem.id);
            }}
          >
            View Appointments
          </Button>
        </Space>
      </Card>
    );
  };

  return (
    <div style={{ maxWidth: '100%', overflowX: 'hidden' }}>
      {isMobile ? (
        // Mobile Layout
        <div className="mb-4">
          <Row gutter={16} align="middle" style={{ marginBottom: '16px' }}>
            <Col flex="auto">
              <Typography.Title level={3} style={{ fontSize: '20px', margin: 0 }}>
                {"Staff"}
              </Typography.Title>
            </Col>
            <Col>
              <Button
                type="primary"
                onClick={showCreate}
              >
                Add Staff
              </Button>
            </Col>
          </Row>
        </div>
      ) : (
        // Desktop/Tablet Layout
        <div className="mb-4" style={{ paddingTop: '24px' }}>
          <Row gutter={16} align="middle" style={{ marginBottom: '16px' }}>
            <Col flex="auto">
              <Typography.Title level={3} style={{ margin: 0 }}>
                {"Staff"}
              </Typography.Title>
            </Col>
            <Col>
              <Button type="primary" onClick={showCreate}>
                {"Add new staff"}
              </Button>
            </Col>
          </Row>
        </div>
      )}

      {loading ? (
        <Loading defaultSpinner cover="content" />
      ) : (
        <>
          {isMobile ? (
            // Mobile/Tablet Card View
            <>
              <Row gutter={[12, 12]}>
                {staff.map((staffItem) => (
                  <Col xs={24} sm={12} key={staffItem.id}>
                    <StaffCard staffItem={staffItem} />
                  </Col>
                ))}
              </Row>
              <div style={{ marginTop: '16px' }}>
                <PaginationComponent
                  page={page}
                  count={count}
                  handlePageChange={(page) => dispatch(setStaffPage(page))}
                />
              </div>
            </>
          ) : (
            // Desktop Grid View (Original Style)
            <>
              <List
                className="staff-list"
                grid={{
                  gutter: 16,
                  xs: 1,
                  sm: 2,
                  md: 3,
                  lg: 3,
                  xl: 4,
                  xxl: 5,
                }}
                dataSource={staff.map((st) => ({ ...st, key: st.id || st.key }))}
                renderItem={(staffItem) => (
                  <List.Item key={staffItem.id}>
                    {isPasIntegrated ? (
                      <CardComponent
                        key={staffItem.id}
                        title={staffItem.first_name + ' ' + staffItem.last_name}
                        description={''}
                        avatar={staffItem.profile_picture}
                        action={"See appointments"}
                        Options={() => (
                          <StaffCardOptions
                            handleMenuClick={({ key }) =>
                              handleOptionClick(staffItem.id, key)
                            }
                          />
                        )}
                        handleClick={() => seeAppointments(staffItem.id)}
                      />
                    ) : (
                      <CardComponent
                        key={staffItem.id}
                        title={staffItem.first_name + ' ' + staffItem.last_name}
                        description={
                          staffItem.seniority + ' ' + staffItem.specialization
                        }
                        avatar={staffItem.profile_picture}
                        action={"See appointments"}
                        Options={() => (
                          <StaffCardOptions
                            handleMenuClick={({ key }) =>
                              handleOptionClick(staffItem.id, key)
                            }
                          />
                        )}
                        handleClick={() => seeAppointments(staffItem.id)}
                      />
                    )}
                  </List.Item>
                )}
              />
              <PaginationComponent
                page={page}
                count={count}
                handlePageChange={(page) => dispatch(setStaffPage(page))}
              />
            </>
          )}
        </>
      )}

      <Modal
        title={"Delete staff?"}
        description={interpolate("Are you sure you want to delete {label}?", {
          label: getStaffFirstAndLastName(),
        })}
        primaryAction={"Delete"}
        secondaryAction={"Cancel"}
        open={staffForDelete}
        handlePrimaryAction={handleDelete}
        handleSecondaryAction={() => setStaffForDelete(null)}
      />
    </div>
  );
};

export default StaffList;
