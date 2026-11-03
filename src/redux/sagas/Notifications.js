import { takeEvery, takeLatest, put, call, all, fork } from 'redux-saga/effects';
import NotificationService from 'services/NotificationService';
import {
    FETCH_UNREAD_NOTIFICATIONS,
    MARK_NOTIFICATION_AS_READ_SAGA,
    MARK_ALL_NOTIFICATIONS_AS_READ,
    FETCH_NOTIFICATION_DASHBOARD,
} from 'redux/actions/Notifications';
import {
    setNotifications,
    setUnreadCount,
    setNotificationAsRead,
    setAllNotificationsAsRead,
} from 'redux/actions/Notifications';
import { getVisibleUnreadNotificationCount } from 'utils/notificationVisibility';

function* getUnreadNotifications() {
    try {
        const response = yield call(NotificationService.getUnreadNotifications);
        // Extract data from Axios response
        const responseData = response.data || response;
        const notifications = responseData.notifications || [];
        yield put(setNotifications(notifications));
        yield put(setUnreadCount(
            getVisibleUnreadNotificationCount({ notifications })
        ));
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
        yield put({ type: FETCH_NOTIFICATION_DASHBOARD });
        console.log('Saga: All notifications refreshed');
    } catch (error) {
        console.error('Error marking all notifications as read:', error);
    }
}

const extractNotifications = (response) => {
    const responseData = response?.data || response || {};
    if (Array.isArray(responseData)) {
        return responseData;
    }
    return responseData.notifications || responseData.results || [];
};

function* getNotificationDashboard() {
    try {
        const [unreadResponse, bookingResponse, offTopicResponse, humanResponse] = yield all([
            call(NotificationService.getUnreadNotifications),
            call(NotificationService.getBookingNotifications),
            call(NotificationService.getOffTopicNotifications),
            call(NotificationService.getHumanInterventionNotifications),
        ]);
        const notifications = extractNotifications(unreadResponse);
        const bookingNotifications = extractNotifications(bookingResponse);
        const offTopicNotifications = extractNotifications(offTopicResponse);
        const humanInterventionNotifications = extractNotifications(humanResponse);
        yield put(setNotifications(notifications));
        yield put({ type: 'SET_BOOKING_NOTIFICATIONS', payload: bookingNotifications });
        yield put({ type: 'SET_OFF_TOPIC_NOTIFICATIONS', payload: offTopicNotifications });
        yield put({ type: 'SET_HUMAN_INTERVENTION_NOTIFICATIONS', payload: humanInterventionNotifications });
        yield put(setUnreadCount(
            getVisibleUnreadNotificationCount({
                notifications,
                bookingNotifications,
                offTopicNotifications,
                humanInterventionNotifications,
            })
        ));
    } catch (error) {
        console.error('Error fetching notification dashboard:', error);
    }
}

export function* notificationsSaga() {
    yield takeEvery(FETCH_UNREAD_NOTIFICATIONS, getUnreadNotifications);
    yield takeEvery(MARK_NOTIFICATION_AS_READ_SAGA, markNotificationAsReadSaga);
    yield takeEvery(MARK_ALL_NOTIFICATIONS_AS_READ, markAllNotificationsAsReadSaga);
    yield takeLatest(FETCH_NOTIFICATION_DASHBOARD, getNotificationDashboard);
}

export default function* rootSaga() {
    yield all([fork(notificationsSaga)]);
} 