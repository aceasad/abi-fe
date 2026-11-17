import { DatePicker, Segmented, Space } from 'antd';
import { useSelector } from 'react-redux';
import dayjs from 'utils/dayjs';
import { getDateFormatByCountry } from 'utils/helpers';
import { makeSelectClinic } from 'redux/selectors/Clinic';

const { RangePicker } = DatePicker;

export const periodGrainOptions = [
  { label: 'Daily', value: 'day' },
  { label: 'Weekly', value: 'week' },
  { label: 'Monthly', value: 'month' },
];

export function currentMonthRange() {
  return [dayjs().startOf('month'), dayjs().endOf('day')];
}

const BillingPeriodFilter = ({ grain, onGrainChange, range, onRangeChange }) => {
  const clinic = useSelector(makeSelectClinic());
  const datePickerFormat = getDateFormatByCountry(clinic?.country);

  return (
    <Space wrap size="middle" style={{ marginBottom: 16 }}>
      <Segmented options={periodGrainOptions} value={grain} onChange={onGrainChange} />
      <RangePicker
        allowClear={false}
        value={range}
        format={datePickerFormat}
        onChange={(dates) => {
          if (dates && dates[0] && dates[1]) {
            onRangeChange(dates);
          }
        }}
        disabledDate={(current) => current && current > dayjs().endOf('day')}
      />
    </Space>
  );
};

export default BillingPeriodFilter;
