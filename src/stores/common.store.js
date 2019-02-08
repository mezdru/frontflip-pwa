import { observable, action, decorate } from 'mobx';
import Cookies from 'universal-cookie';
const cookies = new Cookies();


class CommonStore {

  appName = 'Frontflip';
  accessToken;
  refreshToken;
  algoliaKey;
  algoliaKeyOrganisation;
  appLoaded = false;
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

  getAccessToken() {
    return this.getCookie('accessToken');
  }
  getRefreshToken() {
    return this.getCookie('refreshToken');
  }

  setSearchFilters(searchFilters) {
    let search = JSON.stringify(searchFilters);
    this.setCookie('searchFilters', search);
  }
  getSearchFilters() {
    let cookie = this.getCookie('searchFilters');
    return cookie;
  }

  setCookie(name, value, expires) {
    if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
      cookies.set(name, value, (expires ? { expires: expires, path: '/', domain: 'wingzy.com' } : { path: '/', domain: 'wingzy.com' }));
    } else {
      cookies.set(name, value, (expires ? { expires: expires, path: '/' } : { path: '/' }));
    }
    this.init();
  }

  getCookie(name) {
    return cookies.get(name);
  }

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

      let expDate2 = new Date();
      expDate2.setFullYear(expDate2.getFullYear() + 1);

      this.refreshToken = tokens.refresh_token;
      this.setCookie('refreshToken', this.refreshToken, expDate2);
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

  setAppLoaded() {
    this.appLoaded = true;
  }

}

decorate(CommonStore, {
  appName: observable,
  accessToken: observable,
  refreshToken: observable,
  algoliaKey: observable,
  algoliaKeyOrganisation: observable,
  appLoaded: observable,
  searchFilters: observable,
  locale: observable,
  setToken: action,
  setAlgoliaKey: action,
  setAppLoaded: action,
  getCookie: action,
  setCookie: action,
  removeCookie: action,
  removeAuthTokens: action,
  setSearchFilters: action,
  getSearchFilters: action
});

export default new CommonStore();