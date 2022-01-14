import Modal from 'antd/lib/modal/Modal';
import React from 'react';
import { CloseOutlined } from '@ant-design/icons';
import Loading from 'components/shared-components/Loading';
import { useSelector } from 'react-redux';
import { makeSelectSinglePreAppointmentQuestionnaire } from 'redux/selectors/Appointment';
import { Space } from 'antd';
import Flex from 'components/shared-components/Flex';
import { formatMessage } from '@formatjs/intl';
import messages from './messages';
import { useIntl } from 'react-intl';

function PreAppointmentQuestionnairePreviewModal({ handleClose, title }) {
  const { formatMessage } = useIntl();
  const {
    preAppointmentQuestionnaire,
    preAppointmentQuestionnaireLoading,
  } = useSelector(makeSelectSinglePreAppointmentQuestionnaire());

  const isLoading =
    preAppointmentQuestionnaireLoading || !preAppointmentQuestionnaire;

  const qa = !preAppointmentQuestionnaire
    ? []
    : preAppointmentQuestionnaire.map((elem) => (
        <tr>
          <td>{elem.question}</td>
          <td>{elem?.answer ? 'Yes' : 'No'}</td>
        </tr>
      ));

  return (
    <Modal
      visible
      closable={true}
      title={
        <Flex justifyContent="between">
          {formatMessage(messages.modalTitlePreAppointmentQuestionnaire)}
          <Space size="middle">
            <CloseOutlined onClick={handleClose} />
          </Space>
        </Flex>
      }
    >
      {isLoading ? (
        <Loading />
      ) : (
        <div className="mb-4">
          <table
            style={{ borderCollapse: 'collapse' }}
            border="1"
            cellpadding="1"
            cellspacing="1"
          >
            <tr>
              <th>Question</th>
              <th>Answer</th>
            </tr>
            {qa}
          </table>
        </div>
      )}
    </Modal>
  );
}

export default PreAppointmentQuestionnairePreviewModal;
