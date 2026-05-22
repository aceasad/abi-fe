import Modal from 'antd/lib/modal/Modal';
import React from 'react';
import { useSelector } from 'react-redux';
import { makeSelectSingleAppointmentLoading } from 'redux/selectors/Appointment';
import { makeSelectClinic } from 'redux/selectors/Clinic';
import { Typography } from 'antd';
import RowWithMultipleColumns from 'components/util-components/Grid/RowWithMultipleColumns';
import { formatDateByCountry } from 'utils/helpers';

const DeleteAppointmentModal = ({ handleClose, handleDelete, appointment }) => {

  const loading = useSelector(makeSelectSingleAppointmentLoading());
  const clinic = useSelector(makeSelectClinic());

  const listData = [
    {
      label: "Patient",
      value: appointment?.patient?.full_name,
    },
    {
      label: "Doctor",
      value: `${appointment?.doctor?.full_name} (${appointment?.specialization})`,
    },
    {
      label: "Date",
      value: formatDateByCountry(appointment?.date, clinic?.country, [
        'DD/MM/YYYY',
        'MM/DD/YYYY',
        'YYYY-MM-DD',
      ]),
    },
    {
      label: "Time",
      value: appointment?.time,
    },
  ];

  const list = listData.map((item, index) => (
    <RowWithMultipleColumns key={index} gutter={16} spanList={[4, 20]}>
      {`${item.label}:`}
      {item.value}
    </RowWithMultipleColumns>
  ));

  return (
    <Modal
      open
      cancelText={"Cancel"}
      okText={"Confirm"}
      title={"Delete appointment?"}
      onCancel={handleClose}
      okButtonProps={{ disabled: loading }}
      onOk={handleDelete}
    >
      <Typography.Paragraph type="secondary" strong>
        {"Are you sure you want to delete this appointment?"}
      </Typography.Paragraph>
      {list}
    </Modal>
  );
};

export default DeleteAppointmentModal;
