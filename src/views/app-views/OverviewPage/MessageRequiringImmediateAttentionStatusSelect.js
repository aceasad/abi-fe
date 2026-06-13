import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { message } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import {
  updateAppointmentMessageRequiringImmediateAttentionStatus,
  getMessageRequiringImmediateAttentionStatuses,
} from 'redux/actions/Appointment';
import { makeSelectMessageRequiringImmediateAttentionStatuses } from 'redux/selectors/Appointment';
import { MESSAGES_REQUIRING_IMMEDIATE_ATTENTION } from 'redux/reducers/Staff';

// Colors follow the existing overview palette (see PatientProgressTable getProgressColor)
const STATUS_COLORS = {
  pending: '#FF474C', // red
  'in progress': '#FFBF00', // amber
  resolved: '#18D9C5', // green
};

const DEFAULT_STATUS_COLOR = '#8c8c8c';

const getStatusColor = (name) =>
  STATUS_COLORS[(name || '').toLowerCase().trim()] || DEFAULT_STATUS_COLOR;

// "Resolved" opens the "Change status" modal so the user can add status details
const statusNeedsDetails = (name) =>
  (name || '').toLowerCase().trim() === 'resolved';

const MessageRequiringImmediateAttentionStatusSelect = ({
  row,
  onOpenStatusModal,
}) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [hoveredId, setHoveredId] = useState(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0, width: 0 });
  const triggerRef = useRef(null);
  const menuRef = useRef(null);

  // Pull from the same redux source the "Change status" modal uses
  const { messageRequiringImmediateAttentionStatuses } = useSelector(
    makeSelectMessageRequiringImmediateAttentionStatuses()
  );

  // The statuses endpoint may return a paginated object; normalise to an array
  const statusList = Array.isArray(messageRequiringImmediateAttentionStatuses)
    ? messageRequiringImmediateAttentionStatuses
    : messageRequiringImmediateAttentionStatuses?.results || [];

  useEffect(() => {
    if (statusList.length === 0) {
      dispatch(getMessageRequiringImmediateAttentionStatuses());
    }
  }, [dispatch, statusList.length]);

  const currentName = row.status?.name;
  const currentColor = getStatusColor(currentName);

  const updatePosition = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setMenuPos({ top: rect.bottom + 4, left: rect.left, width: rect.width });
  }, []);

  useEffect(() => {
    if (!open) return undefined;

    updatePosition();

    const handleOutsideClick = (event) => {
      if (triggerRef.current?.contains(event.target)) return;
      if (menuRef.current?.contains(event.target)) return;
      setOpen(false);
    };
    const handleReposition = () => setOpen(false);

    document.addEventListener('mousedown', handleOutsideClick);
    window.addEventListener('resize', handleReposition);
    window.addEventListener('scroll', handleReposition, true);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      window.removeEventListener('resize', handleReposition);
      window.removeEventListener('scroll', handleReposition, true);
    };
  }, [open, updatePosition]);

  const toggleOpen = (event) => {
    event.stopPropagation();
    setOpen((prev) => !prev);
  };

  const handleSelectStatus = (status) => {
    setOpen(false);
    if (!status || status.id === row.status?.id) return;

    if (statusNeedsDetails(status.name)) {
      onOpenStatusModal(row, status.id);
      return;
    }

    dispatch(
      updateAppointmentMessageRequiringImmediateAttentionStatus({
        id: row.id,
        status: status.id,
        status_details: row.status_details || null,
        field: MESSAGES_REQUIRING_IMMEDIATE_ATTENTION,
        afterMessageRequiringImmediateAttentionStatusUpdate: () =>
          message.success('Updated Successfully'),
      })
    );
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={toggleOpen}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          gap: 8,
          padding: '4px 11px',
          background: '#fff',
          border: `1px solid ${currentColor}`,
          borderRadius: 6,
          color: currentColor,
          fontWeight: 500,
          fontSize: 14,
          lineHeight: '22px',
          cursor: 'pointer',
        }}
      >
        <span
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {currentName || 'Set status'}
        </span>
        <DownOutlined
          style={{
            fontSize: 10,
            transition: 'transform 0.2s',
            transform: open ? 'rotate(180deg)' : 'none',
          }}
        />
      </button>

      {open &&
        ReactDOM.createPortal(
          <div
            ref={menuRef}
            style={{
              position: 'fixed',
              top: menuPos.top,
              left: menuPos.left,
              minWidth: Math.max(menuPos.width, 160),
              background: '#fff',
              borderRadius: 8,
              boxShadow: '0 6px 16px rgba(0, 0, 0, 0.12)',
              padding: 4,
              zIndex: 1050,
            }}
          >
            {statusList.map((status) => {
              const isCurrent = status.id === row.status?.id;
              return (
                <div
                  key={status.id}
                  onClick={(event) => {
                    event.stopPropagation();
                    handleSelectStatus(status);
                  }}
                  onMouseEnter={() => setHoveredId(status.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: 4,
                    cursor: 'pointer',
                    color: getStatusColor(status.name),
                    fontWeight: 500,
                    background:
                      hoveredId === status.id
                        ? 'rgba(0, 0, 0, 0.04)'
                        : isCurrent
                        ? 'rgba(0, 0, 0, 0.02)'
                        : 'transparent',
                  }}
                >
                  {status.name}
                </div>
              );
            })}
          </div>,
          document.body
        )}
    </>
  );
};

export default MessageRequiringImmediateAttentionStatusSelect;
