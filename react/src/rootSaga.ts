import { fork } from 'redux-saga/effects';

import { saga as authentication } from './contexts/app';

// RootSaga (Alphabetical Order)
export default function* rootSaga(): IterableIterator<any> {
  yield fork(authentication);
}