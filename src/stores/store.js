import { action } from "mobx";
import agent from '../agent';

class Store {
  inProgress = false;
  error = false;

  constructor(resourceName) {
    if (!resourceName) {
      throw new Error('The resource name is required.');
    }
    this.resourceName = resourceName;
  }

  fetchResource(resourceId) {
    if (!resourceId) return Promise.reject(new Error('No resource Id'));
    this.inProgress = true;
    this.errors = null;

    return agent[this.resourceName].getOne(resourceId)
      .then(res => {
        return res.data;
      })
      .catch(action((err) => {
        this.errors = err.response && err.response.body && err.response.body.errors;
        throw err;
      }))
      .finally(action(() => { this.inProgress = false; }));
  }

  fetchResources(query) {
    this.inProgress = true;
    this.errors = null;

    return agent[this.resourceName].get(query)
      .then(res => {
        return res.data;
      })
      .catch(action((err) => {
        this.errors = err.response && err.response.body && err.response.body.errors;
        throw err;
      }))
      .finally(action(() => { this.inProgress = false; }));
  }

  postResource(resource) {
    this.inProgress = true;
    this.errors = null;

    return agent[this.resourceName].post(resource)
      .then(res => {
        return res.data;
      })
      .catch(action((err) => {
        this.errors = err.response && err.response.body && err.response.body.errors;
        throw err;
      }))
      .finally(action(() => { this.inProgress = false; }));
  }

  deleteResource(resourceId) {
    this.inProgress = true;
    this.errors = null;

    return agent[this.resourceName].delete(resourceId)
      .then(res => {
        return true;
      })
      .catch(action((err) => {
        this.errors = err.response && err.response.body && err.response.body.errors;
        throw err;
      }))
      .finally(action(() => { this.inProgress = false; }));
  }

  updateResource(resourceId, resourceToUpdate, orgId) {
    this.inProgress = true;
    this.errors = null;

    return agent[this.resourceName].put(orgId, resourceId, resourceToUpdate)
      .then(res => { 
        return res.data;
      })
      .catch(action((err) => {
        this.errors = err.response && err.response.body && err.response.body.errors;
        throw err;
      }))
      .finally(action(() => { this.inProgress = false; }));
  }

  customRequest(requestName, data) {
    if (!requestName) return Promise.reject(new Error('No request name'));
    this.inProgress = true;
    this.errors = null;

    return agent[this.resourceName][requestName](data)
      .then(res => {
        return res.data;
      })
      .catch(action((err) => {
        this.errors = err.response && err.response.body && err.response.body.errors;
        throw err;
      }))
      .finally(action(() => { this.inProgress = false; }));
  }
}

export default Store;