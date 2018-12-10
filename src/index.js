import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'mobx-react';
import authStore from './stores/auth.store';
import userStore from './stores/user.store';
import recordStore from './stores/record.store';
import commonStore from './stores/common.store';
import organisationStore from './stores/organisation.store';

const stores = {
    authStore,
    userStore,
    recordStore,
    commonStore,
    organisationStore
}
 

ReactDOM.render(
    <Provider {...stores}>
        <App />
    </Provider>
, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register();
