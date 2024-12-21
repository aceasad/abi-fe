import {
  Col,
  PageHeader,
  Row,
  Select,
  Typography,
  Tabs,
  Card,
  Layout,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import messages from './messages';
import GroupCollapse from './Groups/GroupCollapse';
import Booking from './Groups/Booking';
import Appointments from './Groups/Appointments';
import AbiData from './Groups/AbiData';
import Uptake from './Groups/Uptake';
import ClinicStats from './Groups/ClinicStats';
import { useDispatch } from 'react-redux';
import { getOverviewClinicStatsData } from 'redux/actions/Overview';

import {
  SHOW_KPIS,
} from 'configs/AppConfig';

const { Option } = Select;

const KpisPage = () => {
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();

  // Function to get the last 12 months as an array of objects
  const getLast12Months = () => {
    const months = [];
    const currentDate = new Date();
    // Array of month names (index corresponds to month number, e.g., January is 0, February is 1, etc.)
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    // Get the month number (e.g., "November" -> 11)
    const currentYear = currentDate.getFullYear();

    // Loop to get the last 12 months, including the current one
    for (let i = 0; i < 12; i++) {
      const monthIndex = currentDate.getMonth() - i;
      // Calculate correct month and adjust year if necessary
      const adjustedDate = new Date(currentYear, monthIndex);

      const monthName = adjustedDate.toLocaleString('default', { month: 'long' }); // Get the full month name
      const month = (adjustedDate.getMonth() + 1).toString().padStart(2, '0'); // Ensure month is 2 digits
      const formattedDate = `${adjustedDate.getFullYear()}-${month}-01`;

      months.push({
        value: formattedDate, // Month name used as value
        label: monthName // Month name also used as label
      });
    }

    return months; // Return months in descending order (starting with the current month)
  };


  const filters = [
    { value: 'All', label: 'All' },
    ...getLast12Months(),
  ];
  const [filterValue, setFilterValue] = useState(filters[0].value);

  useEffect(() => {
    if (SHOW_KPIS) {
      // dispatch(getOverviewData({ interval: filterValue }));
      var month = null
      if (filterValue == 'All') {
        var month = null
      } else {
        console.log(filterValue)
        month = filterValue
        // month = convertMonthToDate(filterValue)
      }
      dispatch(getOverviewClinicStatsData({ month: month }))
    }
  }, [dispatch, filterValue]);

  return (
    <>
      <PageHeader
        className="p-0 mb-4"
        title={
          <Typography.Title level={2} className="mb-0">
            {'Key Performance Indicators'}
          </Typography.Title>
        }
      />
      <Layout>
        <Card>
          {SHOW_KPIS && (
            <>
              <Row>
                <Select
                  key="0"
                  style={{ width: 120 }}
                  onChange={setFilterValue}
                  value={filterValue}
                >
                  {filters.map((item, index) => (
                    <Option key={index} value={item.value}>
                      {item.label}
                    </Option>
                  ))}
                </Select>
              </Row>
              <Row gutter={48}>
                <Col span={24} className="mt-4">
                  <GroupCollapse
                    startOpen
                    // title={formatMessage(messages.clinicStatsTitle)}
                    group={<ClinicStats title={formatMessage(messages.bookingTitle)} />}
                  />


                  {/* <GroupCollapse
              startOpen
              title={formatMessage(messages.bookingTitle)}
              group={<Booking title={formatMessage(messages.bookingTitle)} />}
            />
            <GroupCollapse
              startOpen
              title={formatMessage(messages.asaDataTitle)}
              group={<AbiData title={formatMessage(messages.asaDataTitle)} />}
            />
            <GroupCollapse
              title={formatMessage(messages.uptakeTitle)}
              group={<Uptake title={formatMessage(messages.uptakeTitle)} />}
            />
            <GroupCollapse
              startOpen
              title={formatMessage(messages.appointmentsTitle)}
              group={
                <Appointments
                  title={formatMessage(messages.appointmentsTitle)}
                />
              }
            />
           */}
                </Col>
              </Row>
            </>
          )}
        </Card>
      </Layout>
    </>
  );
};

export default KpisPage;
