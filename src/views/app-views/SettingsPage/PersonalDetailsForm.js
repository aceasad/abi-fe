import { Button, Col, Form, Row, Typography, Grid } from 'antd';
import FormField from 'components/custom-components/Form/FormField';
import { Field, Formik } from 'formik';
import React from 'react';
import { personalDetailsSchema } from 'utils/validations';
import messages from './messages';
import { useIntl } from 'react-intl';
import { message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { makeSelectCurrentUser, makeSelectLoading } from 'redux/selectors/Auth';
import { updateCurrentUser } from 'redux/actions/User';
import { filterEmptyObjectFeilds } from 'utils/helpers';
import utils from 'utils';

const { useBreakpoint } = Grid;

const PersonalDetailsForm = () => {
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const screens = utils.getBreakPoint(useBreakpoint());
  const isMobile = !screens.includes('lg');
  const isTablet = screens.includes('md') && !screens.includes('lg');

  const loading = useSelector(makeSelectLoading());
  const { username, id, name } = useSelector(makeSelectCurrentUser());

  const afterUpdate = () => {
    message.success(formatMessage(messages.userUpdated));
  };

  const handleSubmit = (values, { setErrors }) => {
    const data = { ...filterEmptyObjectFeilds(values), id };
    dispatch(
      updateCurrentUser({
        data,
        afterUpdate,
        setErrors,
      })
    );
  };

  return (
    <div className="p-2">
      <Typography.Title level={3} className="mb-4">
        {formatMessage(messages.personalDetailsTitle)}
      </Typography.Title>
      <Row>
        <Col xs={24} sm={24} md={isTablet ? 16 : 12} lg={10} xl={8}>
          <Formik
            enableReinitialize
            initialValues={{
              name: name || '',
              username: username || '',
            }}
            onSubmit={handleSubmit}
            validationSchema={personalDetailsSchema}
          >
            {({ handleSubmit, dirty, isValid }) => (
              <Form layout="vertical">
                <Field
                  component={FormField}
                  label={formatMessage(messages.personalDetailsNameLabel)}
                  name={'name'}
                />

                <Field
                  component={FormField}
                  label={formatMessage(messages.personalDetailsEmailLabel)}
                  name={'username'}
                />
                <Form.Item className="mt-sm-5">
                  <Button
                    type="primary"
                    htmlType="submit"
                    disabled={loading || !dirty || !isValid}
                    onClick={handleSubmit}
                  >
                    {formatMessage(messages.personalDetailsSaveButton)}
                  </Button>
                </Form.Item>
              </Form>
            )}
          </Formik>
        </Col>
      </Row>
    </div>
  );
};

export default PersonalDetailsForm;
