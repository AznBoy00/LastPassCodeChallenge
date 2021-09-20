import { combineReducers } from 'redux';
import authentication, { STATE as authState } from '../contexts/app';

// RootReducer (Alphabetical Order)
export interface RootState {
  auth: authState;
}

export default combineReducers({
  auth: authentication,
});