import axios from 'axios';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ToastProvider } from 'react-toast-notifications';

import App from './App';
import './index.css';
import { index as index_const } from 'constants/values';
import reportWebVitals from 'reportWebVitals';
import configureStore from 'store/index';


// configuring store
const store = configureStore();

axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Token ${token}`;
    }
    return config;
});

ReactDOM.render(
    // using provider to make the store available to all the components inside
    <Provider store={store}>
        <React.StrictMode>
            <ToastProvider autoDismiss autoDismissTimeout={index_const.toastTimeout} placement="bottom-center">
                <App />
            </ToastProvider>
        </React.StrictMode>
    </Provider>,
    document.getElementById('root')
);

reportWebVitals();
