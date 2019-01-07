import { observable, action, decorate } from 'mobx';
import Cookies from 'universal-cookie';
const cookies = new Cookies();


class CommonStore {

    appName = 'Frontflip';
    accessToken;
    refreshToken;
    algoliaKey;
    algoliaKeyValidity;
    appLoaded = false;
    locale = 'en-UK';


    constructor() {
        this.accessToken = this.getCookie('accessToken');
        this.refreshToken = this.getCookie('refreshToken');
        this.algoliaKey = this.getStorage('algoliaKey');
        this.algoliaKeyValidity = this.getStorage('algoliaKeyValidity');
        this.populateLocale();
        
    }

    populateLocale() {
        let localesAccepted = ['en', 'fr'];
        this.locale = window.location.pathname.split('/')[1];
        if(! localesAccepted.some(lg => lg === this.locale)) this.locale = this.getCookie('locale');
        if(!this.locale) {
            this.locale = 'en';
            this.setCookie('locale','en');
        }
    }

    getAccessToken() {
        return this.getCookie('accessToken');
    }
    getRefreshToken() {
        return this.getCookie('refreshToken');
    }
    
    setCookie(name, value, expires) {
        if(process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging'){
            cookies.set(name, value, (expires ? {expires: expires, path: '/', domain: 'wingzy.com'} : {path: '/', domain: 'wingzy.com'}));
        }else{
            cookies.set(name, value, (expires ? {expires: expires, path: '/'} : {path: '/'}));
        }
    }

    getCookie(name) {
        return cookies.get(name);
    }

    removeAuthTokens() {
        cookies.remove('accessToken');
        cookies.remove('refreshToken');
    }

    setStorage(token, name) {
        window.localStorage.setItem(name, token);
    }

    getStorage(name) {
        return window.localStorage.getItem(name);
    }

    removeStorage(name) {
        window.localStorage.removeItem(name);
    }

    setAuthTokens(tokens) {
        if(tokens) {
            let expDate = new Date();
            expDate.setMinutes(expDate.getMinutes()+55);
    
            this.accessToken = tokens.access_token;
            this.setCookie('accessToken',this.accessToken, expDate);

            let expDate2 = new Date();
            expDate2.setFullYear(expDate2.getFullYear() + 1);
    
            this.refreshToken = tokens.refresh_token;
            this.setCookie('refreshToken',this.refreshToken, expDate2);
        }
    }

    setAlgoliaKey(algoliaKey) {
        this.algoliaKey = algoliaKey.value;
        this.algoliaKeyValidity = algoliaKey.valid_until;
        if (algoliaKey) {
            this.setStorage(this.algoliaKey, 'algoliaKey');
            this.setStorage(this.algoliaKeyValidity, 'algoliaKeyValidity');
        } else {
            this.removeStorage('algoliaKey');
            this.removeStorage('algoliaKeyValidity');
        }
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
    algoliaKeyValidity: observable,
    appLoaded: observable,
    locale: observable,
    setToken: action,
    setAlgoliaKey: action,
    setAppLoaded: action,
    getCookie: action,
    setCookie: action
});

export default new CommonStore();