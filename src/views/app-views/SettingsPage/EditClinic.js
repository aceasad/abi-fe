import ClinicForm from 'containers/Forms/ClinicForm/ClinicForm';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeSelectClinic } from 'redux/selectors/Clinic';
import { getClinic } from 'redux/actions/Clinic';
import Loading from 'components/shared-components/Loading';
import { message } from 'antd';

const EditClinic = () => {
  const dispatch = useDispatch();

  const clinic = useSelector(makeSelectClinic());

  const showSuccess = () =>
    message.success({
      content: "Successfull!",
      duration: 2,
    });

  const showError = () =>
    message.error({
      content: "Something went wrong",
      duration: 2,
    });

  useEffect(() => {
    if (!clinic) dispatch(getClinic());
  }, []);

  return (
    <>
      {clinic ? (
        <ClinicForm
          clinicData={clinic}
          showSuccess={showSuccess}
          showError={showError}
        />
      ) : (
        <Loading cover="content" />
      )}
    </>
  );
};

export default EditClinic;
