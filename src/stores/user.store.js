import { observable, action, decorate, computed } from 'mobx';
import orgStore from './organisation.store';
import recordStore from './record.store';
import LogRocket from 'logrocket';
import Store from './store';
import {asyncForEach} from '../services/utils.service';

class UserStore extends Store {

  currentUser = null;

  constructor() {
    super("User");
  }

  get currentOrgAndRecord() {
    let {currentOrganisation} = orgStore;
    return this.currentUser && currentOrganisation && this.currentUser.orgsAndRecords.find(oar => (oar.organisation._id || oar.organisation) === currentOrganisation._id);
  }

  async fetchCurrentUser() {
    let user = await super.fetchResource('me');
    this.currentUser = user;

    LogRocket.identify(user._id, {   
      env: process.env.NODE_ENV,
    });

    return user;
  }

  async fetchCurrentUserAndData() {
    let user = await super.fetchResource('me');
    this.currentUser = user;


    await asyncForEach(user.orgsAndRecords, async (orgAndRecord) => {
      orgStore.addOrg(orgAndRecord.organisation);
      if(orgAndRecord.record) recordStore.addRecord(orgAndRecord.record);
    });

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
  fetchCurrentUserAndData: action,
  updateCurrentUser: action,
  welcomeCurrentUser: action
});

export default new UserStore();