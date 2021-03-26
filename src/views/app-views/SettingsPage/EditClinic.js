import React from 'react';
import ClinicPage from '../ClinicPage';

let clinicData = {
  photo: null,
  name: 'Test',
  phone_number: '12341234',
  address: 'Test',
  google_maps_link: 'https://google.com',
  parking_availability: 'FREE',
  parking_size: 0,
  start_of_work: '08:00',
  end_of_work: '20:00',
};

const EditClinic = () => {
  return (
    <>
      <ClinicPage clinicData={clinicData} />
    </>
  );
};

export default EditClinic;
