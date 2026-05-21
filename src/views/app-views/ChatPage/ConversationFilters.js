import React, { useState, useMemo, useEffect } from 'react';
import { Button, Dropdown, Tag, Radio } from 'antd';
import {
  PlusOutlined,
  ArrowLeftOutlined,
  FilterOutlined,
  RightOutlined,
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { CHAT_FILTERS, FILTER_ATTRIBUTES } from 'constants/ChatConstants';

const ConversationFilters = ({
  value,
  onChange,
  showPatientLocationFilter = true,
  patientLocationOptions = [],
}) => {
  const { PASProvider } = useSelector((state) => state.auth.user || {});
  const isMedbridge = PASProvider?.toLowerCase() === 'medbridge';
  const [pickerOpen, setPickerOpen] = useState(false);
  const [editingAttribute, setEditingAttribute] = useState(null);
  const [draftValue, setDraftValue] = useState(null);

  const STATUS_OPTIONS = useMemo(
    () => [
      { value: CHAT_FILTERS.BOOKED, label: "Scheduled" },
      { value: CHAT_FILTERS.RESCHEDULED, label: "Rescheduled" },
      { value: CHAT_FILTERS.CANCELLED, label: "Cancelled" },
      { value: CHAT_FILTERS.NO_RESPONSE, label: "No Response" },
      { value: CHAT_FILTERS.ASKED_QUESTION, label: "Asked Question" },
      {
        value: CHAT_FILTERS.HUMAN_INTERVENTION_REQUIRED,
        label: "Human intervention required",
      },
      {
        value: CHAT_FILTERS.IN_EMERGENCY_SITUATION,
        label: "In emergency situation",
      },
      { value: CHAT_FILTERS.DECLINED, label: "Declined" },
      {
        value: CHAT_FILTERS.SCREENED_ELSEWHERE,
        label: isMedbridge
          ? "Study taken elsewhere"
          : "Screened Elsewhere",
      },
      { value: CHAT_FILTERS.INCOMPLETE, label: "Incomplete" },
      { value: CHAT_FILTERS.INVITED, label: "Invited" },
      { value: CHAT_FILTERS.REMINDED, label: "Reminded" },
      { value: CHAT_FILTERS.SNOOZED, label: "Snoozed" },
      { value: CHAT_FILTERS.FAILED, label: "Failed" },
    ],
    [isMedbridge]
  );

  const ATTRIBUTES = useMemo(() => {
    const attrs = {
      [FILTER_ATTRIBUTES.STATUS]: {
        label: "Status",
        getOptions: () => STATUS_OPTIONS,
      },
    };
    if (showPatientLocationFilter && patientLocationOptions.length > 0) {
      attrs[FILTER_ATTRIBUTES.LOCATION] = {
        label: "Patient location",
        getOptions: () => patientLocationOptions,
      };
    }
    return attrs;
  }, [STATUS_OPTIONS, showPatientLocationFilter, patientLocationOptions]);

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
          {"All"}
        </div>
      );
    }

    return (
      <>
        <div className="conversation-filters-panel-eyebrow">
          {"Add filter"}
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
              {"Cancel"}
            </Button>
            <Button size="small" type="primary" onClick={applyDraft}>
              {"Apply"}
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
          {hasFilters ? null : "Add filter"}
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
          {"Clear all"}
        </Button>
      )}
    </div>
  );
};

export default ConversationFilters;
