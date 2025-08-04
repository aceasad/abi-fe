import NotificationService from 'services/NotificationService';

// Action Types
export const FETCH_NOTIFICATIONS = 'FETCH_NOTIFICATIONS';
export const FETCH_UNREAD_NOTIFICATIONS = 'FETCH_UNREAD_NOTIFICATIONS';
export const MARK_NOTIFICATION_AS_READ = 'MARK_NOTIFICATION_AS_READ';
export const MARK_NOTIFICATION_AS_READ_SAGA = 'MARK_NOTIFICATION_AS_READ_SAGA';
export const MARK_ALL_NOTIFICATIONS_AS_READ = 'MARK_ALL_NOTIFICATIONS_AS_READ';
export const FETCH_NOTIFICATION_STATS = 'FETCH_NOTIFICATION_STATS';
export const FETCH_BOOKING_NOTIFICATIONS = 'FETCH_BOOKING_NOTIFICATIONS';
export const FETCH_OFF_TOPIC_NOTIFICATIONS = 'FETCH_OFF_TOPIC_NOTIFICATIONS';
export const FETCH_HUMAN_INTERVENTION_NOTIFICATIONS = 'FETCH_HUMAN_INTERVENTION_NOTIFICATIONS';

// Sync Actions
export const addNotification = (notification) => ({
    type: 'ADD_NOTIFICATION',
    payload: notification,
});

export const setNotificationAsRead = (notificationId) => ({
    type: 'MARK_NOTIFICATION_AS_READ',
    payload: notificationId,
});

export const setAllNotificationsAsRead = () => ({
    type: 'MARK_ALL_AS_READ',
});

export const setNotifications = (notifications) => ({
    type: 'SET_NOTIFICATIONS',
    payload: notifications,
});

export const setUnreadCount = (count) => ({
    type: 'SET_UNREAD_COUNT',
    payload: count,
});

// Saga Actions (trigger sagas)
export const fetchNotifications = (params = {}) => ({
    type: FETCH_NOTIFICATIONS,
    payload: params,
});

export const fetchUnreadNotifications = () => ({
    type: FETCH_UNREAD_NOTIFICATIONS,
});

export const markNotificationAsRead = (notificationId) => ({
    type: MARK_NOTIFICATION_AS_READ_SAGA,
    payload: notificationId,
});

export const markAllNotificationsAsRead = () => ({
    type: MARK_ALL_NOTIFICATIONS_AS_READ,
});

export const fetchNotificationStats = () => ({
    type: FETCH_NOTIFICATION_STATS,
});

export const fetchBookingNotifications = () => ({
    type: FETCH_BOOKING_NOTIFICATIONS,
});

export const fetchOffTopicNotifications = () => ({
    type: FETCH_OFF_TOPIC_NOTIFICATIONS,
});

export const fetchHumanInterventionNotifications = () => ({
    type: FETCH_HUMAN_INTERVENTION_NOTIFICATIONS,
}); 