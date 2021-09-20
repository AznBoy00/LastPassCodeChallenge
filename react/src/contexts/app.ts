import { call, put, takeLatest } from 'redux-saga/effects';
import authenticateUser, { Response as authResponse } from '../api/auth';

export interface STATE {
  username: string,
  authToken: string,
  privateInfo: string,
  errorMessage: string,
}

// initState
const initState: STATE = {
  username: '',
  authToken: '',
  privateInfo: '',
  errorMessage: '',
};

// actions
export const AUTHENTICATE = 'AUTHENTICATE';
export const AUTHENTICATE_SUCCESS = 'AUTHENTICATE_SUCCESS';
export const AUTHENTICATE_FAIL = 'AUTHENTICATE_FAIL';
export const SAVE_PRIVATE_INFORMATION = 'SAVE_PRIVATE_INFORMATION';
export const LOGOUT = 'LOGOUT';

export interface AuthAction {
  type: string;
  username: string;
  password: string;
}

// authentication base cases
export const authenticate = (username: string, password: string): AuthAction => ({
  type: AUTHENTICATE,
  username,
  password,
});

export interface SavePrivateInfoAction {
  type: string;
  authToken: string;
  privateInfo: string;
}

export const savePrivateInfo = (authToken: string, privateInfo: string): SavePrivateInfoAction => ({
  type: SAVE_PRIVATE_INFORMATION,
  authToken,
  privateInfo,
});

interface AuthSuccessAction {
  type: string;
  data: any;
  username: string;
  authToken: string;
}

// authentication success case
export const authSuccess = (data: any, username: string, authToken: string): AuthSuccessAction => ({
  type: AUTHENTICATE_SUCCESS,
  data,
  username,
  authToken,
});

interface AuthFailAction {
  type: string;
}

// authentication fail case
export const authFail = (): AuthFailAction => ({
  type: AUTHENTICATE_FAIL,
});

export interface LogoutAction {
  type: string;
}

// selector

// logout
export const logout = (): LogoutAction => ({
  type: LOGOUT,
});

// SAGA
export function* handleAuthentication({ username, password }: AuthAction): Iterator<any> {
  try {
    const data = yield call(authenticateUser, username, password);
    var pbkdf2 = require('pbkdf2');
    const authToken = pbkdf2.pbkdf2Sync(password, 'salt', 1, 32, 'sha512');
    if (data !== undefined) {
      yield put(authSuccess(data, username, authToken));
    }
  } catch (e) {
    yield put(authFail());
    throw e;
  }
}

// saga action mapper
export function* saga(): Iterator<any> {
  yield takeLatest(AUTHENTICATE, handleAuthentication);
}

// REDUCER
export default function reducer(state: STATE = initState, action: any): STATE {
  switch (action.type) {
    case AUTHENTICATE_SUCCESS: {
      const { data, username, authToken } = action;
      const privateInfo = () => {
        const localStoragePrivateInfo = localStorage.getItem('privateInfo');
        if (localStoragePrivateInfo) {
          return localStoragePrivateInfo;
        } else {
          return initState.privateInfo;
        }
      }
      if (data.success === true) {
        return {
          ...state,
          username: username,
          authToken: authToken,
          privateInfo: privateInfo(),
        };
      }
      return {
        ...state,
        username: initState.username,
        authToken: initState.authToken,
        privateInfo: initState.privateInfo,
        errorMessage: 'Invalid Credentials',
      };
    }
    case AUTHENTICATE_FAIL: {
      return {
        ...state,
        username: initState.username,
        authToken: initState.authToken,
        privateInfo: initState.privateInfo,
        errorMessage: 'An unexpected error has occurred',
      };
    }
    case SAVE_PRIVATE_INFORMATION: {
      const { authToken, privateInfo } = action;
      localStorage.setItem('privateInfo', privateInfo);
      return {
        ...state,
        authToken: authToken,
        privateInfo: privateInfo,
      }
    }
    case LOGOUT: {
      return {
        ...initState,
      };
    }
    default:
      return {...state};
  }
}