import { env } from 'configs/EnvironmentConfig';

export const API_BASE_URL = 'http://localhost:8001';
export var DEFAULT_PAGINATION_LIMIT = 10;
export const DEFAULT_SMALL_PAGINATION_LIMIT = 5;
export const LARGE_PAGINATION_LIMIT = 50;
export const MAX_PAGINATION_LIMIT = 500;
export const ALL_CHATS_PAGINATION_LIMIT = 12;
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