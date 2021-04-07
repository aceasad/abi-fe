import { GET_USERS, SET_USERS } from '../constants/User';

export const getUsers = () => ({
  type: GET_USERS,
});

export const setUsers = (payload) => ({
  type: SET_USERS,
  payload,
});
