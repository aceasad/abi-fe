// Action Types
export const FETCH_UNREAD_NOTIFICATIONS = 'FETCH_UNREAD_NOTIFICATIONS';
export const MARK_NOTIFICATION_AS_READ = 'MARK_NOTIFICATION_AS_READ';
export const MARK_NOTIFICATION_AS_READ_SAGA = 'MARK_NOTIFICATION_AS_READ_SAGA';
export const MARK_ALL_NOTIFICATIONS_AS_READ = 'MARK_ALL_NOTIFICATIONS_AS_READ';
export const FETCH_NOTIFICATION_DASHBOARD = 'FETCH_NOTIFICATION_DASHBOARD';

// Sync Actions
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

export const fetchNotificationDashboard = () => ({
    type: FETCH_NOTIFICATION_DASHBOARD,
}); 