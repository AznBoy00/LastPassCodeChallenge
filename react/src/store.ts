import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import rootReducer from './reducers/rootReducer';
import rootSaga from './rootSaga';

export default (): any => {
  const sagaMiddleware = createSagaMiddleware();
  const middleware = [sagaMiddleware];
  const store = createStore(rootReducer, composeWithDevTools(
    applyMiddleware(...middleware),
  ));
  sagaMiddleware.run(rootSaga);
  return { store };
};