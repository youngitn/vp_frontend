import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import configureStore from './store/configurestore';
import { Provider } from 'react-redux';

// import Home from './Home';
import { Waiter } from "react-wait";
const store = configureStore();
ReactDOM.render(
    <Provider store={store}>
    <Waiter>
        <div>
        <App />
        </div>
    </Waiter>
    </Provider>
    , 
document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
