import React, { useState } from 'react';
import { Button, Form, Input, Radio } from 'antd';
import { Formik, Field } from 'formik';
import { clinicSchema } from 'utils/validations';
import { useDispatch } from 'react-redux';
import messages from './messages';
import FormField from 'components/shared-components/Form/FormField';
import FormInputField from 'components/shared-components/Form/FormInputField';
import FormImageUpload from 'components/shared-components/Form/FormImageUpload';
import { useIntl } from 'react-intl';
import { updateClinic } from 'redux/actions/Clinic';
import { NO, FREE, AVAILABLE } from '../../../constants/ClinicConstants';

const ClinicPage = () => {
  const dispatch = useDispatch();
  const [visibilityOfParkinSizeField, setVisibility] = useState(false);

  const { formatMessage } = useIntl();

  const imageStyle = {
    display: 'inline-block',
    width: '150px',
    height: '150px',
    backgroundColor: 'lightgray',
    borderRadius: '30%',
    border: '10%',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center center',
    backgroundSize: 'cover',
  };

  return (
    <div className="container">
      <Formik
        initialValues={{
          photo: null,
          name: '',
          phone_number: '',
          address: '',
          google_maps_link: '',
          parking_availability: null,
          parking_size: 0,
          start_of_work: null,
          end_of_work: null,
        }}
        validationSchema={clinicSchema}
        onSubmit={(values) => {
          dispatch(updateClinic(values));
        }}
      >
        {({ setFieldValue, dirty, isValid, values, handleSubmit }) => (
          <Form layout="vertical" name="clinic-form" onSubmit={handleSubmit}>
            <Field component={FormImageUpload} name={'photo'}></Field>

            <Field
              component={FormField}
              label={formatMessage(messages.clinic_name)}
              name={'name'}
              errorTexts={{
                label: formatMessage(messages.error_input_label_name),
              }}
              autoFocus
            />
            <Field
              component={FormField}
              label={formatMessage(messages.phone_number)}
              name={'phone_number'}
              errorTexts={{
                label: formatMessage(messages.error_input_label_phone_number),
              }}
              autoFocus
            />
            <Field
              component={FormField}
              label={formatMessage(messages.address)}
              name={'address'}
              errorTexts={{
                label: formatMessage(messages.error_input_label_address),
              }}
              autoFocus
            />
            <Field
              component={FormField}
              label={formatMessage(messages.google_maps_link)}
              name={'google_maps_link'}
              errorTexts={{
                label: formatMessage(
                  messages.error_input_label_google_maps_link
                ),
              }}
              autoFocus
            />
            <label>{formatMessage(messages.parking_availability)}</label>
            <Form.Item name="radio-group">
              <Radio.Group
                onChange={(event) => {
                  setVisibility(event.target.value === AVAILABLE);
                  values.parking_availability = event.target.value;
                }}
              >
                <Radio value={NO}>{formatMessage(messages.parking_no)}</Radio>
                <Radio value={FREE}>
                  {formatMessage(messages.parking_free)}
                </Radio>
                <Radio value={AVAILABLE}>
                  {formatMessage(messages.parking_available)}
                </Radio>
                {visibilityOfParkinSizeField ? (
                  <div style={{ marginLeft: '330px' }}>
                    <Field
                      component={FormInputField}
                      label={formatMessage(messages.parking_size)}
                      name={'parking_size'}
                      type={'number'}
                      min={1}
                      autoFocus
                    />
                  </div>
                ) : null}
              </Radio.Group>
            </Form.Item>
            <label>{formatMessage(messages.working_hours)}</label>
            <div className="row">
              <Field
                component={FormInputField}
                name={'start_of_work'}
                type={'time'}
                autoFocus
              />
              <Field
                component={FormInputField}
                name={'end_of_work'}
                type={'time'}
                autoFocus
              />
            </div>
            <Form.Item>
              <Button
                name="create"
                type="primary"
                disabled={!dirty || !isValid}
                onClick={() => handleSubmit(values)}
              >
                Create
              </Button>
            </Form.Item>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ClinicPage;
