import { combineReducers } from 'redux';
import authentication, { STATE as authState } from '../contexts/authentication';

// RootReducer (Alphabetical Order)
export interface RootState {
  auth: authState;
}

export default combineReducers({
  auth: authentication,
});