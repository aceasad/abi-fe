import React, { useState } from 'react';
import { Button, Card, Typography } from 'antd';
import Form from 'antd/lib/form/Form';
import FormField from 'components/custom-components/Form/FormField';
import { Field, Formik } from 'formik';
import documentsService from 'services/DocumentsService';
import Modal from 'antd/lib/modal/Modal';
import HighLightText from './HighlightText';
const { Text } = Typography;

const AskQuestions = ({ initialValues }) => {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [answer, setAnswer] = useState(null);

  const showModal = () => {
    setOpen(true);
  };

  const handleQuestionAnswering = async (payload) =>
    await documentsService.questionAnswering(payload);

  const handleCancel = () => {
    setOpen(false);
  };

  const handleSubmit = (values) => {
    setConfirmLoading(true);

    const payload = {
      document_id: values.id,
      message: values.message,
    };

    handleQuestionAnswering(payload)
      .then((res) => {
        setConfirmLoading(false);
        setAnswer(res.data);
      })
      .catch(() => {
        setConfirmLoading(false);
      });
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Ask question
      </Button>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ handleSubmit }) => (
          <Modal
            title="Question Answering"
            visible={open}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
            footer={[
              <Button
                key="back"
                onClick={handleCancel}
                onMouseDown={(event) => {
                  event.preventDefault();
                }}
              >
                Done
              </Button>,
            ]}
          >
            <Form layout="vertical" name="login-form">
              <Field
                label="Your Question"
                component={FormField}
                name="message"
              />
              <Button
                type="primary"
                onClick={handleSubmit}
                loading={confirmLoading}
                style={{ width: '100%' }}
              >
                {confirmLoading ? 'Answering' : 'Answer'}
              </Button>
            </Form>
            {answer && (
              <div style={{ marginTop: '30px' }}>
                <Card>
                  <Text strong className="text-primary">
                    Answer
                  </Text>
                  <div
                    style={{
                      marginBottom: '20px',
                    }}
                  >
                    {answer?.answer}
                  </div>
                  {answer?.context && (
                    <>
                      <Text strong className="text-primary">
                        Context
                      </Text>
                      <div
                        id="output-wrapper-1-1"
                        style={{
                          maxHeight: '180px',
                          overflow: 'auto',
                        }}
                      >
                        {answer?.highlights?.length > 0 ? (
                          <HighLightText
                            id="1"
                            sessionId="1"
                            content={answer?.context}
                            offsetsInDocument={[
                              {
                                start: answer?.highlights[0]?.span[0],
                                end: answer?.highlights[0]?.span[1],
                              },
                            ]}
                            score={100}
                            withScrolling
                          />
                        ) : (
                          <>{answer?.context}</>
                        )}
                      </div>
                    </>
                  )}
                </Card>
              </div>
            )}
          </Modal>
        )}
      </Formik>
    </>
  );
};

export default AskQuestions;
