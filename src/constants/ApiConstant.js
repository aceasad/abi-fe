import { env } from 'configs/EnvironmentConfig';

export const API_BASE_URL = 'http://localhost:8001';
export const DEFAULT_PAGINATION_LIMIT = 10;
export const DEFAULT_SMALL_PAGINATION_LIMIT = 5;
export const LARGE_PAGINATION_LIMIT = 50;
export const MAX_PAGINATION_LIMIT = 500;

export const ORDERING = {
  DESC: 'descend',
  ASC: 'ascend',
};

export const WS_CHAT_URL = `ws://${env.SOCKETS_DOMAIN}/ws/chat`;
