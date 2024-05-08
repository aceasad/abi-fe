import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Form, Modal, Row, Col, Typography } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { signIn } from 'redux/actions/Auth';
import { useHistory } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Formik, Field } from 'formik';
import { loginSchema } from 'utils/validations';
import 'assets/sass/views/auth/login.scss';
import messages from './messages';
import { useIntl } from 'react-intl';
import { ROUTES } from 'routes';
import { passwordMinLength } from 'constants/Validation';
import FormField from 'components/custom-components/Form/FormField';
import { makeSelectLoginDetails } from 'redux/selectors/Auth';
import { ReCaptcha } from 'components/reCaptcha'
import axios from 'axios'

/*
Access to this computer/Solution and any information it contains is limited to authorised users only.  Legal action can be taken against unauthorised use of, or unauthorised access to, this computer/Solution and/or any information it contains, including pursuant to the Computer Misuse Act 1990.  If you are an authorised user, by proceeding to access and use this computer/Solution and/or the information it contains, you are accepting any terms of use, notices and policies which are contained or referenced within it or which have otherwise been drawn to your attention as an authorised user.
*/
export const LoginForm = () => {
  let history = useHistory();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [reToken,setreToken] = useState('')
  const [submitEnable,setSubmitEnable] = useState(false)

  const handleReToken = (t) => {
    setreToken(t)

  }

  const dispatch = useDispatch();
  const { loading, message, showMessage, token } = useSelector(
    makeSelectLoginDetails()
  );
  const { formatMessage } = useIntl();


  const onLogin = (values) => {
    values.retoken = reToken
    // EVALUATE GOOGLE RECAPCHA HERE
    axios.post(process.env.REACT_APP_API_URL+'/googleverify/recapture/', {'retoken': reToken})
    .then(response => {
      // Handle success
      console.log('Success:', response.data);
      setIsModalVisible(true);
      setTimeout(() => {
          dispatch(signIn(values));
          setIsModalVisible(false);
      }, 3000);
      // Perform actions based on response
    })
    .catch(error => {
      // Handle failure
      console.error('Error:', error);
      // Perform actions based on error
    });
    

  };

  useEffect(() => {
    if(reToken.length){
      setSubmitEnable(true)
      if (token) {
        history.push(ROUTES.DASHBOARD);
      }
      else{
        setIsModalVisible(false);
      }
   }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token,reToken]);

  const PasswordLabel = ({ email }) => (
    <div className={'d-flex justify-content-between w-100 align-items-center'}>
      <span>{formatMessage(messages.passwordInputLabel)}</span>

      <span
        className="authentication-label-link"
        onClick={() => history.push(ROUTES.FORGOT_PASSWORD, email)}
        onMouseDown={(event) => {
          event.preventDefault();
        }}
      >
        {formatMessage(messages.forgotPasswordLink)}
      </span>
    </div>
  );

  const ValidPasswordFormat = (
    <div>
      <div>
        {formatMessage(messages.minimumCharacters, { min: passwordMinLength })}
      </div>
      <div>{formatMessage(messages.upperAndLowerMixture)}</div>
      <div>{formatMessage(messages.lettersAndNumberMixture)}</div>
      <div>{formatMessage(messages.specialCharacters)}</div>
      <div>{formatMessage(messages.specialCharactersExcluded)}</div>
    </div>
  );

  return (
    <>
      <motion.div
        className="authentication-motion-message"
        initial={{ opacity: 0, marginBottom: 0 }}
        animate={{
          opacity: showMessage ? 1 : 0,
          marginBottom: showMessage ? 20 : 0,
        }}
      >
        {showMessage && message && formatMessage(message)}
      </motion.div>

      <Formik
        initialValues={{ username: '', password: '' }}
        validationSchema={loginSchema}
        onSubmit={(values) => {
          onLogin(values);
        }}
        validateOnMount={false}
      >
        {({ values, handleSubmit, dirty, isValid }) => (
          <Form layout="vertical" name="login-form">
            <Field
              component={FormField}
              label={formatMessage(messages.emailInputLabel)}
              name={'username'}
              prefix={<MailOutlined className="text-primary" />}
              errorTexts={{
                label: formatMessage(messages.emailInputLabel),
              }}
              autoFocus
            />
            <Field
              component={FormField}
              labelComponent={() => <PasswordLabel email={values.username} />}
              tooltipText={ValidPasswordFormat}
              name={'password'}
              prefix={<LockOutlined className="text-primary" />}
              secureField
              errorTexts={{
                label: formatMessage(messages.passwordInputLabel),
                minValue: passwordMinLength,
                matchesLabel: formatMessage(messages.passwordValidFormat),
              }}
              labelBlock={true}
            />
            <Form.Item className = 'mt-sm-5 ml-sm-4'>
              <ReCaptcha siteKey={'6Lc5-MwpAAAAAFJnhYI3lqTIwhFJ6DPTu3L20o_x'} callback={handleReToken} />
            </Form.Item>

            <Form.Item className="mt-sm-5">
              <Button
                onClick={() => handleSubmit(values)}
                type="primary"
                htmlType="submit"
                block
                disabled={!dirty || !isValid || !submitEnable}
                loading={loading}
              >
                {formatMessage(messages.loginButton)}
              </Button>
            </Form.Item>
          </Form>
        )}
      </Formik>

      {isModalVisible ? (      
      <Modal
          title={"Warning"}
          visible
          destroyOnClose
          footer={[]}
        >
              <Row gutter={16} className="d-flex">

                  <Typography align="center">
                     Access to this computer/Solution and any information it contains is limited to authorised users only.  Legal action can be taken against unauthorised use of, or unauthorised access to, this computer/Solution and/or any information it contains, including pursuant to the Computer Misuse Act 1990.  If you are an authorised user, by proceeding to access and use this computer/Solution and/or the information it contains, you are accepting any terms of use, notices and policies which are contained or referenced within it or which have otherwise been drawn to your attention as an authorised user.
                  </Typography>
              </Row>
        </Modal>): (<></>)}
    </>
  );
};

export default LoginForm;