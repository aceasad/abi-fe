import { Button, Grid, Typography, Space } from 'antd';
import { PageHeader } from '@ant-design/pro-components';
import React, { useState } from 'react';
import CalendarPage from '../CalendarPage';
import { useIntl } from 'react-intl';
import CreateAppointment from './CreateAppointment';
import AppointmentFormWrapper from './AppointmentFormWrapper';
import { useSelector } from 'react-redux';
import { useSyncPasService } from 'queries/shared';
import utils from 'utils';
import messages from './messages';

const { useBreakpoint } = Grid;

const AppointmentsPage = () => {
  const { formatMessage } = useIntl();
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
    console.log("Sync Process initiated from ASA Clinic dashboard!")
    mutate(undefined, {
      onSuccess: (data) => {
        console.log("Sync API Response:", data);
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
            <Typography.Title level={2} className="mb-0">
              {formatMessage({ id: 'appointments_page.title' })}
            </Typography.Title>
          ) : (
            ''
          )
        }
        extra={[
          <Space key="0">
            {/* <Button type="primary" onClick={() => setIsModalVisible(true)}>
              {formatMessage({
                id: 'appointments_page.button.new_appointment',
              })}
            </Button> */}
            {isPasIntegrated ? (
              <Button type="primary" onClick={() => setPASIsModalVisible(true)}>
                {formatMessage({
                  id: 'appointments_page.button.sync_process',
                })}
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
          visible
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
