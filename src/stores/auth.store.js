import { observable, computed, action, decorate } from "mobx";
import agent from '../agent';
import commonStore from "./common.store";
import userStore from "./user.store";

class AuthStore {
    inProgress = false;
    errors = null;
    values = {
        email: '',
        password: ''
    };

    setEmail(email) {
        this.values.email = email;
    }

    setPassword(password) {
        this.values.password = password;
    }

    reset() {
        this.values.email = '';
        this.values.password = '';
    }

    /**
     * @description Call authentification service to fetch tokens
     */
    login() {
        this.inProgress = true;
        this.errors = null;

        return agent.Auth.login(this.values.email, this.values.password)
            .then((tokens) => commonStore.setToken(tokens.access_token))
            .catch(action((err) => {
                this.errors = err.response && err.response.body && err.response.body.errors;
                throw err;
            }))
            .finally(action(()=> { this.inProgress = false; }));
    }

    logout() {
        commonStore.setToken(null);
        userStore.forgetUser();
        return Promise.resolve();
    }

    /**
     * @description test call
     */
    getUser() {
        return agent.Test.getUser()
        .then((user)=> {
            return user;
        });
    }
}

decorate(AuthStore, {
    inProgress: observable,
    errors: observable,
    values: observable,
    setEmail: action,
    setPassword: action,
    reset: action,
    login: action,
    logout: action
});

export default new AuthStore();