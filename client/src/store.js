import { createStore, applyMiddleware, compose } from 'redux';
import ReduxThunk from 'redux-thunk';
import rootReducer from './_reducers/index';
//import { composeWithDevTools } from 'redux-devtools-extension';
import promiseMiddleware from 'redux-promise';

const initialState = {};

const middleware = [ReduxThunk, promiseMiddleware];

let composeEnhancers = null;
if (process.env.NODE_ENV === 'production') {
  composeEnhancers = compose;
} else {
  composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
}

const store = createStore(
  rootReducer,
  initialState,
  composeEnhancers(applyMiddleware(...middleware))
);

export default store;
