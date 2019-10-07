import { observable, action, decorate } from "mobx";
import agent from '../agent';
import userStore from './user.store';
import orgStore from './organisation.store';
import Store from './store';
import undefsafe from 'undefsafe';

class RecordStore extends Store {
  records = [];

  constructor() {
    super("Record");
  }

  get currentUserRecord() {
    let orgAndRecord = userStore.currentUser && userStore.currentUser.orgsAndRecords.find(oar => oar.organisation === undefsafe(orgStore.currentOrganisation, '_id'));
    if(!orgAndRecord) return null;
    return this.getRecord(orgAndRecord.record._id || orgAndRecord.record);
  }

  getRecord(recordId, recordTag) {
    if (!recordId && !recordTag) return null;
    return this.records.find(record => {
      if (recordId) return JSON.stringify(recordId) === JSON.stringify(record._id || record.objectID);
      else return recordTag === record.tag;
    });
  }

  addRecord(inRecord) {
    let index = this.records.findIndex(record => JSON.stringify(record._id) === JSON.stringify(inRecord._id || inRecord.objectID));
    if (index > -1) {
      this.records[index] = inRecord;
    } else {
      this.records.push(inRecord);
    }
  }

  async fetchRecord(recordId) {
    let record = await super.fetchResource(recordId);
    this.addRecord(record);
    return record;
  }

  async postRecord(recordToPost) {
    let record = await super.postResource(recordToPost);
    this.addRecord(record);
    return record;
  }

  async deleteRecord(recordId) {
    await super.deleteResource(recordId);
  }

  async fetchByTag(recordTag, orgId) {
    if (!recordTag || !orgId) return Promise.reject(new Error('No record Tag or no organisation ID'));
    let records = await super.fetchResources(`?tag=${recordTag}&organisation=${orgId}`);
    this.addRecord(records[0]);
    return records[0];
  }

  async updateRecord(recordId, arrayOfFields, record) {
    let recordToUpdate = this.buildRecordToUpdate(arrayOfFields, record);
    let recordUpdated = await super.updateResource(recordId, recordToUpdate, orgStore.values.orgId);
    this.addRecord(recordUpdated);
    return recordUpdated;
  }

  async fetchPopulatedForUser(orgId) {
    if(!orgId) throw new Error('Organisation id is required');
    let record = await super.fetchResources(`/populated?user=${userStore.currentUser}&organisation=${orgId}`)
    this.addRecord(record);
    return record;
  }

  // fetchRecordByUser() {
  //   if (!userStore.currentUser._id || !orgStore.values.orgId) return Promise.reject(new Error('Bad parameters'));
  //   this.inProgress = true;
  //   this.errors = null;

  //   return agent.Record.getByUser(userStore.currentUser._id, orgStore.values.orgId)
  //     .then(res => {
  //       this.addRecord(res.data);
  //       return res.data;
  //     })
  //     .catch(action((err) => {
  //       this.errors = err.response && err.response.body && err.response.body.errors;
  //       throw err;
  //     }))
  //     .finally(action(() => { this.inProgress = false; }));
  // }

  buildRecordToUpdate(arrayOfFields, record) {
    let recordToUpdate = {};
    if (!arrayOfFields) {
      recordToUpdate = record;
    } else {
      arrayOfFields.forEach(field => {
        recordToUpdate[field] = record[field];
      });
    }
    return recordToUpdate;
  }

}

decorate(RecordStore, {
  inProgress: observable,
  errors: observable,
  values: observable,
  reset: action,
  getRecord: action,
  findRecord: action,
  getRecordByTag: action,
  postRecord: action,
  updateRecord: action,
  deleteRecord: action
});

export default new RecordStore();