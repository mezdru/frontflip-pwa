import { observable, action, decorate } from "mobx";
import agent from '../agent';

class ClapStore {
  inProgress = false;
  errors = null;
  values = {
    clap: {},
    currentRecordId: null,
    currentRecordClapCount: [],
    currentClapHistory: []
  };

  setClap(clap) {
    this.values.clap = clap;
  }

  setCurrentRecordId(recordId) {
    this.values.currentRecordId = recordId;
  }

  setCurrentRecordClapCount(clapCount) {
    this.values.currentRecordClapCount = clapCount;
  }

  setCurrentClapHistory(clapHistory) {
    this.values.currentClapHistory = clapHistory;
  }

  reset() {
    this.values.clap = {};
    this.values.currentRecordId = null;
    this.values.currentRecordClapCount = [];
    this.values.currentClapHistory = [];
  }

  postClap() {
    if (!this.values.clap || Object.keys(this.values.clap).length === 0) return Promise.reject(new Error('No clap object'));
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
        this.setCurrentRecordClapCount(response.data);
        return this.values.currentRecordClapCount;
      })
      .catch(action((err) => {
        this.errors = err.response && err.response.body && err.response.body.errors;
        throw err;
      }))
      .finally(action(() => { this.inProgress = false; }));
  }

  getClapHistory() {
    if (!this.values.currentRecordId) return Promise.reject(new Error('No record id'));
    this.inProgress = true;
    this.errors = null;

    return agent.Clap.getClapHistory(this.values.currentRecordId)
      .then(response => {
        this.setCurrentClapHistory(response.data);
        return this.values.currentClapHistory;
      })
      .catch(action((err) => {
        this.setCurrentClapHistory([]);
        this.errors = err.response && err.response.body && err.response.body.errors;
        throw err;
      }))
      .finally(action(() => { this.inProgress = false; }));
  }
}

decorate(ClapStore, {
  inProgress: observable,
  errors: observable,
  values: observable,
  reset: action,
  getClapCountByProfile: action,
  postClap: action,
  setClap: action,
  setCurrentRecordId: action,
  setCurrentRecordClapCount: action,
  setCurrentClapHistory: action,
  getClapHistory: action
});

export default new ClapStore();