import { Button } from 'antd';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useToggleRasaActivity } from 'queries/shared';
import { toggleRasaActivity, getSingleChat } from 'redux/actions/Chats';
import { makeSelectSingleChatInfo } from 'redux/selectors/Chats';

const ChatStatusIndicators = ({
  onClickMarkHumanRequiredResolved,
  onClickMarkInEmergencySituationResolved,
  onClickOptBackIn,
  chatLoading,
}) => {
  const dispatch = useDispatch();
  const { mutate, isLoading } = useToggleRasaActivity();
  const { chatInfo } = useSelector(makeSelectSingleChatInfo);
  const [humanRequiredLoading, setHumanRequiredLoading] = useState(false);
  const [emergencyLoading, setEmergencyLoading] = useState(false);
  const [optOutLoading, setOptOutLoading] = useState(false);

  useEffect(() => {
    if (!chatLoading) {
      setHumanRequiredLoading(false);
      setEmergencyLoading(false);
      setOptOutLoading(false);
    }
  }, [chatLoading, chatInfo]);

  const onClickMarkHumanRequiredResolvedWrapper = (patient_id) => {
    setHumanRequiredLoading(true);
    onClickMarkHumanRequiredResolved(patient_id);
  };

  const onClickMarkInEmergencySituationResolvedWrapper = (patient_id) => {
    setEmergencyLoading(true);
    onClickMarkInEmergencySituationResolved(patient_id);
  };

  const onClickOptBackInWrapper = (patient_id) => {
    setOptOutLoading(true);
    onClickOptBackIn(patient_id);
  };

  if (chatLoading) {
    return (
      <div className="chat-status-bar">
        <div className="chat-status-indicators" style={{
          padding: '16px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #e9ecef'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '12px',
            padding: '12px',
            backgroundColor: '#f5f5f5',
            borderRadius: '6px',
            border: '1px solid #e0e0e0'
          }}>
            <div style={{
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              backgroundColor: '#e0e0e0',
              marginRight: '8px',
              animation: 'chat-status-pulse 1.5s ease-in-out infinite'
            }} />
            <div style={{
              flex: 1,
              color: '#999',
              fontSize: '14px',
              fontWeight: '500',
              animation: 'chat-status-pulse 1.5s ease-in-out infinite'
            }}>
              Loading patient status...
            </div>
            <div style={{
              width: '120px',
              height: '32px',
              backgroundColor: '#e0e0e0',
              borderRadius: '4px',
              marginLeft: '12px',
              animation: 'chat-status-pulse 1.5s ease-in-out infinite'
            }} />
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '12px',
            padding: '12px',
            backgroundColor: '#f5f5f5',
            borderRadius: '6px',
            border: '1px solid #e0e0e0'
          }}>
            <div style={{
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              backgroundColor: '#e0e0e0',
              marginRight: '8px',
              animation: 'chat-status-pulse 1.5s ease-in-out infinite'
            }} />
            <div style={{
              flex: 1,
              color: '#999',
              fontSize: '14px',
              fontWeight: '500',
              animation: 'chat-status-pulse 1.5s ease-in-out infinite'
            }}>
              Loading emergency status...
            </div>
            <div style={{
              width: '120px',
              height: '32px',
              backgroundColor: '#e0e0e0',
              borderRadius: '4px',
              marginLeft: '12px',
              animation: 'chat-status-pulse 1.5s ease-in-out infinite'
            }} />
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            padding: '12px',
            backgroundColor: '#f5f5f5',
            borderRadius: '6px',
            border: '1px solid #e0e0e0'
          }}>
            <div style={{
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              backgroundColor: '#e0e0e0',
              marginRight: '8px',
              animation: 'chat-status-pulse 1.5s ease-in-out infinite'
            }} />
            <div style={{
              flex: 1,
              color: '#999',
              fontSize: '14px',
              fontWeight: '500',
              animation: 'chat-status-pulse 1.5s ease-in-out infinite'
            }}>
              Loading ASA status...
            </div>
            <div style={{
              width: '100px',
              height: '32px',
              backgroundColor: '#e0e0e0',
              borderRadius: '4px',
              marginLeft: '12px',
              animation: 'chat-status-pulse 1.5s ease-in-out infinite'
            }} />
          </div>
        </div>
      </div>
    );
  }

  if (!chatInfo?.patient) return null;

  const hasAnyStatus =
    chatInfo.patient.is_human_required ||
    chatInfo.patient.is_in_emergency_situation ||
    chatInfo.patient.is_in_opt_out_situation ||
    true;

  if (!hasAnyStatus) return null;

  return (
    <div className="chat-status-bar">
      <div className="chat-status-indicators" style={{
        padding: '16px',
        backgroundColor: '#ffffff',
        borderRadius: '10px',
        border: '1px solid #e9ecef'
      }}>
        {chatInfo.patient.is_human_required && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '12px',
            padding: '12px',
            backgroundColor: '#e3f2fd',
            borderRadius: '8px',
            border: '1px solid #2196f3'
          }}>
            <span style={{
              color: '#1976d2',
              marginRight: '8px',
              fontSize: '16px'
            }}>
              👤
            </span>
            <span style={{
              flex: 1,
              color: '#1976d2',
              fontWeight: '500'
            }}>
              Patient has requested to speak to a human
            </span>
            <Button
              type="primary"
              disabled={isLoading || humanRequiredLoading}
              loading={humanRequiredLoading}
              onClick={() =>
                onClickMarkHumanRequiredResolvedWrapper(chatInfo.patient.id)
              }
              style={{ marginLeft: '12px' }}
            >
              {humanRequiredLoading ? 'Updating...' : 'Mark as Resolved'}
            </Button>
          </div>
        )}

        {chatInfo.patient.is_in_emergency_situation && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '12px',
            padding: '12px',
            backgroundColor: '#ffebee',
            borderRadius: '8px',
            border: '1px solid #f44336'
          }}>
            <span style={{
              color: '#d32f2f',
              marginRight: '8px',
              fontSize: '16px'
            }}>
              ⚠️
            </span>
            <span style={{
              flex: 1,
              color: '#d32f2f',
              fontWeight: '500'
            }}>
              Asa has detected an emergency for this patient
            </span>
            <Button
              type="primary"
              danger
              disabled={isLoading || emergencyLoading}
              loading={emergencyLoading}
              onClick={() =>
                onClickMarkInEmergencySituationResolvedWrapper(
                  chatInfo.patient.id
                )
              }
              style={{ marginLeft: '12px' }}
            >
              {emergencyLoading ? 'Updating...' : 'Mark as Resolved'}
            </Button>
          </div>
        )}

        {chatInfo.patient.is_in_opt_out_situation && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '12px',
            padding: '12px',
            backgroundColor: '#fff3e0',
            borderRadius: '8px',
            border: '1px solid #ff9800'
          }}>
            <span style={{
              color: '#f57c00',
              marginRight: '8px',
              fontSize: '16px'
            }}>
              ⚠️
            </span>
            <span style={{
              flex: 1,
              color: '#f57c00',
              fontWeight: '500'
            }}>
              The patient has opted out
            </span>
            <Button
              type="primary"
              disabled={isLoading || optOutLoading}
              loading={optOutLoading}
              onClick={() =>
                onClickOptBackInWrapper(chatInfo.patient.id)
              }
              style={{ marginLeft: '12px' }}
            >
              {optOutLoading ? 'Updating...' : 'Opt back in'}
            </Button>
          </div>
        )}

        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '12px',
          backgroundColor: chatInfo?.patient?.is_rasa_paused ? '#f3e5f5' : '#e8f5e8',
          borderRadius: '8px',
          border: `1px solid ${chatInfo?.patient?.is_rasa_paused ? '#9c27b0' : '#4caf50'}`
        }}>
          <span style={{
            color: chatInfo?.patient?.is_rasa_paused ? '#7b1fa2' : '#2e7d32',
            marginRight: '8px',
            fontSize: '16px'
          }}>
            🔄
          </span>
          <span style={{
            flex: 1,
            color: chatInfo?.patient?.is_rasa_paused ? '#7b1fa2' : '#2e7d32',
            fontWeight: '500'
          }}>
            {chatInfo?.patient?.is_rasa_paused
              ? 'Asa is paused and will not respond to the patient'
              : 'Asa is active and will respond to the patient'
            }
          </span>
          <Button
            type="primary"
            disabled={isLoading}
            loading={isLoading}
            onClick={() =>
              mutate(chatInfo.patient.id, {
                onSuccess: () => {
                  dispatch(toggleRasaActivity(chatInfo.patient.id));
                  dispatch(getSingleChat({ patientId: chatInfo.patient.id }));
                },
              })
            }
            style={{ marginLeft: '12px' }}
          >
            {isLoading ? 'Updating...' : (chatInfo?.patient?.is_rasa_paused ? 'Unpause Asa' : 'Pause Asa')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatStatusIndicators;
