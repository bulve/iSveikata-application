import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

import { Provider } from 'react-redux'
// import store from './Component/Container/_Store/store'
// import { applyMiddleware, createStore} from 'redux'

// import thunk from 'redux-thunk'
// import logger from 'redux-logger'
// import user from './Component/Container/_reducers/userReducer'

import {store} from './Component/Container/_store/store'




ReactDOM.render(
  <Provider store={store} >
    <App />
  </Provider>,
  document.getElementById('root')
);
