import React from 'react';
import { Row, Col, Select } from 'antd';

const CalendarHeader = ({ value, onChange }) => {
  const year = value.year();
  const month = value.month();

  const months = value.localeData().monthsShort();

  const years = Array.from({ length: 20 }, (_, i) => year - 10 + i);

  return (
    <Row justify="start" gutter={8}>
      <Col>
        <Select
          popupMatchSelectWidth={false}
          className="my-year-select"
          value={year}
          onChange={(newYear) => onChange(value.clone().year(newYear))}
        >
          {years.map((y) => (
            <Select.Option key={y} value={y} className="year-item">
              {y}
            </Select.Option>
          ))}
        </Select>
      </Col>

      <Col>
        <Select
          popupMatchSelectWidth={false}
          value={month}
          onChange={(m) => onChange(value.clone().month(m))}
        >
          {months.map((label, i) => (
            <Select.Option key={i} value={i} className="month-item">
              {label}
            </Select.Option>
          ))}
        </Select>
      </Col>
    </Row>
  );
};

export default CalendarHeader;
