import React, { useState, useMemo, useEffect } from 'react';
import { Button, Dropdown, Tag, Checkbox, Space } from 'antd';
import { PlusOutlined, ArrowLeftOutlined, FilterOutlined } from '@ant-design/icons';
import { useIntl } from 'react-intl';
import messages from './messages';
import {
  CHAT_FILTERS,
  FILTER_ATTRIBUTES,
  MOCK_PATIENT_LOCATIONS,
} from 'constants/ChatConstants';

const MAX_CHIP_VALUES_PREVIEW = 2;

const ConversationFilters = ({ value, onChange }) => {
  const { formatMessage } = useIntl();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [editingAttribute, setEditingAttribute] = useState(null);
  const [draftValues, setDraftValues] = useState([]);

  const STATUS_OPTIONS = useMemo(
    () => [
      { value: CHAT_FILTERS.BOOKED, label: formatMessage(messages.bookedFilter) },
      { value: CHAT_FILTERS.RESCHEDULED, label: formatMessage(messages.rescheduleFilter) },
      { value: CHAT_FILTERS.CANCELLED, label: formatMessage(messages.cancelledFilter) },
      { value: CHAT_FILTERS.NO_RESPONSE, label: formatMessage(messages.noResponseFilter) },
      { value: CHAT_FILTERS.ASKED_QUESTION, label: formatMessage(messages.askedQuestionFilter) },
      {
        value: CHAT_FILTERS.HUMAN_INTERVENTION_REQUIRED,
        label: formatMessage(messages.humanInterventionRequiredFilter),
      },
      {
        value: CHAT_FILTERS.IN_EMERGENCY_SITUATION,
        label: formatMessage(messages.inEmergencySituationFilter),
      },
      { value: CHAT_FILTERS.DECLINED, label: formatMessage(messages.inDeclinedFilter) },
      {
        value: CHAT_FILTERS.SCREENED_ELSEWHERE,
        label: formatMessage(messages.inScreenedElsewhereFilter),
      },
      { value: CHAT_FILTERS.INCOMPLETE, label: formatMessage(messages.inIncompleteFilter) },
      { value: CHAT_FILTERS.INVITED, label: formatMessage(messages.inInvitedFilter) },
      { value: CHAT_FILTERS.REMINDED, label: formatMessage(messages.inRemindedFilter) },
      { value: CHAT_FILTERS.SNOOZED, label: formatMessage(messages.inSnoozedFilter) },
      { value: CHAT_FILTERS.FAILED, label: formatMessage(messages.inFailedFilter) },
    ],
    [formatMessage]
  );

  const ATTRIBUTES = useMemo(
    () => ({
      [FILTER_ATTRIBUTES.STATUS]: {
        label: formatMessage(messages.filterAttributeStatus),
        getOptions: () => STATUS_OPTIONS,
      },
      [FILTER_ATTRIBUTES.LOCATION]: {
        label: formatMessage(messages.filterAttributeLocation),
        getOptions: () => MOCK_PATIENT_LOCATIONS,
      },
    }),
    [formatMessage, STATUS_OPTIONS]
  );

  const resetPicker = () => {
    setEditingAttribute(null);
    setDraftValues([]);
  };

  useEffect(() => {
    if (!pickerOpen) {
      resetPicker();
    }
  }, [pickerOpen]);

  const openAttributeForEdit = (attributeId) => {
    const existing = value.find((f) => f.attribute === attributeId);
    setDraftValues(existing ? [...existing.values] : []);
    setEditingAttribute(attributeId);
    setPickerOpen(true);
  };

  const toggleDraftValue = (optionValue) => {
    setDraftValues((prev) =>
      prev.includes(optionValue)
        ? prev.filter((v) => v !== optionValue)
        : [...prev, optionValue]
    );
  };

  const applyDraft = () => {
    const withoutCurrent = value.filter((f) => f.attribute !== editingAttribute);
    const next =
      draftValues.length > 0
        ? [...withoutCurrent, { attribute: editingAttribute, values: draftValues }]
        : withoutCurrent;
    onChange(next);
    setPickerOpen(false);
  };

  const removeFilter = (attributeId) => {
    onChange(value.filter((f) => f.attribute !== attributeId));
  };

  const clearAll = () => {
    onChange([]);
  };

  const getOptionLabel = (attributeId, optionValue) => {
    const options = ATTRIBUTES[attributeId]?.getOptions() || [];
    const option = options.find((o) => o.value === optionValue);
    return option ? option.label : optionValue;
  };

  const getChipLabel = (filter) => {
    const attrLabel = ATTRIBUTES[filter.attribute]?.label || filter.attribute;
    const previewValues = filter.values
      .slice(0, MAX_CHIP_VALUES_PREVIEW)
      .map((v) => getOptionLabel(filter.attribute, v));
    const overflow = filter.values.length - MAX_CHIP_VALUES_PREVIEW;
    const valuesText =
      overflow > 0
        ? `${previewValues.join(', ')} +${overflow}`
        : previewValues.join(', ');
    return `${attrLabel}: ${valuesText}`;
  };

  const renderAttributeList = () => {
    const usedAttributeIds = value.map((f) => f.attribute);
    const availableAttributes = Object.entries(ATTRIBUTES).filter(
      ([id]) => !usedAttributeIds.includes(id)
    );

    if (availableAttributes.length === 0) {
      return (
        <div style={{ padding: '12px 16px', color: '#888', fontSize: 13 }}>
          {formatMessage(messages.allFilter)}
        </div>
      );
    }

    return (
      <div style={{ padding: '4px 0', minWidth: 200 }}>
        <div
          style={{
            padding: '8px 16px 4px',
            fontSize: 12,
            color: '#888',
            textTransform: 'uppercase',
            letterSpacing: 0.5,
          }}
        >
          {formatMessage(messages.addFilter)}
        </div>
        {availableAttributes.map(([id, config]) => (
          <div
            key={id}
            onClick={() => openAttributeForEdit(id)}
            style={{
              padding: '8px 16px',
              cursor: 'pointer',
              fontSize: 14,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            {config.label}
          </div>
        ))}
      </div>
    );
  };

  const renderValuePicker = () => {
    const config = ATTRIBUTES[editingAttribute];
    if (!config) return null;
    const options = config.getOptions();

    return (
      <div style={{ minWidth: 240 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '8px 12px',
            borderBottom: '1px solid #f0f0f0',
            gap: 8,
          }}
        >
          <Button
            type="text"
            size="small"
            icon={<ArrowLeftOutlined />}
            onClick={resetPicker}
          />
          <span style={{ fontWeight: 600, fontSize: 13 }}>{config.label}</span>
        </div>
        <div style={{ maxHeight: 260, overflowY: 'auto', padding: '4px 0' }}>
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => toggleDraftValue(option.value)}
              style={{
                padding: '6px 16px',
                cursor: 'pointer',
                fontSize: 14,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = 'transparent')
              }
            >
              <Checkbox
                checked={draftValues.includes(option.value)}
                onClick={(e) => e.stopPropagation()}
                onChange={() => toggleDraftValue(option.value)}
              />
              <span>{option.label}</span>
            </div>
          ))}
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            padding: '8px 12px',
            borderTop: '1px solid #f0f0f0',
            gap: 8,
          }}
        >
          <Button size="small" onClick={() => setPickerOpen(false)}>
            {formatMessage(messages.cancelButton)}
          </Button>
          <Button size="small" type="primary" onClick={applyDraft}>
            {formatMessage(messages.applyFilter)}
          </Button>
        </div>
      </div>
    );
  };

  const dropdownContent = (
    <div
      style={{
        background: '#fff',
        borderRadius: 6,
        boxShadow: '0 6px 16px rgba(0, 0, 0, 0.08), 0 3px 6px rgba(0, 0, 0, 0.05)',
        overflow: 'hidden',
      }}
    >
      {editingAttribute ? renderValuePicker() : renderAttributeList()}
    </div>
  );

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 6,
      }}
    >
      <Dropdown
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        trigger={['click']}
        placement="bottomLeft"
        dropdownRender={() => dropdownContent}
      >
        <Button
          size="small"
          icon={value.length === 0 ? <FilterOutlined /> : <PlusOutlined />}
          onClick={() => {
            if (!pickerOpen) {
              resetPicker();
            }
          }}
        >
          {value.length === 0
            ? formatMessage(messages.addFilter)
            : null}
        </Button>
      </Dropdown>

      {value.map((filter) => (
        <Tag
          key={filter.attribute}
          closable
          onClose={(e) => {
            e.preventDefault();
            removeFilter(filter.attribute);
          }}
          onClick={() => openAttributeForEdit(filter.attribute)}
          style={{
            cursor: 'pointer',
            margin: 0,
            padding: '2px 8px',
            fontSize: 13,
            borderRadius: 4,
          }}
        >
          {getChipLabel(filter)}
        </Tag>
      ))}

      {value.length > 1 && (
        <Button
          type="link"
          size="small"
          onClick={clearAll}
          style={{ padding: '0 4px', fontSize: 12 }}
        >
          {formatMessage(messages.clearAllFilters)}
        </Button>
      )}
    </div>
  );
};

export default ConversationFilters;
