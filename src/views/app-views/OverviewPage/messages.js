import { defineMessages } from 'react-intl';

export const scope = 'overview_page';

export default defineMessages({
  title: {
    id: `${scope}.title`,
    defaultMessage: 'Overview',
  },
  selectToday: {
    id: `${scope}.select.today`,
    defaultMessage: 'Today',
  },
  selectWeek: {
    id: `${scope}.select.week`,
    defaultMessage: 'Last week',
  },
  selectMonth: {
    id: `${scope}.select.month`,
    defaultMessage: 'Last month',
  },
  selectYear: {
    id: `${scope}.select.year`,
    defaultMessage: 'Last year',
  },
  bookingTitle: {
    id: `${scope}.booking.title`,
    defaultMessage: 'Booking',
  },
  asaDataTitle: {
    id: `${scope}.asa_data.title`,
    defaultMessage: 'Asa data',
  },
  uptakeTitle: {
    id: `${scope}.uptake.title`,
    defaultMessage: 'Uptake',
  },
  appointmentsTitle: {
    id: `${scope}.appointments.title`,
    defaultMessage: 'Appointments',
  },
  bookingAfterInvite: {
    id: `${scope}.booking.after_invite`,
    defaultMessage: 'Bookings made after sending invite',
  },
  bookingEfficiency: {
    id: `${scope}.booking.efficiency`,
    defaultMessage: 'Booking efficiency ',
  },
  bookingInvitation: {
    id: `${scope}.booking.invitation_rate`,
    defaultMessage: 'Invitation rate',
  },
  asaDataEfficiency: {
    id: `${scope}.asa_data.efficiency`,
    defaultMessage: 'Asa efficiency',
  },
  asaDataRevenueSaved: {
    id: `${scope}.asa_data.revenue_saved`,
    defaultMessage: 'Revenue saved due to Asa',
  },
  uptakeProportion: {
    id: `${scope}.uptake.proportion`,
    defaultMessage: 'Uptake',
  },
  uptakeCoverageProportion: {
    id: `${scope}.uptake.coverage_proportion`,
    defaultMessage: 'Coverage',
  },
  uptakeAverage: {
    id: `${scope}.uptake.average`,
    defaultMessage: 'Uptake - country average',
  },
  uptakeCoverageAverage: {
    id: `${scope}.uptake.coverage_average`,
    defaultMessage: 'Coverage - country average',
  },
  appointmentsMissed: {
    id: `${scope}.appointments.missed`,
    defaultMessage: 'Missed appointments: Screening',
  },
  appointmentsCostOfMissed: {
    id: `${scope}.appointments.cost_of_missed`,
    defaultMessage: 'Cost of missed appointments',
  },
  appointmentsPreferences: {
    id: `${scope}.appointments.preferences`,
    defaultMessage: 'Patient appointment preferences',
  },
  appointmentsChartMorning: {
    id: `${scope}.appointments.chart.morning`,
    defaultMessage: 'Morning',
  },
  appointmentsChartAfternoon: {
    id: `${scope}.appointments.chart.afternoon`,
    defaultMessage: 'Afternoon',
  },
  appointmentsChartEvening: {
    id: `${scope}.appointments.chart.evening`,
    defaultMessage: 'Evening',
  },
  appointmentsChartMon: {
    id: `${scope}.appointments.chart.mon`,
    defaultMessage: 'Mon',
  },
  appointmentsChartTue: {
    id: `${scope}.appointments.chart.tue`,
    defaultMessage: 'Tue',
  },
  appointmentsChartWed: {
    id: `${scope}.appointments.chart.wed`,
    defaultMessage: 'Wed',
  },
  appointmentsChartThur: {
    id: `${scope}.appointments.chart.thur`,
    defaultMessage: 'Thur',
  },
  appointmentsChartFri: {
    id: `${scope}.appointments.chart.fri`,
    defaultMessage: 'Fri',
  },
  appointmentsChartSat: {
    id: `${scope}.appointments.chart.sat`,
    defaultMessage: 'Sat',
  },
  appointmentsChartSun: {
    id: `${scope}.appointments.chart.sun`,
    defaultMessage: 'Sun',
  },
  listAttention: {
    id: `${scope}.list.attention`,
    defaultMessage: 'Messages requiring immediate attention',
  },
  listScreening: {
    id: `${scope}.list.screening`,
    defaultMessage: 'Screening invite messages sent',
  },
  listSeeAll: {
    id: `${scope}.list.see_all`,
    defaultMessage: 'See all',
  },
  tableTitle: {
    id: `${scope}.table.title`,
    defaultMessage: 'Appointments likely to be missed',
  },
  tableColumnPatient: {
    id: `${scope}.table.column.patient`,
    defaultMessage: 'Patient',
  },
  tableColumnAppointment: {
    id: `${scope}.table.column.appointment`,
    defaultMessage: 'Appointment',
  },
  tableColumnDate: {
    id: `${scope}.table.column.date`,
    defaultMessage: 'Date',
  },
  tableColumnTime: {
    id: `${scope}.table.column.time`,
    defaultMessage: 'Time',
  },
  tableColumnWhitelisted: {
    id: `${scope}.table.column.whitelisted`,
    defaultMessage: 'Whitelisted',
  },
  tableColumnNoShowScore: {
    id: `${scope}.table.column.no_show_score`,
    defaultMessage: 'No Show Score',
  },
  tableColumnStatus: {
    id: `${scope}.table.column.status`,
    defaultMessage: 'Status',
  },
  tableDropdownTitle: {
    id: `${scope}.table.dropdown.title`,
    defaultMessage: 'Contact',
  },
  tableDropdownSeeAppointment: {
    id: `${scope}.table.dropdown.see_appointment`,
    defaultMessage: 'See Appointment',
  },
  tableDropdownAiReachout: {
    id: `${scope}.table.dropdown.reachout`,
    defaultMessage: 'AI Reachout',
  },
  asaEfficiencyTooltip: {
    id: `${scope}.asa_data.tooltip.asa_efficiency`,
    defaultMessage: 'ASA Efficiency',
  },
  revenueSavedTooltip: {
    id: `${scope}.asa_data.tooltip.revenue_saved`,
    defaultMessage: 'Revenue saved due to ASA',
  },
  appointmentsMissedTooltip: {
    id: `${scope}.appointments.tooltip.missed`,
    defaultMessage: 'Missed appointments: Screening',
  },
  appointmentsCostOfMissedTooltip: {
    id: `${scope}.appointments.tooltip.cost_of_missed`,
    defaultMessage: 'Cost of missed appointments',
  },
  uptakeProportionTooltip: {
    id: `${scope}.uptake.tooltip.proportion`,
    defaultMessage: 'Uptake',
  },
  uptakeCoverageProportionTooltip: {
    id: `${scope}.uptake.tooltip.coverage_proportion`,
    defaultMessage: 'Coverage',
  },
  uptakeAverageTooltip: {
    id: `${scope}.uptake.tooltip.average`,
    defaultMessage: 'Uptake - country average',
  },
  uptakeCoverageAverageTooltip: {
    id: `${scope}.uptake.tooltip.coverage_average`,
    defaultMessage: 'Coverage - country average',
  },
  bookingAfterInviteTooltip: {
    id: `${scope}.booking.tooltip.after_invite`,
    defaultMessage: 'Bookings made after sending invite',
  },
  bookingEfficiencyTooltip: {
    id: `${scope}.booking.tooltip.efficiency`,
    defaultMessage: 'Booking efficiency ',
  },
  bookingInvitationTooltip: {
    id: `${scope}.booking.tooltip.invitation_rate`,
    defaultMessage: 'Invitation rate',
  },
});
