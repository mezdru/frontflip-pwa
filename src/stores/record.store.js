import { observable, action, decorate } from "mobx";
import agent from '../agent';
import userStore from './user.store';

class RecordStore {
  inProgress = false;
  errors = null;
  values = {
    orgId: '',
    recordId: '',
    recordTag: '',
    record: {},
    otherRecord: {},
  };

  setOrgId(orgId) {
    this.values.orgId = orgId;
  }
  setRecordTag(recordTag) {
    if(recordTag)
      recordTag = recordTag.replace('#', '%23');
    this.values.recordTag = recordTag;
  }
  setRecordId(recordId) {
    this.values.recordId = recordId;
  }
  setRecord(record) {
    this.values.record = record;
  }
  setOtherRecord(record) {
    this.values.otherRecord = record;
  }

  reset() {
    this.values.orgId = '';
    this.values.recordId = '';
    this.values.record = {};
  }

  getRecord() {
    if (!this.values.recordId) return Promise.reject(new Error('No record Id'));
    this.inProgress = true;
    this.errors = null;

    return agent.Record.get(this.values.recordId)
      .then(data => {
        this.values.record = (data ? data.record : {});
        return this.values.record;
      })
      .catch(action((err) => {
        this.errors = err.response && err.response.body && err.response.body.errors;
        throw err;
      }))
      .finally(action(() => { this.inProgress = false; }));
  }

  getRecordByTag() {
    if (!this.values.recordTag) return Promise.reject(new Error('No record Tag'));
    this.inProgress = true;
    this.errors = null;

    return agent.Record.getByTag(this.values.recordTag, this.values.orgId)
      .then(data => {
        this.values.otherRecord = (data ? data.record : {});
        return this.values.otherRecord;
      })
      .catch(action((err) => {
        this.errors = err.response && err.response.body && err.response.body.errors;
        throw err;
      }))
      .finally(action(() => { this.inProgress = false; }));
  }

  getRecordByUser() {
    if (!userStore.values.currentUser._id || !this.values.orgId) return Promise.reject(new Error('Bad parameters'));
    this.inProgress = true;
    this.errors = null;

    return agent.Record.getByUser(userStore.values.currentUser._id, this.values.orgId)
      .then(data => {
        this.values.record = (data ? data.record : null);
        return this.values.record;
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

    return agent.Record.post(this.values.orgId, record || this.values.record)
      .then(data => {
        if(!record)
          this.values.record = data.record;
        return data.record; 
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
  updateRecord(arrayOfFields) {
    this.inProgress = true;
    this.errors = null;

    let recordToUpdate = this.buildRecordToUpdate(arrayOfFields);
    console.log(recordToUpdate.name)

    return agent.Record.put(this.values.orgId, this.values.recordId, recordToUpdate)
      .then(data => { this.values.record = (data ? data.record : {}); return this.values.record;})
      .catch(action((err) => {
        this.errors = err.response && err.response.body && err.response.body.errors;
        throw err;
      }))
      .finally(action(() => { this.inProgress = false; }));
  }

  buildRecordToUpdate(arrayOfFields) {
    let recordToUpdate = {};
    if (!arrayOfFields) {
      recordToUpdate = this.values.record;
    } else {
      arrayOfFields.forEach(field => {
        recordToUpdate[field] = this.values.record[field];
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
      .then(data => {
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
  setOrgId: action,
  reset: action,
  setRecordTag: action,
  setRecordId: action,
  setRecord: action,
  getRecord: action,
  getRecordByTag: action,
  postRecord: action,
  updateRecord: action,
  deleteRecord: action
});

export default new RecordStore();