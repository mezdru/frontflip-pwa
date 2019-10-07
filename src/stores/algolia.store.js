import { observable, action, decorate } from "mobx";
import agent from '../agent';
import commonStore from "./common.store";
import userStore from "./user.store";
import Store from './store';
import { asyncForEach } from '../services/utils.service';

class algoliaStore extends Store{

  algoliaKeys = [];

  constructor() {
    super('Organisation');
  }

  addOrg(inOrg) {
    let index = this.organisations.findIndex(org => JSON.stringify(org._id) === JSON.stringify(inOrg._id));
    if (index > -1) {
      this.organisations[index] = inOrg;
    } else {
      this.organisations.push(inOrg);
    }
  }

  async fetchAlgoliaKey(org) {
    let algoliaKey = await super.getResource(org._id)
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
  inProgress: observable,
  errors: observable,
  values: observable,
  reset: action,
  setOrganisation: action,
  setFullOrgFetch: action,
  setOrgTag: action,
  setOrgId: action,
  getOrganisation: action,
  getAlgoliaKey: action,
  getOrganisationForPublic: action,
  getCurrentUserOrganisations: action
});

export default new orgStore();