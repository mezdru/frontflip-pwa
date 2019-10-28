import { observable, action, decorate, computed, observe } from "mobx";
import KeenTracking from 'keen-tracking';
import Store from "./store";
import orgStore from './organisation.store';
import undefsafe from 'undefsafe';
import authStore from "./auth.store";
import userStore from './user.store';

class KeenStore extends Store {

  constructor() {
    super("Organisation");
    this.queue = [];
    this.writesKeys = [];
    this.client = null;

    this.unsubOrg = observe(orgStore, 'currentOrganisation', (change) => {
      try {
        if (change.newValue && undefsafe(change.oldValue, '_id') !== undefsafe(change.newValue, '_id')) {
          this.client = null;
          this.fetchKeenWritesKey(change.newValue._id, change.newValue.public)
            .then((key) => {
              if (key) {
                this.client = new KeenTracking({
                  projectId: process.env.REACT_APP_KEEN_PROJECT_ID,
                  writeKey: key
                });

                for (var i = 0; i < this.queue.length; i++) {
                  this.recordEvent(this.queue[i].eventFamily, this.queue[i].object);
                }
                this.queue = [];
              }
            }).catch(e => console.log(e));
        }
      } catch (e) {
        console.log("Error during keen store initialization.");
        console.error(e);
      }
    });
  }

  get currentKeenWritesKey() {
    try { return this.getKeenWritesKey(orgStore.currentOrganisation._id) } catch (e) { return null; };
  }

  addKeenWritesKey(key, orgId) {
    let newKeenKey = { value: key, organisation: orgId, initialized: false };
    let index = this.writesKeys.findIndex(keenKey => JSON.stringify(keenKey.organisation) === JSON.stringify(orgId));
    if (index > -1) {
      this.writesKeys[index] = newKeenKey;
    } else {
      this.writesKeys.push(newKeenKey);
    }
  }

  getKeenWritesKey(orgId) {
    if (!orgId) return null;
    return this.writesKeys.find(key => key.organisation === orgId);
  }

  async fetchKeenWritesKey(orgId, isPublic) {
    if (!orgId) throw new Error('Organisation id is required.');
    if(!isPublic && !authStore.isAuth()) return null;
    
    let keenKey = await super.fetchResources(`/${orgId}/keen/${isPublic ? 'public' : 'private'}`);
    this.addKeenWritesKey(keenKey, orgId);
    return keenKey;
  }

  recordEvent = (eventFamily, object) => {
    try {
      if (!this.client) return this.queue.push({ eventFamily: eventFamily, object: object });
      object.userEmitter = undefsafe(userStore.currentUser, '_id');
      return this.client.recordEvent(eventFamily, {
        item: object
      });
    } catch (e) {
      console.error(e);
    }
  }

}

decorate(KeenStore, {
  writesKeys: observable,
  fetchKeenWritesKey: action,
  currentKeenWritesKey: computed,
  addKeenWritesKey: action
});

export default new KeenStore();