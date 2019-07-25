import { observable, action, decorate } from 'mobx';
import agent from '../agent';
import recordStore from './record.store';
import organisationStore from './organisation.store';
import LogRocket from 'logrocket';

class UserStore {

  inProgress = false;
  errors = null;
  values = {
    currentUser: {}
  };

  setCurrentUser(user) {
    this.values.currentUser = user;
  }

  getCurrentUser() {
    this.inProgress = true;
    this.errors = null;
    return agent.User.getCurrent()
      .then(data => {
        this.setCurrentUser(data.user);
        this.syncRecord();

        // Identify user for LogRocket
        LogRocket.identify(this.values.currentUser._id, {   
          env: process.env.NODE_ENV,
        });

        return this.values.currentUser;
      })
      .catch(action((err) => {
        this.errors = err.response && err.response.body && err.response.body.errors;
        throw err;
      }))
      .finally(action(() => { this.inProgress = false; }));
  }

  welcomeCurrentUser(orgId) {
    this.inProgress = true;
    this.errors = null;

    return agent.User.welcomeUser(this.values.currentUser._id, orgId)
      .then(data => {
        if(data.message !== 'User already welcomed in Organisation') {
          this.values.currentUser = (data ? data.user : {});
          this.syncRecord();
          return this.values.currentUser;
        }
      })
      .catch(action((err) => {
        this.errors = err.response && err.response.body && err.response.body.errors;
        throw err;
      }))
      .finally(action(() => { this.inProgress = false; }));
  }

  updateCurrentUser() {
    this.inProgress = true;
    this.errors = null;

    return agent.User.update(this.values.currentUser._id, this.values.currentUser)
      .then(data => {
        this.values.currentUser = (data ? data.user : {});
        return this.values.currentUser;
      })
      .catch(action((err) => {
        this.errors = err.response && err.response.body && err.response.body.errors;
        throw err;
      }))
      .finally(action(() => { this.inProgress = false; }));
  }

  syncRecord() {
    if (!recordStore.values.record._id && organisationStore.values.organisation._id) {
      let currentOrgAndRecord = this.values.currentUser.orgsAndRecords.find(orgAndRecord => orgAndRecord.organisation === organisationStore.values.organisation._id);
      if (currentOrgAndRecord && currentOrgAndRecord.record) {
        recordStore.setRecordId(currentOrgAndRecord.record);
        recordStore.getRecord();
      }
    }
  }

  forgetUser() {
    this.currentUser = undefined;
  }

}
decorate(UserStore, {
  inProgress: observable,
  errors: observable,
  values: observable,
  getCurrentUser: action,
  updateCurrentUser: action,
  forgetUser: action
});

export default new UserStore();