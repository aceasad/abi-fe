import {
  GET_USERS,
  SET_USERS,
  SET_USERS_LOADING,
  SET_USERS_PAGE,
  CREATE_USER,
  DELETE_USER,
  SET_SINGLE_USER_LOADING,
  UPDATE_USER,
  GET_SINGLE_USER,
  SET_SINGLE_USER,
  UPDATE_CURRENT_USER,
} from '../constants/User';

export const getUsers = () => ({
  type: GET_USERS,
});

export const setUsers = (payload) => ({
  type: SET_USERS,
  payload,
});

export const setUsersLoading = (payload) => ({
  type: SET_USERS_LOADING,
  payload,
});

export const setUsersPage = (payload) => ({
  type: SET_USERS_PAGE,
  payload,
});

export const createUser = (payload) => ({
  type: CREATE_USER,
  payload,
});

export const updateUser = (payload) => ({
  type: UPDATE_USER,
  payload,
});

export const deleteUser = (payload) => ({
  type: DELETE_USER,
  payload,
});

export const setUsersSingleLoading = (payload) => ({
  type: SET_SINGLE_USER_LOADING,
  payload,
});

export const getSingleUser = (payload) => ({
  type: GET_SINGLE_USER,
  payload,
});

export const setSingleUser = (payload) => ({
  type: SET_SINGLE_USER,
  payload,
});

export const updateCurrentUser = (payload) => {
  return {
    type: UPDATE_CURRENT_USER,
    payload,
  };
};
