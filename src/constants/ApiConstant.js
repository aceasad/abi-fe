import { env } from 'configs/EnvironmentConfig';

export const API_BASE_URL = 'http://localhost:8001';
export var DEFAULT_PAGINATION_LIMIT = 10;
export const DEFAULT_SMALL_PAGINATION_LIMIT = 5;
export const LARGE_PAGINATION_LIMIT = 50;
export const MAX_PAGINATION_LIMIT = 500;
// Conversations list and search are not paginated; we request all results in
// a single call by sending a limit large enough to cover any clinic's volume.
export const ALL_CHATS_FETCH_LIMIT = 100000;
// Pagination (kept for reference, replaced by ALL_CHATS_FETCH_LIMIT above):
// export const ALL_CHATS_PAGINATION_LIMIT = 100;
// export const CHAT_PAGE_SIZE_OPTIONS = [25, 50, 100, 200, 500];
export const CHAT_MESSAGES_PAGINATION_LIMIT = 15;
export const SET_DEFAULT_PAGINATION_LIMIT = (size) => {
  DEFAULT_PAGINATION_LIMIT = size;
}
export const ORDERING = {
  DESC: 'descend',
  ASC: 'ascend',
};

export const WS_CHAT_URL = env.SOCKETS_DOMAIN;

export const WS_NOTIFICATION_URL = env.SOCKETS_NOTIFICATION_DOMAIN;