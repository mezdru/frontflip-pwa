import { observable, action, decorate } from 'mobx';
import Cookies from 'universal-cookie';
import undefsafe from 'undefsafe';
import userStore from './user.store';

const cookies = new Cookies();

class CommonStore {

  url = {
    params: {
      orgTag: null,
      recordTag: null,
      onboardStep: null,
      hashtags: null,
      action: null,
      invitationCode: null,
      onboardMode: null
    }
  };

  accessToken;
  refreshToken;
  algoliaKey;
  algoliaKeyOrganisation;
  locale = 'en-UK';
  searchFilters = [];
  searchResultsCount = 0;
  hiddenWings = [];

  constructor() {
    this.init();
  }

  init() {
    this.accessToken = this.getCookie('accessToken');
    this.refreshToken = this.getCookie('refreshToken');
    this.algoliaKey = this.getCookie('algoliaKey');
    this.algoliaKeyOrganisation = this.getCookie('algoliaKeyOrganisation');
    this.searchFilters = this.getCookie('searchFilters');
    this.populateLocale();
  }

  setUrlParams(match) {
    this.url.params = {
      orgTag: undefsafe(match, 'params.orgTag') || null,
      recordTag: undefsafe(match, 'params.recordTag') || null,
      hashtags: undefsafe(match, 'params.hashtags') || null,
      action: undefsafe(match, 'params.action') || null,
      invitationCode: undefsafe(match, 'params.invitationCode') || null,
      onboardMode: undefsafe(match, 'params.mode') || null
    };

    if(match.params.locale) this.handleLocale(match);
  }

  handleLocale = async (match) => {
    if (undefsafe(match, 'params.locale')) {
      this.locale = match.params.locale;
      this.setCookie('locale', this.locale);
      this.populateLocale();
      var currentUser = userStore.currentUser;
      if (currentUser && this.locale !== currentUser.locale) {
        currentUser.locale = this.locale;
        await userStore.updateCurrentUser(currentUser);
      }
    }
  }

  setLocale(locale) {
    this.locale = locale;
    this.setCookie('locale', locale);
  }

  populateLocale() {
    let localesAccepted = ['en', 'fr'];
    this.locale = window.location.pathname.split('/')[1];
    if (!localesAccepted.some(lg => lg === this.locale)) this.locale = this.getCookie('locale');
    if (!this.locale) {
      this.locale = navigator.language || navigator.userLanguage || 'en';
      if (localesAccepted.some(lg => lg === this.locale)) {
        this.setCookie('locale', this.locale);
      } else {
        this.setCookie('locale', 'en');
      }
    }
  }

  getSessionStorage = (name) => sessionStorage.getItem(name);
  setSessionStorage = (name, value) => sessionStorage.setItem(name, value);
  removeSessionStorage = (name) => sessionStorage.removeItem(name);

  getLocalStorage(name, isObject) {
    if (isObject) return JSON.parse(localStorage.getItem(name));
    else return localStorage.getItem(name);
  }

  setLocalStorage(name, value, isObject) {
    return Promise.resolve().then(function () {
      try {
        if (isObject) localStorage.setItem(name, JSON.stringify(value));
        else localStorage.setItem(name, value);
      }catch(e) {
        console.error(e);
        console.log(`setLocalStorage : ${name} : ${value} : ${isObject}`);
      }

    });
  }

  getAccessToken = () => this.getCookie('accessToken');
  getRefreshToken = () => this.getCookie('refreshToken');
  setSearchFilters = (searchFilters) => {
    this.setCookie('searchFilters', JSON.stringify(searchFilters));
    this.init();
  }
  getSearchFilters = () => {
    let coo = this.getCookie('searchFilters')
    if (coo) {
      return (coo);
    } else {
      return [];
    }
  }

  setCookie(name, value, expires) {
    if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
      cookies.set(name, value, (expires ? { expires: expires, path: '/', domain: 'wingzy.com' } : { path: '/', domain: 'wingzy.com' }));
    } else {
      cookies.set(name, value, (expires ? { expires: expires, path: '/' } : { path: '/' }));
    }
    this.init();
  }

  getCookie = (name) => cookies.get(name);

  removeCookie(name) {
    let options = {};
    if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
      options = { path: '/', domain: 'wingzy.com' };
    } else {
      options = { path: '/' };
    }
    cookies.remove(name, options);
    this.init();
  }

  removeAuthTokens() {
    let options = {};
    if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
      options = { path: '/', domain: 'wingzy.com' };
    } else {
      options = { path: '/' };
    }
    cookies.remove('accessToken', options);
    cookies.remove('refreshToken', options);
    this.init();
  }

  setAuthTokens(tokens) {
    if (tokens) {
      let expDate = new Date();
      expDate.setMinutes(expDate.getMinutes() + 55);

      this.accessToken = tokens.access_token;
      this.setCookie('accessToken', this.accessToken, expDate);

      if (tokens.refresh_token && (tokens.refresh_token !== 'undefined')) {
        let expDate2 = new Date();
        expDate2.setFullYear(expDate2.getFullYear() + 1);

        this.refreshToken = tokens.refresh_token;
        this.setCookie('refreshToken', this.refreshToken, expDate2);
      }
    }
    this.init();
  }

  setAlgoliaKey(algoliaKey, orgTag) {
    this.algoliaKey = algoliaKey.value;
    let expDate = new Date(algoliaKey.valid_until);
    this.setCookie('algoliaKey', this.algoliaKey, expDate);
    this.setCookie('algoliaKeyOrganisation', orgTag, expDate);
    this.init();
  }
}

decorate(CommonStore, {
  appName: observable,
  url: observable,
  setUrlParams: action,
  accessToken: observable,
  refreshToken: observable,
  algoliaKey: observable,
  algoliaKeyOrganisation: observable,
  searchFilters: observable,
  hiddenWings: observable,
  locale: observable,
  searchResultsCount: observable,
  setToken: action,
  setAlgoliaKey: action,
  getCookie: action,
  setCookie: action,
  removeCookie: action,
  removeAuthTokens: action,
  setSearchFilters: action,
  getSearchFilters: action,
  setSessionStorage: action,
  getSessionStorage: action,
  removeSessionStorage: action
});

export default new CommonStore();