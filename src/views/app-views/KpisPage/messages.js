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
  clinicStatsTitle: {
    id: `${scope}.clinicstats.title`,
    defaultMessage: 'Clinic Statistics',
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
  clinicStatsPatientEnrolled: {
    id: `${scope}.clinicstats.total_patients_added`,
    defaultMessage: 'Patient Invited',
  },
  clinicStatsInvitesRecieved: {
    id: `${scope}.clinicstats.patients_invite_recieved`,
    defaultMessage: 'Invites recieved by patients',
  },
  clinicStatsAlreadyScreened: {
    id: `${scope}.clinicstats.AlreadyScreened`,
    defaultMessage: ' Screened elsewhere',
  },
  clinicStatsSnoozed: {
    id: `${scope}.clinicstats.clinicStatsSnoozed`,
    defaultMessage: 'Snoozed',
  },
  clinicStatsOpenConversation: {
    id: `${scope}.clinicstats.openconversation`,
    defaultMessage: 'Patients Engaged',
  },
  clinicStatsBookings: {
    id: `${scope}.clinicstats.bookings`,
    defaultMessage: 'Bookings',
  },
  clnincStatsInvitationRate: {
    id: `${scope}.clinicstats.invitationrate`,
    defaultMessage: 'Engagement Rate',
  },
  clinicStatsDecline: {
    id: `${scope}.clinicstats.decline`,
    defaultMessage: 'Declines',
  },
  clinicStatsCommunicationFlow: {
    id: `${scope}.clinicstats.communication_flow`,
    defaultMessage: 'Patient communication flow',
  },
  clinicStatsBookingRate: {
    id: `${scope}.clinicstats.booking_rate`,
    defaultMessage: 'Booking rate',
  },
  clinicStatsFailedPrefix: {
    id: `${scope}.clinicstats.failed_prefix`,
    defaultMessage: 'Failed',
  },
  clinicStatsDeliveredPrefix: {
    id: `${scope}.clinicstats.delivered_prefix`,
    defaultMessage: 'Delivered',
  },
  clinicStatsFailedMessageDetail: {
    id: `${scope}.clinicstats.failed_message_detail`,
    defaultMessage: 'Message failed',
  },
  clinicStatsFailedUnengagedDetail: {
    id: `${scope}.clinicstats.failed_unengaged_detail`,
    defaultMessage: 'Unengaged',
  },
  clinicStatsAppointmentOutcomes: {
    id: `${scope}.clinicstats.appointment_outcomes`,
    defaultMessage: 'Appointment outcomes',
  },
  clinicStatsInterventionTitle: {
    id: `${scope}.clinicstats.intervention_title`,
    defaultMessage: 'Intervention & special cases',
  },
  clinicStatsEngagement: {
    id: `${scope}.clinicstats.engagement`,
    defaultMessage: 'Engagement',
  },
  clinicStatsAfterHours: {
    id: `${scope}.clinicstats.after_hours`,
    defaultMessage: 'After hours',
  },
  clinicStatsBookingsAfterHours: {
    id: `${scope}.clinicstats.bookings_after_hours`,
    defaultMessage: 'Bookings made after hours',
  },
  clinicStatsBookingsMade: {
    id: `${scope}.clinicstats.bookings_made`,
    defaultMessage: 'Bookings made',
  },
  clinicStatsPreviousPeriod: {
    id: `${scope}.clinicstats.previous_period`,
    defaultMessage: 'Previous period',
  },
  clinicStatsPriorBucketDetail: {
    id: `${scope}.clinicstats.prior_bucket_detail`,
    defaultMessage: 'Prior: morning {morning}, afternoon {afternoon}, evening {evening}, night {night}',
  },
  clinicStatsInterventionEmergency: {
    id: `${scope}.clinicstats.intervention_emergency`,
    defaultMessage: 'Emergency situation',
  },
  clinicStatsInterventionHuman: {
    id: `${scope}.clinicstats.intervention_human`,
    defaultMessage: 'Human intervention',
  },
  clinicStatsInterventionScreenedElsewhere: {
    id: `${scope}.clinicstats.intervention_screened_elsewhere`,
    defaultMessage: 'Screened elsewhere',
  },
  clinicStatsInterventionScreenedElsewhereMedbridge: {
    id: `${scope}.clinicstats.intervention_screened_elsewhere_medbridge`,
    defaultMessage: 'Study taken elsewhere',
  },
  clinicStatsInterventionDeclined: {
    id: `${scope}.clinicstats.intervention_declined`,
    defaultMessage: 'Declined',
  },
  clinicStatsInterventionOptOut: {
    id: `${scope}.clinicstats.intervention_opt_out`,
    defaultMessage: 'Opt-out',
  },
  clinicStatsInterventionSnoozed: {
    id: `${scope}.clinicstats.intervention_snoozed`,
    defaultMessage: 'Snoozed',
  },
  clinicStatsPriorPatientsLabel: {
    id: `${scope}.clinicstats.prior_patients_label`,
    defaultMessage: 'Prior period (patients): {count}',
  },
  clinicStatsFlowInvited: {
    id: `${scope}.clinicstats.flow_invited`,
    defaultMessage: 'Invited',
  },
  clinicStatsFlowDelivered: {
    id: `${scope}.clinicstats.flow_delivered`,
    defaultMessage: 'Delivered',
  },
  clinicStatsFlowEngaged: {
    id: `${scope}.clinicstats.flow_engaged`,
    defaultMessage: 'Engaged',
  },
  clinicStatsFlowBooked: {
    id: `${scope}.clinicstats.flow_booked`,
    defaultMessage: 'Booked',
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
    defaultMessage: 'Human intervention needed',
  },
  listScreeningInvitesSent: {
    id: `${scope}.list.screeningInvitesSent`,
    defaultMessage: 'Screening invite messages sent',
  },
  listScreeningRemindersPending: {
    id: `${scope}.list.screeningRemindersPending`,
    defaultMessage: 'Screening reminder messages pending',
  },
  listSeeAll: {
    id: `${scope}.list.see_all`,
    defaultMessage: 'See all',
  },
  tableAppointmentsLikelyToBeMissedTitle: {
    id: `${scope}.table.appointments_likely_to_be_missed.title`,
    defaultMessage: 'Appointments likely to be missed',
  },
  tableMessagesRequiringImmediateAttentionTitle: {
    id: `${scope}.table.messages_requiring_immediate_attention.title`,
    defaultMessage: 'Human intervention needed',
  },
  tablePatientProgressTitle: {
    id: `${scope}.table.patient_progress.title`,
    defaultMessage: 'Booking progress',
  },
  tablePassedAppointmentsRequiringImmediateStatusUpdateTitle: {
    id: `${scope}.table.past_appointments_requiring_immediate_status_update.title`,
    defaultMessage: 'Past appointments requiring status update',
  },
  tableAppointmentsRemindersTitle: {
    id: `${scope}.table.appointments_reminders.title`,
    defaultMessage: 'Appointment reminders',
  },
  tableColumnPatient: {
    id: `${scope}.table.column.patient`,
    defaultMessage: 'Patient',
  },
  tableColumnAppointment: {
    id: `${scope}.table.column.appointment`,
    defaultMessage: 'Appointment',
  },
  tableColumnDoctor: {
    id: `${scope}.table.column.doctor`,
    defaultMessage: 'Staff member',
  },
  tableColumnAppointmentDatetime: {
    id: `${scope}.table.column.appointment_datetime`,
    defaultMessage: 'Appointment date/time',
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
  tableColumnReminderTemplate: {
    id: `${scope}.table.column.reminder_template`,
    defaultMessage: 'Reminder',
  },
  tableColumnReminderDatetime: {
    id: `${scope}.table.column.reminder_datetime`,
    defaultMessage: 'Reminder date/time',
  },
  tableColumnReminderStatus: {
    id: `${scope}.table.column.reminder_status`,
    defaultMessage: 'Reminder status',
  },
  tableColumnNoShowScore: {
    id: `${scope}.table.column.no_show_score`,
    defaultMessage: 'No show probability',
  },
  tableColumnStatus: {
    id: `${scope}.table.column.status`,
    defaultMessage: 'Status',
  },
  tableDropdownTitleContact: {
    id: `${scope}.table.dropdown.title.contact`,
    defaultMessage: 'Contact',
  },
  tableDropdownTitleActions: {
    id: `${scope}.table.dropdown.title.actions`,
    defaultMessage: 'Actions',
  },
  tableDropdownSeeAppointment: {
    id: `${scope}.table.dropdown.see_appointment`,
    defaultMessage: 'See appointment',
  },
  tableDropdownAiReachout: {
    id: `${scope}.table.dropdown.reachout`,
    defaultMessage: 'Message',
  },
  tableDropdownPatientInfo: {
    id: `${scope}.table.dropdown.patient_info`,
    defaultMessage: 'Patient info',
  },
  tableDropdownAppointmentInfo: {
    id: `${scope}.table.dropdown.appointment_info`,
    defaultMessage: 'Appointment info',
  },
  tableDropdownPreAppointmentQuestionnaireInfo: {
    id: `${scope}.table.dropdown.pre_appointment_questionnaire_info`,
    defaultMessage: 'Pre-appointment question info',
  },
  tableDropdownUpdateMessageRequiringImmediateAttentionStatus: {
    id: `${scope}.table.dropdown.update_message_requiring_immediate_attention_status`,
    defaultMessage: 'Change status',
  },
  tableDropdownCancelAppointmentReminder: {
    id: `${scope}.table.dropdown.cancel_appointment_reminder`,
    defaultMessage: 'Cancel reminder',
  },
  tableDropdownReverseAppointmentReminderCancellation: {
    id: `${scope}.table.dropdown.reverse_appointment_reminder_cancellation`,
    defaultMessage: 'Reverse reminder cancellation',
  },
  tableDropdownRescheduleAppointmentReminder: {
    id: `${scope}.table.dropdown.reschedule_reminder`,
    defaultMessage: 'Reschedule reminder',
  },
  asaEfficiencyTooltip: {
    id: `${scope}.asa_data.tooltip.asa_efficiency`,
    defaultMessage: 'ASA efficiency',
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
  appointmentsRemindersSelectScheduled: {
    id: `${scope}.appointments.reminders.select.scheduled`,
    defaultMessage: 'Scheduled',
  },
  appointmentsRemindersSelectCancelled: {
    id: `${scope}.appointments.reminders.select.cancelled`,
    defaultMessage: 'Cancelled',
  },
  appointmentsRemindersCancel: {
    id: `${scope}.appointments.reminders.cancel`,
    defaultMessage: 'Cancel appointment reminder',
  },
  appointmentsRemindersReverseCancellation: {
    id: `${scope}.appointments.reminders.reverse_cancellation`,
    defaultMessage: 'Reverse appointment reminder cancellation',
  },
  appointmentsRemindersColumnPatientFullname: {
    id: `${scope}.appointments.reminders.column.patient_fulltime`,
    defaultMessage: 'Patient',
  },
  appointmentsRemindersColumnReminderDatetime: {
    id: `${scope}.appointments.reminders.column.reminder_datetime`,
    defaultMessage: 'Reminder',
  },
  appointmentsRemindersColumnAppointmentDatetime: {
    id: `${scope}.appointments.reminders.column.appointment_datetime`,
    defaultMessage: 'Appointment',
  },
  appointmentsRemindersCancelled: {
    id: `${scope}.appointments.reminders.cancelled`,
    defaultMessage: 'Appointment reminder cancelled',
  },
  appointmentsRemindersCancellationReversed: {
    id: `${scope}.appointments.reminders.cancellation_reversed`,
    defaultMessage: 'Appointment reminder cancellation reversed',
  },
  appointmentsRemindersListTitle: {
    id: `${scope}.appointments.reminders.list_title`,
    defaultMessage: 'Upcoming screening appointment reminders',
  },
  appointmentsRemindersCancelTitle: {
    id: `${scope}.appointments.reminders.cancel_title`,
    defaultMessage: 'Cancel',
  },
  appointmentsRemindersCancelDescription: {
    id: `${scope}.appointments.reminders.cancel_description`,
    defaultMessage: 'Are you sure that you want to cancel {label}?',
  },
  appointmentsRemindersReverseCancellationTitle: {
    id: `${scope}.appointments.reminders.reverse_cancellation_title`,
    defaultMessage: 'Reverse cancellation',
  },
  appointmentsRemindersReverseCancellationDescription: {
    id: `${scope}.appointments.reminders.reverse_cancellation_description`,
    defaultMessage: 'Are you sure that you want to reverse {label}?',
  },
  appointmentsRemindersClose: {
    id: `${scope}.appointments.reminders.close`,
    defaultMessage: 'Close',
  },
  columnTitleTimestamp: {
    id: `${scope}.messages_requiring_immediate_attention.column.title.timestamp`,
    defaultMessage: 'Timestamp',
  },
  columnTitlePatient: {
    id: `${scope}.messages_requiring_immediate_attention.column.title.patient`,
    defaultMessage: 'Patient',
  },
  columnTitleEvent: {
    id: `${scope}.messages_requiring_immediate_attention.column.title.event`,
    defaultMessage: 'Event',
  },
  columnTitleStatus: {
    id: `${scope}.messages_requiring_immediate_attention.column.title.status`,
    defaultMessage: 'Status',
  },
  columnTitlePriority: {
    id: `${scope}.messages_requiring_immediate_attention.column.title.priority`,
    defaultMessage: 'Priority',
  },
  messageRequiringImmediateAttentionFormLabelStatus: {
    id: `${scope}.form.label.message_requiring_immediate_attention_status`,
    defaultMessage: 'Please set the status using the dropdown below',
  },
  messageRequiringImmediateAttentionFormLabelStatusDetails: {
    id: `${scope}.form.label.message_requiring_immediate_attention_status_details`,
    defaultMessage: 'Status details',
  },
  modalTitleUpdateMessageRequiringImmediateAttentionStatus: {
    id: `${scope}.modal.update_message_requiring_immediate_attention_status.title`,
    defaultMessage: 'Change status',
  },
  modalOkTextUpdateMessageRequiringImmediateAttentionStatus: {
    id: `${scope}.modal.update_message_requiring_immediate_attention_status.ok_text`,
    defaultMessage: 'Update',
  },
  modalCancelTextUpdateMessageRequiringImmediateAttentionStatus: {
    id: `${scope}.modal.update_message_requiring_immediate_attention_status.cancel_text`,
    defaultMessage: 'Cancel',
  },
  modalErrorUpdateMessageRequiringImmediateAttentionStatus: {
    id: `${scope}.modal.update_message_requiring_immediate_attention_status.error`,
    defaultMessage: 'Error',
  },
  modalTitlePreAppointmentQuestionnaire: {
    id: `${scope}.modal.pre_appointment_questionnaire.title`,
    defaultMessage: 'Pre-appointment questionnaire patient answers',
  },
  modalOkTextPreAppointmentQuestionnaire: {
    id: `${scope}.modal.pre_appointment_questionnaire.ok_text`,
    defaultMessage: 'Close',
  },
  MessageRequiringImmediateAttentionStatusUpdateSuccess: {
    id: `${scope}.text.update_successfully`,
    defaultMessage: 'Updated Successfully',
  }
});
