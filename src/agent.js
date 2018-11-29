import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';
import authStore from './stores/auth.store';
import commonStore from './stores/common.store';

const superagent = superagentPromise(_superagent, global.Promise);
//const API_ROOT_AUTH = 'https://auth-wingzy-staging.herokuapp.com';
const API_ROOT_AUTH = 'http://localhost:3001'
const API_ROOT = 'http://localhost:3000';

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
            .del(`${url}`)
            .use(tokenPlugin)
            .end(handleErrors)
            .then(responseBody),
    get: url =>
        superagent
            .get(`${url}`)
            .use(tokenPlugin)
            .end(handleErrors)
            .then(responseBody),
    put: (url, body) =>
        superagent
            .put(`${url}`, body)
            .use(tokenPlugin)
            .end(handleErrors)
            .then(responseBody),
    post: (url, body) =>
        superagent
            .post(`${url}`, body)
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
            `${API_ROOT_AUTH}/auth/locale`,
            {
                username: email,
                password: password,
                client_id: 'frontflip',
                client_secret: 'abcd1234',
                grant_type: 'password'
            }
        ),
    register: (email, password) =>
        requests.post(
            `${API_ROOT_AUTH}/register`,
            {
                email: email,
                password: password
            }
        ),
    authorization: (email, password, orgTag, invitationCode) =>
        requests.post(
            `${API_ROOT_AUTH}/authorization/organisation/`+orgTag+`/`+(invitationCode ? invitationCode : ``),
            {
                username: email,
                password: password,
                client_id: 'frontflip',
                client_secret: 'abcd1234',
                grant_type: 'password'
            }
        )
};

const Record = {
    get: (orgTag, recordTag) => 
        requests.get(
            API_ROOT+'/api/record/'+recordTag+'/organisation/'+orgTag
        ),
    post: (orgTag, record) => 
        requests.post(
            API_ROOT+'/api/record/organisation/'+orgTag,
            {
                record: record
            }
        ),
    put: (orgTag, recordTag, record) => 
        requests.put(
            API_ROOT+'/api/record/'+recordTag+'/organisation/'+orgTag,
            {
                record: record
            }
        ),
    getMe: (orgTag) => 
        requests.get(
            API_ROOT+'/api/record/organisation/'+orgTag+'/me'
        ),
    deleteMe: (orgTag) => 
        requests.del(
            API_ROOT+'/api/record/organisation/'+orgTag+'/me'
        )
};

const Organisation = {
    getForPublic: (orgTag) =>
        requests.get(
            API_ROOT+'/api/organisation/'+orgTag
        ),
    getAlgoliaKey: (orgTag, isPublic) =>
        requests.get(
            API_ROOT+'/api/organisation/algolia/'+(isPublic?'public':'private')+'/'+orgTag
        )
}

/**
 * @description Test get user with secure call to API
 */
const Test = {
    getUser: () => 
    requests.get('/test/secure')
};

export default {
    Auth,
    Test,
    Record,
    Organisation
}