import Modal from 'antd/lib/modal/Modal';
import React from 'react';
import { CloseOutlined } from '@ant-design/icons';
import Loading from 'components/shared-components/Loading';
import { useSelector } from 'react-redux';
import { makeSelectSinglePreAppointmentQuestionnaire } from 'redux/selectors/Appointment';
import { Space } from 'antd';
import Flex from 'components/shared-components/Flex';
//import { formatMessage } from '@formatjs/intl';
import messages from './messages';
import { useIntl } from 'react-intl';
import { getSafe } from 'utils/helpers';

function PreAppointmentQuestionnairePreviewModal({ handleClose, title }) {
  const { formatMessage } = useIntl();
  const {
    preAppointmentQuestionnaire,
    preAppointmentQuestionnaireLoading,
  } = useSelector(makeSelectSinglePreAppointmentQuestionnaire());

  const isLoading =
    preAppointmentQuestionnaireLoading || !preAppointmentQuestionnaire;

  const qa =
    !preAppointmentQuestionnaire || !preAppointmentQuestionnaire.length
      ? []
      : preAppointmentQuestionnaire.map((elem, index) => (
        <tr key={`pq-answer-${index}`}>
          <td>
            {getSafe(() =>
              Number(
                elem?.question?.order_no.toString().split('.')[1].charAt(0)
              ) === 0
                ? parseInt(elem?.question?.order_no)
                : elem?.question?.order_no.toString().replaceAll('0', '')
            )}
          </td>
          <td>{elem?.question?.question.replace('Yes/No', '')}</td>
          <td style={{ color: elem?.answer ? '#fd4332' : null }}>{elem?.answer ? 'Yes' : 'No'}</td>
        </tr>
      ));

  return (
    <Modal
      open
      closable={false}
      footer={null}
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
            style={{ borderCollapse: 'collapse', borderColor: '#EEEEEE' }}
            border="1"
            cellPadding="5"
            cellSpacing="5"
          >
            <tr>
              <th>Order</th>
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
