import { observable, action, decorate, computed } from 'mobx';
import orgStore from './organisation.store';
import LogRocket from 'logrocket';
import Store from './store';

class UserStore extends Store {

  currentUser = null;

  constructor() {
    super("User");
  }

  get currentOrgAndRecord() {
    let {currentOrganisation} = orgStore;
    return this.currentUser && currentOrganisation && this.currentUser.orgsAndRecords.find(oar => oar.organisation === currentOrganisation._id);
  }

  async fetchCurrentUser() {
    let user = await super.fetchResource('me');
    this.currentUser = user;

    LogRocket.identify(user._id, {   
      env: process.env.NODE_ENV,
    });

    return user;
  }

  async welcomeCurrentUser(orgId) {
    let user = await super.customRequest("welcomeUser", {orgId: orgId});
    this.currentUser = user;
    return user;
  }

  async updateCurrentUser(userToUpdate) {
    let user = await super.updateResource(this.currentUser._id, userToUpdate, null);
    return user;
  }

  forgetUser() {
    this.currentUser = undefined;
  }

}
decorate(UserStore, {
  currentUser: observable,
  currentOrgAndRecord: computed,
  fetchCurrentUser: action,
  updateCurrentUser: action,
  welcomeCurrentUser: action
});

export default new UserStore();