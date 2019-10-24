import { observable, action, decorate, computed } from "mobx";
import agent from '../agent';
import commonStore from "./common.store";
import userStore from "./user.store";
import Store from './store';
import { asyncForEach } from '../services/utils.service';

class orgStore extends Store {

  organisations = [];
  algoliaKeys = [];

  constructor() {
    super('Organisation');
  }

  get currentOrganisation() {
    let orgTag = commonStore.url.params.orgTag;
    return this.getOrganisation(null, orgTag);
  }

  get currentAlgoliaKey() {
    try { return this.getAlgoliaKey(this.currentOrganisation._id) } catch (e) { return null; };
  }

  async getOrFetchOrganisation(orgId, orgTag) {
    let org = this.getOrganisation(orgId, orgTag);
    if (!org && orgId) org = await this.fetchOrganisation(orgId);
    if (!org && orgTag) org = await this.fetchForPublic(orgTag);
    return org;
  }

  addOrg(inOrg) {
    let index = this.organisations.findIndex(org => JSON.stringify(org._id) === JSON.stringify(inOrg._id));
    if (index > -1) {
      this.organisations[index] = inOrg;
    } else {
      this.organisations.push(inOrg);
    }
  }

  addAlgoliaKey(key, orgId, expirationDate) {
    let newAlgoliaKey = { value: key, organisation: orgId, expires: expirationDate, initialized: false }
    let index = this.algoliaKeys.findIndex(algoliaKey => JSON.stringify(algoliaKey.organisation) === JSON.stringify(orgId));
    if (index > -1) {
      this.algoliaKeys[index] = newAlgoliaKey;
    } else {
      this.algoliaKeys.push(newAlgoliaKey);
    }
  }

  getOrganisation(orgId, orgTag) {
    if (!orgId && !orgTag) return null;
    return this.organisations.find(org => {
      if (orgId) return JSON.stringify(orgId) === JSON.stringify(org._id);
      else return orgTag === org.tag;
    });
  }

  getAlgoliaKey(orgId) {
    if (!orgId) return null;
    return this.algoliaKeys.find(aKey =>
      (aKey.organisation === orgId) && (aKey.expires.getTime() > (new Date()).getTime())
    );
  }

  async fetchOrganisation(orgId) {
    let organisation = await super.fetchResource(orgId);
    this.addOrg(organisation);
    return organisation;
  }

  async fetchForPublic(orgTag) {
    if (!orgTag) throw new Error('Organisation tag is required.');

    let organisation = await super.fetchResources('/forPublic?tag=' + orgTag);
    this.addOrg(organisation);
    return organisation;
  }

  async fetchAlgoliaKey(orgId, isPublic) {
    if (!orgId) throw new Error('Organisation id is required.');

    let algoliaKey = await super.fetchResources(`/${orgId}/algolia/${isPublic ? 'public' : 'private'}`);
    this.addAlgoliaKey(algoliaKey.value, orgId, new Date(algoliaKey.valid_until));
    return algoliaKey.value;
  }

  // getAlgoliaKey(organisation, forceUpdate) {
  //   this.inProgress = true;
  //   this.errors = null;

  //   if ((commonStore.algoliaKey || commonStore.getCookie('algoliaKey')) && !forceUpdate) return Promise.resolve(commonStore.algoliaKey);
  //   if (commonStore.algoliaKeyOrganisation === organisation.tag && !forceUpdate) return Promise.resolve(commonStore.algoliaKey);

  //   return agent.Organisation.getAlgoliaKey(organisation._id, organisation.public)
  //     .then(res => {
  //       if (res) {
  //         commonStore.setAlgoliaKey(res.data, organisation.tag);
  //         return res.data.value;
  //       }
  //       return null;
  //     })
  //     .catch(action((err) => {
  //       this.errors = err.response && err.response.body && err.response.body.errors;
  //       throw err;
  //     }))
  //     .finally(action(() => { this.inProgress = false; }));
  // }

  // isKeyStillValid() {
  //   if (commonStore.algoliaKey && commonStore.algoliaKeyValidity) {
  //     let valid_until_date = new Date(parseInt(commonStore.algoliaKeyValidity));
  //     return (((new Date()).getTime() + 3600000) < valid_until_date.getTime());
  //   }
  //   return false;
  // }

}

decorate(orgStore, {
  currentOrganisation: computed,
  currentAlgoliaKey: computed,
  organisations: observable,
  algoliaKeys: observable,
  fetchForPublic: action,
  fetchOrganisation: action,
  fetchAlgoliaKey: action,
  getOrFetchOrganisation: action
});

export default new orgStore();