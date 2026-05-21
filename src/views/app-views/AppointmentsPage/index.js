import { Button, Grid, Typography, Space, Modal, Row, Col } from 'antd';
import { PageHeader } from '@ant-design/pro-components';
import React, { useState } from 'react';
import CalendarPage from '../CalendarPage';
import CreateAppointment from './CreateAppointment';
import AppointmentFormWrapper from './AppointmentFormWrapper';
import { useSelector } from 'react-redux';
import { useSyncPasService } from 'queries/shared';
import utils from 'utils';
import messages from './messages';

const { useBreakpoint } = Grid;

const AppointmentsPage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPASModalVisible, setPASIsModalVisible] = useState(false);

  const screens = utils.getBreakPoint(useBreakpoint());
  const isMobile = !screens.includes('lg');
  const { isPasIntegrated } = useSelector(state => state.auth.user);
  const [syncStatus, setsyncStatus] = useState(false)
  const { mutate } = useSyncPasService(setsyncStatus);

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const closePasModel = () => {
    setPASIsModalVisible(false);
  }

  const StartSyncProcess = () => {
    mutate(undefined, {
      onSuccess: (data) => {
        setPASIsModalVisible(false);
      },
      onError: (error) => {
        console.error("Sync API Error:", error);
        setPASIsModalVisible(false);
      }
    });
    setsyncStatus(true);
  }
  return (
    <>
      <PageHeader
        className="p-0 mb-4"
        title={
          isMobile ? (
            <Typography.Title level={3} className="mb-0">
              Appointments
            </Typography.Title>
          ) : (
            ''
          )
        }
        extra={[
          <Space key="0">
            {/* <Button type="primary" onClick={() => setIsModalVisible(true)}>
              {interpolate({
                id: 'appointments_page.button.new_appointment',
              })}
            </Button> */}
            {isPasIntegrated ? (
              <Button type="primary" onClick={() => setPASIsModalVisible(true)}>
                Sync with Health System
              </Button>) : (<></>)}

          </Space>,
        ]}
      />
      {isModalVisible && (
        <AppointmentFormWrapper
          Component={CreateAppointment}
          isEditForm={false}
          closeModal={closeModal}
          isModalVisible={isModalVisible}
        />
      )}
      {isPASModalVisible && (
        <Modal
          title={"Pas Sync Process"}
          open
          destroyOnHidden
          closable={true}
          onCancel={closePasModel}
          width={400}
          footer={[
            <Button
              key="submit"
              type="primary"
              disabled={syncStatus}
              onClick={StartSyncProcess}
              style={{ margin: '0 auto', display: 'block' }}
            >
              Apply Sync
            </Button>,
          ]}
        >
          <Row gutter={16} className="d-flex justify-content-center">
            <Col xs={20} style={{ textAlign: 'center' }}>
              {syncStatus ? (<Typography>
                Pas-Connected System is updating, please refresh browser to see new updates shortly!
              </Typography>) : (<Typography>
                Please note that the background-sync process will update your clinic's patients from the connected PAS System.
              </Typography>)}
            </Col>
          </Row>
        </Modal>
      )}

      <CalendarPage />
    </>
  );
};

export default AppointmentsPage;
