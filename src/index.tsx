import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {createStore} from "redux"
import {Provider} from "react-redux"
import reducers from './redux/reducers';
import { composeWithDevTools } from 'redux-devtools-extension';
import { Router, BrowserRouter } from 'react-router-dom';

const store = createStore(reducers, composeWithDevTools())

ReactDOM.render(<BrowserRouter><Provider store={store}><App /></Provider></BrowserRouter>, document.getElementById('root'));

