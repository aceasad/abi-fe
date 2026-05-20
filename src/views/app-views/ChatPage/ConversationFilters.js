import React, { useState, useMemo, useEffect } from 'react';
import { Button, Dropdown, Tag, Radio } from 'antd';
import {
  PlusOutlined,
  ArrowLeftOutlined,
  FilterOutlined,
  RightOutlined,
} from '@ant-design/icons';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import messages from './messages';
import { CHAT_FILTERS, FILTER_ATTRIBUTES } from 'constants/ChatConstants';

const ConversationFilters = ({
  value,
  onChange,
  showPatientLocationFilter = true,
  patientLocationOptions = [],
}) => {
  const { formatMessage } = useIntl();
  const { PASProvider } = useSelector((state) => state.auth.user || {});
  const isMedbridge = PASProvider?.toLowerCase() === 'medbridge';
  const [pickerOpen, setPickerOpen] = useState(false);
  const [editingAttribute, setEditingAttribute] = useState(null);
  const [draftValue, setDraftValue] = useState(null);

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
        label: formatMessage(
          isMedbridge
            ? messages.inScreenedElsewhereFilterMedbridge
            : messages.inScreenedElsewhereFilter
        ),
      },
      { value: CHAT_FILTERS.INCOMPLETE, label: formatMessage(messages.inIncompleteFilter) },
      { value: CHAT_FILTERS.INVITED, label: formatMessage(messages.inInvitedFilter) },
      { value: CHAT_FILTERS.REMINDED, label: formatMessage(messages.inRemindedFilter) },
      { value: CHAT_FILTERS.SNOOZED, label: formatMessage(messages.inSnoozedFilter) },
      { value: CHAT_FILTERS.FAILED, label: formatMessage(messages.inFailedFilter) },
    ],
    [formatMessage, isMedbridge]
  );

  const ATTRIBUTES = useMemo(() => {
    const attrs = {
      [FILTER_ATTRIBUTES.STATUS]: {
        label: formatMessage(messages.filterAttributeStatus),
        getOptions: () => STATUS_OPTIONS,
      },
    };
    if (showPatientLocationFilter && patientLocationOptions.length > 0) {
      attrs[FILTER_ATTRIBUTES.LOCATION] = {
        label: formatMessage(messages.filterAttributeLocation),
        getOptions: () => patientLocationOptions,
      };
    }
    return attrs;
  }, [formatMessage, STATUS_OPTIONS, showPatientLocationFilter, patientLocationOptions]);

  const resetPicker = () => {
    setEditingAttribute(null);
    setDraftValue(null);
  };

  useEffect(() => {
    if (!pickerOpen) {
      resetPicker();
    }
  }, [pickerOpen]);

  const openAttributeForEdit = (attributeId) => {
    const existing = value.find((f) => f.attribute === attributeId);
    setDraftValue(existing && existing.values.length > 0 ? existing.values[0] : null);
    setEditingAttribute(attributeId);
    setPickerOpen(true);
  };

  // Clicking the active option clears the selection; otherwise it becomes
  // the single selected value. Only one value per attribute is allowed.
  const selectDraftValue = (optionValue) => {
    setDraftValue((prev) => (prev === optionValue ? null : optionValue));
  };

  const applyDraft = () => {
    const withoutCurrent = value.filter((f) => f.attribute !== editingAttribute);
    const next = draftValue
      ? [...withoutCurrent, { attribute: editingAttribute, values: [draftValue] }]
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

  const getChipValuesText = (filter) => {
    if (!filter.values || filter.values.length === 0) return '';
    return getOptionLabel(filter.attribute, filter.values[0]);
  };

  const renderAttributeList = () => {
    const usedAttributeIds = value.map((f) => f.attribute);
    const availableAttributes = Object.entries(ATTRIBUTES).filter(
      ([id]) => !usedAttributeIds.includes(id)
    );

    if (availableAttributes.length === 0) {
      return (
        <div className="conversation-filters-panel-empty">
          {formatMessage(messages.allFilter)}
        </div>
      );
    }

    return (
      <>
        <div className="conversation-filters-panel-eyebrow">
          {formatMessage(messages.addFilter)}
        </div>
        <div className="conversation-filters-panel-list">
          {availableAttributes.map(([id, config]) => (
            <div
              key={id}
              className="conversation-filters-attribute"
              onClick={() => openAttributeForEdit(id)}
            >
              <span style={{ flex: 1 }}>{config.label}</span>
              <RightOutlined />
            </div>
          ))}
        </div>
      </>
    );
  };

  const renderValuePicker = () => {
    const config = ATTRIBUTES[editingAttribute];
    if (!config) return null;
    const options = config.getOptions();

    return (
      <>
        <div className="conversation-filters-panel-header">
          <Button
            type="text"
            size="small"
            icon={<ArrowLeftOutlined />}
            onClick={resetPicker}
          />
          <span className="conversation-filters-panel-title">{config.label}</span>
        </div>
        <div className="conversation-filters-panel-list">
          {options.map((option) => {
            const checked = draftValue === option.value;
            return (
              <div
                key={option.value}
                className={`conversation-filters-option${checked ? ' conversation-filters-option-active' : ''
                  }`}
                onClick={() => selectDraftValue(option.value)}
              >
                <Radio
                  checked={checked}
                  onClick={(e) => e.stopPropagation()}
                  onChange={() => selectDraftValue(option.value)}
                />
                <span>{option.label}</span>
              </div>
            );
          })}
        </div>
        <div className="conversation-filters-panel-footer">
          <div className="conversation-filters-panel-actions">
            <Button size="small" onClick={() => setPickerOpen(false)}>
              {formatMessage(messages.cancelButton)}
            </Button>
            <Button size="small" type="primary" onClick={applyDraft}>
              {formatMessage(messages.applyFilter)}
            </Button>
          </div>
        </div>
      </>
    );
  };

  const dropdownContent = (
    <div className="conversation-filters-panel">
      {editingAttribute ? renderValuePicker() : renderAttributeList()}
    </div>
  );

  const hasFilters = value.length > 0;

  return (
    <div className="conversation-filters">
      <Dropdown
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        trigger={['click']}
        placement="bottomLeft"
        dropdownRender={() => dropdownContent}
      >
        <button
          type="button"
          className={[
            'conversation-filters-trigger',
            hasFilters ? 'conversation-filters-trigger-compact' : '',
            pickerOpen ? 'conversation-filters-trigger-open' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          onClick={() => {
            if (!pickerOpen) {
              resetPicker();
            }
          }}
        >
          {hasFilters ? <PlusOutlined /> : <FilterOutlined />}
          {hasFilters ? null : formatMessage(messages.addFilter)}
        </button>
      </Dropdown>

      {value.map((filter) => (
        <Tag
          key={filter.attribute}
          className="conversation-filter-chip"
          closable
          onClose={(e) => {
            e.preventDefault();
            removeFilter(filter.attribute);
          }}
          onClick={() => openAttributeForEdit(filter.attribute)}
        >
          <span className="conversation-filter-chip-attribute">
            {ATTRIBUTES[filter.attribute]?.label || filter.attribute}
          </span>
          <span className="conversation-filter-chip-separator">·</span>
          <span>{getChipValuesText(filter)}</span>
        </Tag>
      ))}

      {value.length > 1 && (
        <Button
          className="conversation-filters-clear"
          type="link"
          size="small"
          onClick={clearAll}
        >
          {formatMessage(messages.clearAllFilters)}
        </Button>
      )}
    </div>
  );
};

export default ConversationFilters;
