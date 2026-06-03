export const HIDDEN_NOTIFICATION_TITLES = ['Patient Intake Form Incomplete'];

export const HUMAN_INTERVENTION_NOTIFICATION_TYPES = [
    'Emergency Situation',
    'Human Intervention',
    'Opt out',
    'Screened Elsewhere',
    'Decline',
    'Snoozed',
];

export const isVisibleNotification = (notification) =>
    notification && !HIDDEN_NOTIFICATION_TITLES.includes(notification.title);

export const isVisibleUnreadNotification = (notification) =>
    isVisibleNotification(notification) && !notification.is_read;

const countVisibleBookingUnread = (bookingNotifications, allNotifications) => {
    if (bookingNotifications.length > 0) {
        return bookingNotifications.filter(isVisibleUnreadNotification).length;
    }
    return allNotifications.filter(
        (n) => n.notification_type === 'booking' && isVisibleUnreadNotification(n)
    ).length;
};

const countVisibleOffTopicUnread = (offTopicNotifications, allNotifications) => {
    if (offTopicNotifications.length > 0) {
        return offTopicNotifications.filter(isVisibleUnreadNotification).length;
    }
    return allNotifications.filter(
        (n) => ['off_topic', 'general'].includes(n.notification_type) && isVisibleUnreadNotification(n)
    ).length;
};

const countVisibleHumanInterventionUnread = (allNotifications) =>
    allNotifications.filter(
        (n) =>
            isVisibleUnreadNotification(n) &&
            HUMAN_INTERVENTION_NOTIFICATION_TYPES.includes(n.notification_type)
    ).length;

export const getVisibleUnreadNotificationCount = ({
    bookingNotifications = [],
    offTopicNotifications = [],
    notifications = [],
}) =>
    countVisibleBookingUnread(bookingNotifications, notifications) +
    countVisibleOffTopicUnread(offTopicNotifications, notifications) +
    countVisibleHumanInterventionUnread(notifications);
