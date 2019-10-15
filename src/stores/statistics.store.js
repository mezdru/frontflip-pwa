import { observable, action, decorate } from "mobx";
import agent from '../agent';
import orgStore from './organisation.store';
import authStore from './auth.store';

class StatisticsStore {
  inProgress = false;
  errors = null;
  values = {
  };

  /**
   * @description Post search log
   */
  postSearchLog(orgId, tagsArray, query, resultsCount) {
    if(!authStore.isAuth()) return Promise.resolve();
    this.inProgress = true;
    this.errors = null;
    let storedOrgId =  orgStore.currentOrganisation._id;

    return agent.SearchLog.postSearchLog(orgId || storedOrgId, tagsArray || [], query || null, resultsCount)
      .then(res => {
        return (res ? res.data : null); 
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