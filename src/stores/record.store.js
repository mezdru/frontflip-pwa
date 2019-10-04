import { observable, action, decorate } from "mobx";
import agent from '../agent';
import userStore from './user.store';
import organisationStore from './organisation.store';

class RecordStore {
  inProgress = false;
  errors = null;
  values = {
    records: []
  };

  findRecord(recordId, recordTag) {
    if(!recordId && !recordTag) return null;
    return this.values.records.find(record => {
      if(recordId) return JSON.stringify(recordId) === JSON.stringify(record._id || record.objectID);
      else return recordTag === record.tag;
    });
  }

  addRecord(inRecord) {
    let index = this.values.records.findIndex(record => JSON.stringify(record._id) === JSON.stringify(inRecord._id || inRecord.objectID));
    if(index > -1) {
      this.values.records[index] = inRecord;
    } else {
      this.values.records.push(inRecord);
    }
  }

  getRecord(recordId) {
    if (!recordId) return Promise.reject(new Error('No record Id'));
    this.inProgress = true;
    this.errors = null;

    return agent.Record.get(recordId)
      .then(res => {
        this.addRecord(res.data);
        return res.data;
      })
      .catch(action((err) => {
        this.errors = err.response && err.response.body && err.response.body.errors;
        throw err;
      }))
      .finally(action(() => { this.inProgress = false; }));
  }

  getRecordByTag(recordTag) {
    if (!recordTag) return Promise.reject(new Error('No record Tag'));
    this.inProgress = true;
    this.errors = null;

    return agent.Record.getByTag(recordTag, organisationStore.values.orgId)
      .then(res => {
        if(res.data.length > 0){
          this.addRecord(res.data[0]);
          return res.data[0];
        } 

        return null;
      })
      .catch(action((err) => {
        console.log(err)
        this.errors = err.response && err.response.body && err.response.body.errors;
        throw err;
      }))
      .finally(action(() => { this.inProgress = false; }));
  }

  getRecordByUser() {
    if (!userStore.values.currentUser._id || !organisationStore.values.orgId) return Promise.reject(new Error('Bad parameters'));
    this.inProgress = true;
    this.errors = null;

    return agent.Record.getByUser(userStore.values.currentUser._id, organisationStore.values.orgId)
      .then(res => {
        this.addRecord(res.data);
        return res.data;
      })
      .catch(action((err) => {
        this.errors = err.response && err.response.body && err.response.body.errors;
        throw err;
      }))
      .finally(action(() => { this.inProgress = false; }));
  }

  /**
   * @description Post new record
   */
  postRecord(record) {
    this.inProgress = true;
    this.errors = null;

    return agent.Record.post(organisationStore.values.organisation._id, record)
      .then(res => {
        this.addRecord(res.data);
        return res.data; 
      })
      .catch(action((err) => {
        this.errors = err.response && err.response.body && err.response.body.errors;
        throw err;
      }))
      .finally(action(() => { this.inProgress = false; }));
  }

  /**
   * @description Update record
   */
  updateRecord(arrayOfFields, record) {
    this.inProgress = true;
    this.errors = null;

    let recordToUpdate = this.buildRecordToUpdate(arrayOfFields, record);

    return agent.Record.put(organisationStore.values.orgId, record._id, recordToUpdate)
      .then(res => { 
        this.addRecord(res.data);
        return res.data;
      })
      .catch(action((err) => {
        this.errors = err.response && err.response.body && err.response.body.errors;
        throw err;
      }))
      .finally(action(() => { this.inProgress = false; }));
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

  /**
   * @description Delete my record
   */
  deleteRecord() {
    this.inProgress = true;
    this.errors = null;

    return agent.Record.delete(this.values.recordId)
      .then(res => {
        this.values.record = {};
        this.values.recordId = '';
      })
      .catch(action((err) => {
        this.errors = err.response && err.response.body && err.response.body.errors;
        throw err;
      }))
      .finally(action(() => { this.inProgress = false; }));
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