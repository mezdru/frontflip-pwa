import { observable, action, decorate, computed } from "mobx";
import userStore from './user.store';
import orgStore from './organisation.store';
import Store from './store';
import undefsafe from 'undefsafe';
import commonStore from "./common.store";
import {replaceAndKeepReference } from '../services/utils.service';

class RecordStore extends Store {
  records = [];

  constructor() {
    super("Record");
  }

  get currentUserRecord() {
    let orgAndRecord = userStore.currentUser && userStore.currentUser.orgsAndRecords.find(oar => (oar.organisation._id || oar.organisation) === undefsafe(orgStore.currentOrganisation, '_id'));
    if(!orgAndRecord || !orgAndRecord.record) return null;
    return this.getRecord(orgAndRecord.record._id || orgAndRecord.record);
  }

  get currentUrlRecord() {
    return this.getRecord(null, commonStore.url.params.recordTag);
  }

  getRecord(recordId, recordTag) {
    if (!recordId && !recordTag) return null;
    return this.records.find(record => {
      if (recordId) return JSON.stringify(recordId) === JSON.stringify(record._id || record.objectID);
      else return ((recordTag === record.tag) && (record.organisation === orgStore.currentOrganisation._id) );
    });
  }

  async getOrFetchRecord(recordId, recordTag, orgId) {
    let record = this.getRecord(recordId, recordTag);
    if (!record && recordId) record = await this.fetchRecord(recordId);
    if (!record && recordTag) record = await this.fetchByTag(recordTag, orgId);
    return record;
  }

  addRecord(inRecord) {
    if(!inRecord) return null;
    if(inRecord.objectID) inRecord._id = inRecord.objectID;
    let index = this.records.findIndex(record => JSON.stringify(record._id) === JSON.stringify(inRecord._id || inRecord.objectID));
    if (index > -1) {
      replaceAndKeepReference(this.records[index], inRecord);
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
    let records = await super.fetchResources(`?tag=${recordTag.replace('#', '%23')}&organisation=${orgId}`);
    this.addRecord(records[0]);
    return records[0];
  }

  async updateRecord(recordId, arrayOfFields, record) {
    let recordToUpdate = this.buildRecordToUpdate(arrayOfFields, record);
    let recordUpdated = await super.updateResource(recordId, recordToUpdate, orgStore.currentOrganisation._id);
    this.addRecord(recordUpdated);
    return recordUpdated;
  }

  async fetchPopulatedForUser(orgId) {
    if(!orgId) throw new Error('Organisation id is required');
    let record = await super.fetchResources(`/populated?user=${userStore.currentUser._id}&organisation=${orgId}`)
    this.addRecord(record);
    return record;
  }

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
  records: observable,
  currentUserRecord: computed,
  currentUrlRecord: computed,
  postRecord: action,
  addRecord: action,
  updateRecord: action,
  deleteRecord: action,
  fetchPopulatedForUser: action,
  fetchByTag: action,
  fetchRecord: action
});

export default new RecordStore();