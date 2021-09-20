import { call, put, takeLatest } from 'redux-saga/effects';
import authenticateUser, { Response as authResponse } from '../api/auth';

export interface STATE {
  username: string,
  authToken: string,
  privateInfo: string,
}

// initState
const initState: STATE = {
  username: '',
  authToken: '',
  privateInfo: '',
};

// actions
export const AUTHENTICATE = 'AUTHENTICATE';
export const AUTHENTICATE_SUCCESS = 'AUTHENTICATE_SUCCESS';
export const AUTHENTICATE_TEST = 'AUTHENTICATE_TEST';
export const AUTHENTICATE_FAIL = 'AUTHENTICATE_FAIL';
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

interface AuthSuccessAction {
  type: string;
  data: authResponse;
}

// authentication success case
export const authSuccess = (data: authResponse): AuthSuccessAction => ({
  type: AUTHENTICATE_SUCCESS,
  data,
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

export interface GetUserDataAction {
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
    if (data !== undefined) {
      yield put(authSuccess(data));
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
      const { data } = action;
      return {
        ...state,
        username: data.username,
        authToken: data.auth_token,
      };
    }
    case AUTHENTICATE_FAIL: {
      return {
        ...state,
        username: initState.username,
        authToken: initState.authToken,
        privateInfo: initState.privateInfo,
      };
    }
    case LOGOUT: {
      return {
        ...initState,
      };
    }
    default:
      console.log(`state`, state)
      return {...state};
  }
}