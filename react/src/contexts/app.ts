import { call, put, takeLatest } from 'redux-saga/effects';
import authenticateUser from '../api/auth';
import { decryptPrivateInfo, saveEncryptedPrivateInfo } from '../api/crypto';

export interface STATE {
  username: string,
  password: string,
  privateInfo: string,
  errorMessage: string,
}

// initState
const initState: STATE = {
  username: '',
  password: '',
  privateInfo: '',
  errorMessage: '',
};

// actions
export const AUTHENTICATE = 'AUTHENTICATE';
export const AUTHENTICATE_SUCCESS = 'AUTHENTICATE_SUCCESS';
export const AUTHENTICATE_FAIL = 'AUTHENTICATE_FAIL';
export const SAVE_PRIVATE_INFORMATION = 'SAVE_PRIVATE_INFORMATION';
export const SAVE_PRIVATE_INFORMATION_SUCCESS = 'SAVE_PRIVATE_INFORMATION_SUCCESS';
export const SAVE_PRIVATE_INFORMATION_FAIL = 'SAVE_PRIVATE_INFORMATION_FAIL';
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
  data: any;
}

// authentication success case
export const authSuccess = (data: any): AuthSuccessAction => ({
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

// SAVE PRIVATE INFO
export interface SavePrivateInfoAction {
  type: string;
  username: string;
  password: string;
  privateInfo: string;
}

export const savePrivateInfo = (username: string, password: string, privateInfo: string): SavePrivateInfoAction => ({
  type: SAVE_PRIVATE_INFORMATION,
  username,
  password,
  privateInfo,
});

interface SavePrivateInfoSuccessAction {
  type: string;
}

// authentication success case
export const savePrivateInfoSuccess = (): SavePrivateInfoSuccessAction => ({
  type: SAVE_PRIVATE_INFORMATION_SUCCESS
});

interface SavePrivateInfoFailAction {
  type: string;
}

// authentication fail case
export const savePrivateInfoFail = (): SavePrivateInfoFailAction => ({
  type: SAVE_PRIVATE_INFORMATION_FAIL,
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
    
    if (data !== undefined) {
      yield put(authSuccess(data));
    }
  } catch (e) {
    yield put(authFail());
    throw e;
  }
}

export function* handleSavePrivateInfo({ username, password, privateInfo }: SavePrivateInfoAction): Iterator<any> {
  try {
    const data = yield call(saveEncryptedPrivateInfo, username, password, privateInfo);

    if (data !== undefined) {
      yield put(savePrivateInfoSuccess());
    }
  } catch (e) {
    yield put(savePrivateInfoFail());
    throw e;
  }
}

// saga action mapper
export function* saga(): Iterator<any> {
  yield takeLatest(AUTHENTICATE, handleAuthentication);
  yield takeLatest(SAVE_PRIVATE_INFORMATION, handleSavePrivateInfo);
}

// REDUCER
export default function reducer(state: STATE = initState, action: any): STATE {
  switch (action.type) {
    case AUTHENTICATE_SUCCESS: {
      const { data } = action;

      if (data.success === true) {
        return {
          username: data.username,
          password: data.password,
          privateInfo: data.privateInfo,
          errorMessage: '',
        };
      }
      return {
        ...state,
        username: initState.username,
        privateInfo: initState.privateInfo,
        errorMessage: 'Invalid Credentials',
      };
    }
    case AUTHENTICATE_FAIL: {
      return {
        ...state,
        username: initState.username,
        password: initState.password,
        privateInfo: initState.privateInfo,
        errorMessage: 'An unexpected error has occurred',
      };
    }
    case SAVE_PRIVATE_INFORMATION_SUCCESS: {
      return {
        ...state,
      }
    }
    case SAVE_PRIVATE_INFORMATION_FAIL: {
      return {
        ...state,
        errorMessage: 'An unexpected error has occurred while saving private information',
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