import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {createStore} from "redux"
import {Provider} from "react-redux"
import reducers from './redux/reducers';
import { composeWithDevTools } from 'redux-devtools-extension';
import { Router } from 'react-router-dom';
import history from './utils/history';

const store = createStore(reducers, composeWithDevTools())

ReactDOM.render(<Router history={history}><Provider store={store}><App /></Provider></Router>, document.getElementById('root'));

