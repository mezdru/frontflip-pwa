import { observable, action, decorate } from "mobx";
import agent from '../agent';
import organisationStore from './organisation.store';

class StatisticsStore {
  inProgress = false;
  errors = null;
  values = {
  };

  /**
   * @description Post search log
   */
  postSearchLog(orgId, tagsArray, query, resultsCount) {
    this.inProgress = true;
    this.errors = null;
    let storedOrgId =  organisationStore.values.organisation._id;

    return agent.SearchLog.postSearchLog(orgId || storedOrgId, tagsArray || [], query || null, resultsCount)
      .then(data => {
        return data; 
      })
      .catch(action((err) => {
        this.errors = err.response && err.response.body && err.response.body.errors;
        throw err;
      }))
      .finally(action(() => { this.inProgress = false; }));
  }

}

decorate(StatisticsStore, {
  inProgress: observable,
  errors: observable,
  values: observable,
  postSearchLog: action,
});

export default new StatisticsStore();