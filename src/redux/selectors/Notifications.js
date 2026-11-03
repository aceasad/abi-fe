import { createSelector } from 'reselect';
import { getVisibleUnreadNotificationCount } from 'utils/notificationVisibility';

export const makeSelectNotifications = () => (state) => state.notifications?.notifications || [];

export const makeSelectUnreadCount = () => (state) => state.notifications?.unreadCount || 0;

const selectNotificationsState = (state) => state.notifications || {};

export const selectVisibleUnreadNotificationCount = createSelector(
    [selectNotificationsState],
    ({
        bookingNotifications = [],
        offTopicNotifications = [],
        humanInterventionNotifications = [],
        notifications = [],
    }) =>
        getVisibleUnreadNotificationCount({
            bookingNotifications,
            offTopicNotifications,
            humanInterventionNotifications,
            notifications,
        })
);

export const makeSelectVisibleUnreadCount = () => selectVisibleUnreadNotificationCount;

export const makeSelectNotificationsLoading = () => (state) => state.notifications?.loading || false;

export const makeSelectNotificationsError = () => (state) => state.notifications?.error || null;

export const makeSelectBookingNotifications = () => (state) => state.notifications?.bookingNotifications || [];

export const makeSelectOffTopicNotifications = () => (state) => state.notifications?.offTopicNotifications || [];

export const makeSelectHumanInterventionNotifications = () => (state) => state.notifications?.humanInterventionNotifications || [];

export const makeSelectFetchLoading = () => (state) => state.notifications?.fetchLoading || false;

export const makeSelectMarkReadLoading = () => (state) => state.notifications?.markReadLoading || false;

export const makeSelectMarkAllReadLoading = () => (state) => state.notifications?.markAllReadLoading || false; 