import { observable, action, decorate } from 'mobx';
import Cookies from 'universal-cookie';
const cookies = new Cookies();


class CommonStore {

  accessToken;
  refreshToken;
  algoliaKey;
  algoliaKeyOrganisation;
  locale = 'en-UK';
  searchFilters = [];

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

  populateLocale() {
    let localesAccepted = ['en', 'fr'];
    this.locale = window.location.pathname.split('/')[1];
    if (!localesAccepted.some(lg => lg === this.locale)) this.locale = this.getCookie('locale');
    if (!this.locale) {
      this.locale = navigator.language || navigator.userLanguage || 'en';
      if(localesAccepted.some(lg => lg === this.locale)){
        this.setCookie('locale', this.locale);
      }else {
        this.setCookie('locale', 'en');
      }
    }
  }

  getLocalStorage(name, isObject) {
    if(isObject) return JSON.parse(localStorage.getItem(name));
    else return localStorage.getItem(name);
  }

  setLocalStorage(name, value, isObject) {
    if(isObject) localStorage.setItem(name, JSON.stringify(value));
    else localStorage.setItem(name, value);
  }

  getAccessToken = () => this.getCookie('accessToken');
  getRefreshToken = () => this.getCookie('refreshToken');
  setSearchFilters = (searchFilters) => this.setCookie('searchFilters', JSON.stringify(searchFilters));
  getSearchFilters = () => this.getCookie('searchFilters');

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

      if(tokens.refresh_token && (tokens.refresh_token !== 'undefined')) {
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
  accessToken: observable,
  refreshToken: observable,
  algoliaKey: observable,
  algoliaKeyOrganisation: observable,
  searchFilters: observable,
  locale: observable,
  setToken: action,
  setAlgoliaKey: action,
  getCookie: action,
  setCookie: action,
  removeCookie: action,
  removeAuthTokens: action,
  setSearchFilters: action,
  getSearchFilters: action
});

export default new CommonStore();