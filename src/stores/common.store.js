import { observable, action, reaction, decorate } from 'mobx';

class CommonStore {

    appName = 'Frontflip';
    token;
    algoliaKey;
    algoliaKeyValidity;
    appLoaded = false;


    constructor() {
        // Init token value
        this.token = this.getStorage('jwt');
        this.algoliaKey = this.getStorage('algoliaKey');
        this.algoliaKeyValidity = this.getStorage('algoliaKeyValidity');

        // Sync storage with token value
        reaction(() => this.token,
            token => {
                if (token) {
                    this.setStorage(token, 'jwt');
                } else {
                    this.removeStorage('jwt');
                }
            }
        );
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

    setToken(token) {
        this.token = token;
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
    token: observable,
    algoliaKey: observable,
    algoliaKeyValidity: observable,
    appLoaded: observable,
    setToken: action,
    setAlgoliaKey: action,
    setAppLoaded: action
});

export default new CommonStore();