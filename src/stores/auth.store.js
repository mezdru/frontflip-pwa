import { observable, action, decorate } from "mobx";
import agent from '../agent';
import commonStore from "./common.store";
import userStore from "./user.store";
import emailService from "../services/email.service";

class AuthStore {
    inProgress = false;
    errors = null;
    values = {
        email: '',
        password: '',
        orgTag: '',
        invitationCode: ''
    };

    setEmail(email) {
        this.values.email = email;
    }

    setPassword(password) {
        this.values.password = password;
    }

    setOrgTag(orgTag) {
        this.values.orgTag = orgTag;
    }

    reset() {
        this.values.email = '';
        this.values.password = '';
        this.values.orgTag = '';
        this.values.invitationCode = '';
    }

    isAuth() {
        if(commonStore.getAccessToken() || commonStore.getRefreshToken()){
            return userStore.getCurrentUser()
            .then(() => {
                return true;
            }).catch(() => {
                return false;
            })
        }else{
            return Promise.resolve(false);
        }
    }

    
    /**
     * @description Call authentification service to fetch tokens
     */
    login() {
        this.inProgress = true;
        this.errors = null;

        return agent.Auth.login(this.values.email, this.values.password)
            .then((response) => {   
                if(response && response.access_token){
                    commonStore.setAuthTokens(response);
                    return userStore.getCurrentUser()
                    .then(()=> {return 200;});
                } 
                else return 403;
            })
            .catch(action((err) => {
                this.errors = err.response && err.response.body && err.response.body.errors;
                throw err;
            }))
            .finally(action(()=> { this.inProgress = false; }));
    }

    /**
     * @description Call authentification service to register a new User
     */
    register() {
        this.inProgress = true;
        this.errors = null;

        return agent.Auth.register(this.values.email, this.values.password)
            .then((data) => {
                return this.login(this.values.email, this.values.password)
                .then((respLogin) => {
                    return emailService.confirmLoginEmail()
                    .then((respEmail) => {
                        console.log('email sended');
                        return true;
                    });
                });
            })
            .catch(action((err) => {
                // any other response status than 20X is an error
                console.log(err);
                this.errors = err;
            }))
            .finally(action(() => {this.inProgress = false; }));
    }

    /**
     * @description Call authentification service to register an User to an Organisation
     * @param {access_token} needed.
     */
    registerToOrg() {
        this.inProgress = true;
        this.errors = null;

        return agent.Auth.registerToOrg(this.values.orgId, this.values.invitationCode)
            .then((data) => {
                console.log(data.message);
                console.log(data.user);
                console.log(data.organisation);
            })
            .catch(action((err) => {
                console.log(err.response.body);
                console.log(err.status);
                this.errors = err;
            }))
            .finally(action(() => {this.inProgress = false; }));
    }

    logout() {
        commonStore.removeAuthTokens();
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
    setOrgTag: action,
    reset: action,
    login: action,
    logout: action,
    register: action,
    registerToOrg: action
});

export default new AuthStore();