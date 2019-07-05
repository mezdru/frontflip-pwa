import { observable, action, decorate } from "mobx";
import agent from '../agent';
import commonStore from "./common.store";
import userStore from "./user.store";

class ClapStore {
  inProgress = false;
  errors = null;
  values = {
    clap: {},
    currentRecordId: null,
    currentRecordClapCount: []
  };

  setClap(clap) {
    this.values.clap = clap;
  }

  reset() {
    this.values.clap = {};
  }

  postClap() {
    if (!this.values.clap || this.values.clap === {}) return Promise.reject(new Error('No clap object'));
    this.inProgress = true;
    this.errors = null;

    return agent.Clap.post(this.values.clap)
      .then(response => {
        this.values.clap = response.data;
        return this.values.clap;
      })
      .catch(action((err) => {
        this.errors = err.response && err.response.body && err.response.body.errors;
        throw err;
      }))
      .finally(action(() => { this.inProgress = false; }));
  }

  getClapCountByProfile() {
    if (!this.values.currentRecordId) return Promise.reject(new Error('No record id'));
    this.inProgress = true;
    this.errors = null;

    return agent.Clap.getClapCountByProfile(this.values.currentRecordId)
      .then(response => {
        this.values.currentRecordClapCount = response.data;
        return this.values.currentRecordClapCount;
      })
      .catch(action((err) => {
        this.errors = err.response && err.response.body && err.response.body.errors;
        throw err;
      }))
      .finally(action(() => { this.inProgress = false; }));
  }
}

decorate(OrganisationStore, {
  inProgress: observable,
  errors: observable,
  values: observable,
  reset: action,
});

export default new ClapStore();