import { observable, action, reaction, decorate } from 'mobx';

class CommonStore {

    appName = 'Frontflip';
    token;
    appLoaded = false;


    constructor() {
        // Init token value
        this.token = this.getTokenStorage();

        // Sync storage with token value
        reaction(() => this.token,
            token => {
                if (token) {
                    this.setTokenStorage(token);
                } else {
                    this.removeTokenStorage();
                }
            }
        );
    }

    setTokenStorage(token) {
        window.localStorage.setItem('jwt', token);
    }

    getTokenStorage() {
        return window.localStorage.getItem('jwt');
    }

    removeTokenStorage() {
        window.localStorage.removeItem('jwt');
    }

    setToken(token) {
        this.token = token;
    }

    setAppLoaded() {
        this.appLoaded = true;
    }

}

decorate(CommonStore, {
    appName: observable,
    token: observable,
    appLoaded: observable,
    setToken: action,
    setAppLoaded: action
});

export default new CommonStore();