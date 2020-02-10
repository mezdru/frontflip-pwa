import { observable, action, decorate, computed } from "mobx";
import userStore from "./user.store";
import orgStore from "./organisation.store";
import Store from "./store";
import undefsafe from "undefsafe";
import commonStore from "./common.store";
import { replaceAndKeepReference } from "../services/utils.service";

class RecordStore extends Store {
  recordsById = {};
  recordsByTag = {};

  constructor() {
    super("Record");
  }

  /**
   * @description Onboard mode : edit OR create : return record linked to the url recordTag
   *              No mode ? return user record
   */
  get workingRecord() {
    const { url } = commonStore;
    
    if (url.params.onboardMode === "edit" || url.params.onboardMode === "create") {
      return this.currentUrlRecord;
    }
    return this.currentUserRecord;
  }

  get currentUserRecord() {
    let orgAndRecord =
      userStore.currentUser &&
      userStore.currentUser.orgsAndRecords.find(
        oar =>
          (oar.organisation._id || oar.organisation) ===
          undefsafe(orgStore.currentOrganisation, "_id")
      );
    if (!orgAndRecord || !orgAndRecord.record) return null;
    return this.getRecord(orgAndRecord.record._id || orgAndRecord.record);
  }

  get currentUrlRecord() {
    return this.getRecord(null, commonStore.url.params.recordTag);
  }

  getRecord(recordId, recordTag) {
    if (!recordId && !recordTag) return null;
    if(!recordId && recordTag) return this.recordsByTag[undefsafe(orgStore.currentOrganisation, '_id') + '-' + recordTag];
    else if(recordId) return this.recordsById[recordId];
  }

  async getOrFetchRecord(recordId, recordTag, orgId) {
    let record = this.getRecord(recordId, recordTag);
    if (!record && recordId) record = await this.fetchRecord(recordId);
    if (!record && recordTag) record = await this.fetchByTag(recordTag, orgId);
    return record;
  }

  addRecord(inRecord) {
    if (!inRecord) return null;
    if (inRecord.objectID) inRecord._id = inRecord.objectID;
    let inRecordEntry = this.recordsById[inRecord._id];

    if(inRecordEntry) {
      replaceAndKeepReference(inRecordEntry, inRecord);
      replaceAndKeepReference(this.recordsByTag[inRecord.organisation + '-' + inRecord.tag], inRecord);
    }
    else {
      if(inRecord.tag) this.recordsByTag[inRecord.organisation + '-' + inRecord.tag] = inRecord;
      if(inRecord._id) this.recordsById[inRecord._id] = inRecord; 
    }
  }

  async fetchRecord(recordId) {
    let record = await super.fetchResource(recordId);
    this.addRecord(record);
    return record;
  }

  async postRecord(recordToPost) {
    delete recordToPost.tag;
    let record = await super.postResource(recordToPost);
    replaceAndKeepReference(recordToPost, record);
    this.addRecord(recordToPost);
    return recordToPost;
  }

  async deleteRecord(recordId, orgId) {
    await super.deleteResource(recordId, orgId);
  }

  async fetchByTag(recordTag, orgId) {
    if (!recordTag || !orgId)
      return Promise.reject(new Error("No record Tag or no organisation ID"));
    let records = await super.fetchResources(
      `?tag=${recordTag.replace("#", "%23")}&organisation=${orgId}`
    );

    this.addRecord(records[0]);
    return records[0];
  }

  async updateRecord(recordId, arrayOfFields, record) {
    let recordToUpdate = this.buildRecordToUpdate(arrayOfFields, record);
    let recordUpdated = await super.updateResource(
      recordId,
      recordToUpdate,
      orgStore.currentOrganisation._id
    );
    this.addRecord(recordUpdated);
    return recordUpdated;
  }

  async fetchPopulatedForUser(orgId) {
    if (!orgId) throw new Error("Organisation id is required");
    let record = await super.fetchResources(
      `/populated?user=${userStore.currentUser._id}&organisation=${orgId}`
    );
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
  recordsById: observable,
  recordsByTag: observable,
  currentUserRecord: computed,
  currentUrlRecord: computed,
  workingRecord: computed,
  postRecord: action,
  addRecord: action,
  updateRecord: action,
  deleteRecord: action,
  fetchPopulatedForUser: action,
  fetchByTag: action,
  fetchRecord: action
});

export default new RecordStore();
