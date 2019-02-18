import { observable, action, decorate } from "mobx";
import agent from '../agent';
import commonStore from "./common.store";
import userStore from "./user.store";

class OrganisationStore {
  inProgress = false;
  errors = null;
  values = {
    orgTag: '',
    orgId: '',
    organisation: {},
    currentUserOrganisations: [],
    fullOrgFetch: false
  };

  setOrgTag(orgTag) {
    this.values.orgTag = orgTag;
  }

  setOrgId(orgId) {
    this.values.orgId = orgId;
  }

  setOrganisation(organisation) {
    this.values.organisation = organisation;
  }

  setFullOrgFetch(val) {
    this.values.fullOrgFetch = val;
  }


  reset() {
    this.values.organisation = {};
    this.values.orgTag = '';
  }

  getOrganisation() {
    if (this.values.orgId) {
      this.inProgress = true;
      this.errors = null;

      return agent.Organisation.get(this.values.orgId)
        .then(data => {
          this.setOrganisation(data.organisation);
          this.setFullOrgFetch(true);
          return this.getAlgoliaKey(true).then(() => {
            return this.values.organisation;
          });
        })
        .catch(action((err) => {
          this.errors = err.response && err.response.body && err.response.body.errors;
          throw err;
        }))
        .finally(action(() => { this.inProgress = false; }));
    } else {
      return Promise.resolve();
    }
  }

  async getCurrentUserOrganisations() {
    if (userStore.values.currentUser && userStore.values.currentUser.orgsAndRecords.length > 0) {
      this.values.currentUserOrganisations = [];
      await this.asyncForEach(userStore.values.currentUser.orgsAndRecords, async (orgAndRecord) => {
        let org = await agent.Organisation.get(orgAndRecord.organisation).catch();
        if(org && org.organisation && !this.values.currentUserOrganisations.some(currentOrg => currentOrg.tag === org.organisation.tag)) {
          this.values.currentUserOrganisations.push(org.organisation);
        }
      });
    }
  }

  async asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }

  getAlgoliaKey(forceUpdate) {
    this.inProgress = true;
    this.errors = null;

    if ((commonStore.algoliaKey || commonStore.getCookie('algoliaKey')) && !forceUpdate) return Promise.resolve(commonStore.algoliaKey);
    if (commonStore.algoliaKeyOrganisation === this.values.organisation.tag && !forceUpdate) return Promise.resolve(commonStore.algoliaKey);

    return agent.Organisation.getAlgoliaKey(this.values.organisation._id, this.values.organisation.public)
      .then(data => {
        if (data) {
          commonStore.setAlgoliaKey(data.public_key, this.values.organisation.tag);
          return data.public_key.value;
        }
        return null;
      })
      .catch(action((err) => {
        this.errors = err.response && err.response.body && err.response.body.errors;
        throw err;
      }))
      .finally(action(() => { this.inProgress = false; }));
  }

  getOrganisationForPublic() {
      if (!this.values.orgTag) return Promise.resolve();

      this.inProgress = true;
      this.errors = null;

      return agent.Organisation.getForPublic(this.values.orgTag)
        .then(data => {
          this.setOrganisation(data.organisation);
          this.setFullOrgFetch(false);
          if(this.values.organisation.public) {
            return this.getAlgoliaKey(true).then(() => {
              return this.values.organisation;
            });
          } else {
            return this.values.organisation;
          }

        })
        .catch(action((err) => {
          this.errors = err.response && err.response.body && err.response.body.errors;
          throw err;
        }))
        .finally(action(() => { this.inProgress = false; }));
  }

  isKeyStillValid() {
    if (commonStore.algoliaKey && commonStore.algoliaKeyValidity) {
      let valid_until_date = new Date(parseInt(commonStore.algoliaKeyValidity));
      return (((new Date()).getTime() + 3600000) < valid_until_date.getTime());
    }
    return false;
  }

}

decorate(OrganisationStore, {
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

export default new OrganisationStore();