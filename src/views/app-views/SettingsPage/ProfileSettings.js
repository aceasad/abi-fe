import React from 'react';
import ChangePassword from 'views/app-views/SettingsPage/ChangePassword';
import PersonalDetailsForm from 'views/app-views/SettingsPage/PersonalDetailsForm';

const ProfileSettings = () => {
  return (
    <>
      <PersonalDetailsForm />
      <ChangePassword />
    </>
  );
};

export default ProfileSettings;
