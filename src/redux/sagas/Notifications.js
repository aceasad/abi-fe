import { takeEvery, put, call, all, fork } from 'redux-saga/effects';
import NotificationService from 'services/NotificationService';
import {
    FETCH_NOTIFICATIONS,
    FETCH_UNREAD_NOTIFICATIONS,
    MARK_NOTIFICATION_AS_READ_SAGA,
    MARK_ALL_NOTIFICATIONS_AS_READ,
    FETCH_NOTIFICATION_STATS,
    FETCH_BOOKING_NOTIFICATIONS,
    FETCH_OFF_TOPIC_NOTIFICATIONS,
    FETCH_HUMAN_INTERVENTION_NOTIFICATIONS,
} from 'redux/actions/Notifications';
import {
    setNotifications,
    setUnreadCount,
    setNotificationAsRead,
    setAllNotificationsAsRead,
} from 'redux/actions/Notifications';

function* getNotifications({ payload }) {
    try {
        const response = yield call(NotificationService.getNotifications, payload);
        // Extract data from Axios response
        const responseData = response.data || response;
        // Handle both array and object responses
        const notifications = Array.isArray(responseData) ? responseData : (responseData.results || responseData);
        yield put(setNotifications(notifications));
    } catch (error) {
        console.error('Error fetching notifications:', error);
    }
}

function* getUnreadNotifications() {
    try {
        const response = yield call(NotificationService.getUnreadNotifications);
        // Extract data from Axios response
        const responseData = response.data || response;
        yield put(setNotifications(responseData.notifications || []));
        yield put(setUnreadCount(responseData.unread_count || 0));
    } catch (error) {
        console.error('Error fetching unread notifications:', error);
    }
}

function* markNotificationAsReadSaga({ payload }) {
    try {
        console.log('Saga: Marking notification as read:', payload);
        yield call(NotificationService.markNotificationAsRead, payload);
        console.log('Saga: API call successful, dispatching setNotificationAsRead action');
        yield put(setNotificationAsRead(payload));
        console.log('Saga: Action dispatched successfully');
    } catch (error) {
        console.error('Error marking notification as read:', error);
        // Reset loading state on error
        yield put({ type: 'MARK_NOTIFICATION_AS_READ_SAGA_ERROR' });
    }
}

function* markAllNotificationsAsReadSaga() {
    try {
        console.log('Saga: Marking all notifications as read');
        const response = yield call(NotificationService.markAllNotificationsAsRead);
        console.log('Saga: API call successful, dispatching setAllNotificationsAsRead action');
        yield put(setAllNotificationsAsRead());
        console.log('Saga: Refreshing notifications from backend');
        // Refresh notifications from backend to get updated state
        yield put({ type: FETCH_NOTIFICATIONS });
        yield put({ type: FETCH_BOOKING_NOTIFICATIONS });
        yield put({ type: FETCH_OFF_TOPIC_NOTIFICATIONS });
        yield put({ type: FETCH_HUMAN_INTERVENTION_NOTIFICATIONS });
        console.log('Saga: All notifications refreshed');
    } catch (error) {
        console.error('Error marking all notifications as read:', error);
    }
}

function* getNotificationStats() {
    try {
        const response = yield call(NotificationService.getNotificationStats);
        // Extract data from Axios response
        const responseData = response.data || response;
        yield put({
            type: 'SET_NOTIFICATION_STATS',
            payload: responseData,
        });
    } catch (error) {
        console.error('Error fetching notification stats:', error);
    }
}

function* getBookingNotifications() {
    try {
        const response = yield call(NotificationService.getBookingNotifications);
        // Extract data from Axios response
        const responseData = response.data || response;
        // Handle both array and object responses
        const notifications = Array.isArray(responseData) ? responseData : (responseData.notifications || []);
        yield put({
            type: 'SET_BOOKING_NOTIFICATIONS',
            payload: notifications,
        });
    } catch (error) {
        console.error('Error fetching booking notifications:', error);
    }
}

function* getOffTopicNotifications() {
    try {
        const response = yield call(NotificationService.getOffTopicNotifications);
        // Extract data from Axios response
        const responseData = response.data || response;
        // Handle both array and object responses
        const notifications = Array.isArray(responseData) ? responseData : (responseData.notifications || []);
        yield put({
            type: 'SET_OFF_TOPIC_NOTIFICATIONS',
            payload: notifications,
        });
    } catch (error) {
        console.error('Error fetching off-topic notifications:', error);
    }
}

function* getHumanInterventionNotifications() {
    try {
        const response = yield call(NotificationService.getHumanInterventionNotifications);
        console.log('Human intervention notifications response:', response);
        // Extract data from Axios response
        const responseData = response.data || response;
        // Handle both array and object responses
        const notifications = Array.isArray(responseData) ? responseData : (responseData.notifications || []);
        console.log('Extracted notifications:', notifications);
        yield put({
            type: 'SET_HUMAN_INTERVENTION_NOTIFICATIONS',
            payload: notifications,
        });
    } catch (error) {
        console.error('Error fetching human intervention notifications:', error);
    }
}

export function* notificationsSaga() {
    yield takeEvery(FETCH_NOTIFICATIONS, getNotifications);
    yield takeEvery(FETCH_UNREAD_NOTIFICATIONS, getUnreadNotifications);
    yield takeEvery(MARK_NOTIFICATION_AS_READ_SAGA, markNotificationAsReadSaga);
    yield takeEvery(MARK_ALL_NOTIFICATIONS_AS_READ, markAllNotificationsAsReadSaga);
    yield takeEvery(FETCH_NOTIFICATION_STATS, getNotificationStats);
    yield takeEvery(FETCH_BOOKING_NOTIFICATIONS, getBookingNotifications);
    yield takeEvery(FETCH_OFF_TOPIC_NOTIFICATIONS, getOffTopicNotifications);
    yield takeEvery(FETCH_HUMAN_INTERVENTION_NOTIFICATIONS, getHumanInterventionNotifications);
}

export default function* rootSaga() {
    yield all([fork(notificationsSaga)]);
} 