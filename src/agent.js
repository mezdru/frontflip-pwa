import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';
import authStore from './stores/auth.store';
import commonStore from './stores/common.store';
import UrlService from './services/url.service';
import LogRocket from 'logrocket';

const superagent = superagentPromise(_superagent, global.Promise);
const locale = ((process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') ? (commonStore.getCookie('locale') || commonStore.locale) : 'en-UK');
const API_ROOT_AUTH = process.env.REACT_APP_API_ROOT_AUTH;
const API_ROOT = process.env.REACT_APP_API_ROOT + '/' + locale;

const handleErrors = err => {
  if(err) LogRocket.error(err);

  if (err && err.response && err.response.status === 401) {
    authStore.logout();
    window.location.href = UrlService.createUrl(window.location.host, '/signin', null);
  }
  return err;
};

const responseBody = res => res.body;

/**
 * @description Set token to header
 */
const tokenPlugin = req => {
  if (commonStore.getAccessToken() || commonStore.accessToken) {
    req.set('Authorization', `Bearer ` + (commonStore.getAccessToken() || commonStore.accessToken));
  }
};

/**
 * @description Create requests, will be used by all other actions in this file
 */
const requests = {
  del: (url) => {
    return validateToken()
      .then(() =>
        superagent
          .del((process.env.NODE_ENV === 'development' ? 'http://' : 'https://') + `${url}`)
          .timeout({
            response: 30000,
          })
          .use(tokenPlugin)
          .end(handleErrors)
          .then(responseBody)
      );
  },

  get: (url) => {
    return validateToken()
      .then(() =>
        superagent
          .get((process.env.NODE_ENV === 'development' ? 'http://' : 'https://') + `${url}`)
          .timeout({
            response: 30000,
          })
          .use(tokenPlugin)
          .end(handleErrors)
          .then(responseBody)
      );
  },

  put: (url, body) => {
    return validateToken()
      .then(() =>
        superagent
          .put((process.env.NODE_ENV === 'development' ? 'http://' : 'https://') + `${url}`, body)
          .timeout({
            response: 30000,
          })
          .use(tokenPlugin)
          .end(handleErrors)
          .then(responseBody)
      );
  },

  post: (url, body) => {
    return validateToken()
      .then(() =>
        superagent
          .post((process.env.NODE_ENV === 'development' ? 'http://' : 'https://') + `${url}`, body)
          .timeout({
            response: 30000,
          })
          .use(tokenPlugin)
          .end(handleErrors)
          .then(responseBody)
      );
  },
};

/**
 * @description Get new access token if the older one is expired
 */
let validateToken = () => {
  if (commonStore.getRefreshToken() && !commonStore.getAccessToken()) {
    return new Promise((resolve, reject) => {
      superagent.post(
        (process.env.NODE_ENV === 'development' ? 'http://' : 'https://') + `${API_ROOT_AUTH}/locale`,
        {
          client_id: process.env.REACT_APP_CLIENT_ID,
          client_secret: process.env.REACT_APP_CLIENT_SECRET,
          grant_type: 'refresh_token',
          refresh_token: commonStore.getRefreshToken()
        }
      )
        .timeout({
          response: 30000,
        })
        .end( (err) => {
          if(err) LogRocket.error("The refresh token exchange has not worked.");
          handleErrors(err);
        })
        .then((response) => {
          commonStore.setAuthTokens(JSON.parse(response.text));
          resolve();
        }).catch((err) => {
          LogRocket.error("The refresh token exchange has not worked.");
          LogRocket.error(err);
          authStore.logout();
          window.location.href = UrlService.createUrl(window.location.host, '/signin', null);
        });
    });
  } else {
    return Promise.resolve();
  }
};

/**
 * @description Authentification actions
 *              We have 2 levels of register / login :
 *              - register to Wingzy (classic)
 *              - register to an Organisation of Wingzy
 *              1 User can have many Organisation
 */
const Auth = {
  login: (email, password, integrationToken) =>
    requests.post(
      `${API_ROOT_AUTH}/locale`,
      {
        username: email,
        password: password,
        client_id: process.env.REACT_APP_CLIENT_ID,
        client_secret: process.env.REACT_APP_CLIENT_SECRET,
        grant_type: 'password',
        integration_token: integrationToken
      }
    ),
  googleCallbackLogin: (token) =>
    requests.post(
      API_ROOT_AUTH + '/locale/exchange',
      {
        token: token,
        client_id: process.env.REACT_APP_CLIENT_ID,
        client_secret: process.env.REACT_APP_CLIENT_SECRET
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
  registerToOrg: (orgId, invitationCode) =>
    requests.post(
      `${API_ROOT_AUTH}/register/organisation/` + orgId + `/` + (invitationCode ? invitationCode : '')
    )
};

const User = {
  getOne: (userId) =>
    requests.get(
      API_ROOT + '/api/users/' + userId
    ),
  welcomeUser: (params) =>
    requests.put(
      API_ROOT + '/api/users/me/orgsAndRecords',
      {
        orgAndRecord: {
          organisation: params.orgId,
          welcomed: true
        }
      }
    ),
  put: (orgId, userId, user) =>
    requests.put(
      API_ROOT + '/api/users/' + userId,
      {
        user: user
      }
    )
}

const Record = {
  getOne: (recordId) =>
    requests.get(
      API_ROOT + '/api/records/' + recordId
    ),
  get: (query) =>
    requests.get(
      `${API_ROOT}/api/records${query}`
    ),
  post: (record) =>
    requests.post(
      API_ROOT + '/api/records/',
      {
        orgId: record.organisation,
        record: record
      }
    ),
  put: (orgId, recordId, record) =>
    requests.put(
      API_ROOT + '/api/records/' + recordId,
      {
        orgId: orgId,
        record: record
      }
    ),
  delete: (recordId) =>
    requests.del(
      API_ROOT + '/api/records/' + recordId
    )

};

const Organisation = {
  getOne: (orgId) =>
    requests.get(
      API_ROOT + '/api/organisations/' + orgId
    ),
  get: (query) =>
    requests.get(
      API_ROOT + '/api/organisations' + query
    )
}

/**
 * @description Email API
 */
const Email = {
  confirmLoginEmail: (orgTag) =>
    requests.post(
      API_ROOT + '/api/emails/confirmation/' + (orgTag ? orgTag : '')
    ),
  passwordForgot: (userEmail) =>
    requests.post(
      API_ROOT + '/api/emails/password',
      {
        userEmail: userEmail
      }
    ),
  updatePassword: (token, hash, password) =>
    requests.post(
      API_ROOT_AUTH + '/password/reset/' + token + '/' + hash,
      {
        password: password
      }
    ),
  confirmIntegrationEmail: (integrationName) =>
    requests.post(
      API_ROOT + '/api/emails/security/integration/' + integrationName
    ),
  confirmationInvitation: (orgId, invitationUrl) =>
    requests.post(
      API_ROOT + '/api/emails/invitation/' + orgId + '/confirmation',
      {
        invitationUrl: invitationUrl
      }
    ),
  sendHelpRequest: (hrId) =>
    requests.post(
      API_ROOT + '/api/emails/helpRequest/' + hrId
    )
}

const Invitation = {
  createCode: (orgId, userId) =>
    requests.post(
      API_ROOT_AUTH + '/api/invitationCodes',
      {
        invitationCode: {
          organisation: orgId,
          creator: userId
        }
      }
    )
}

const SearchLog = {
  postSearchLog: (orgId, tagsArray, query, resultsLength) =>
    requests.post(
      API_ROOT + '/api/statistics',
      {
        searchLog: {
          tags: tagsArray,
          query: query,
          results: resultsLength,
          organisation: orgId
        }
      }
    )
}

const Clap = {
  post: (clap) => 
    requests.post(
      process.env.REACT_APP_API_ROOT_RECOGNIZE + '/api/claps',
      {
        clap: clap
      }
    ),
  getClapCountByProfile: (recordId) =>
    requests.get(
      process.env.REACT_APP_API_ROOT_RECOGNIZE + '/api/claps/record/' + recordId + '/count',
    ),
  getClapHistory: (recordId) => 
    requests.get(
      process.env.REACT_APP_API_ROOT_RECOGNIZE + '/api/claps/record/' + recordId
    )
}

const HelpRequest = {
  post: (hr) =>
    requests.post(
      process.env.REACT_APP_API_ROOT + '/api/helpRequests',
      {
        helpRequest: hr
      }
    )
}

const ConnectionLog = {
    get: () => 
      requests.get(
        process.env.REACT_APP_API_ROOT_AUTH + '/api/connectionLogs'
      )
}

export default {
  Auth,
  Record,
  Organisation,
  User,
  Email,
  Invitation,
  SearchLog,
  Clap,
  HelpRequest,
  ConnectionLog
}
