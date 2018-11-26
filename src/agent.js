import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';
import authStore from './stores/auth.store';
import commonStore from './stores/common.store';

const superagent = superagentPromise(_superagent, global.Promise);
const API_ROOT = 'https://auth-wingzy-staging.herokuapp.com';
const encode = encodeURIComponent;

const handleErrors = err => {
    if (err && err.response && err.response.status === 401) {
        authStore.logout();
    }
    return err;
};

const responseBody = res => res.body;

/**
 * @description Set token to header
 */
const tokenPlugin = req => {
    if(commonStore.token){
        req.set('Authorization', `Bearer ${commonStore.token}`);
    }
};

/**
 * @description Create requests, will be used by all other actions in this file
 */
const requests = {
    del: url =>
        superagent
            .del(`${API_ROOT}${url}`)
            .use(tokenPlugin)
            .end(handleErrors)
            .then(responseBody),
    get: url =>
        superagent
            .get(`${API_ROOT}${url}`)
            .use(tokenPlugin)
            .end(handleErrors)
            .then(responseBody),
    put: (url, body) =>
        superagent
            .put(`${API_ROOT}${url}`, body)
            .use(tokenPlugin)
            .end(handleErrors)
            .then(responseBody),
    post: (url, body) =>
        superagent
            .post(`${API_ROOT}${url}`, body)
            .use(tokenPlugin)
            .end(handleErrors)
            .then(responseBody),
};

/**
 * @description Authentification actions
 */
const Auth = {
    login: (email, password) => 
        requests.post(
            '/auth/locale',
            {
                username: email,
                password: password,
                client_id: 'frontflip',
                client_secret: 'abcd1234',
                grant_type: 'password'
            }
        )
};

/**
 * @description Test get user with secure call to API
 */
const Test = {
    getUser: () => 
    requests.get('/test/secure')
};

export default {
    Auth,
    Test
}