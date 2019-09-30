import { observable, action, decorate } from "mobx";
import agent from '../agent';
import userStore from './user.store';
import organisationStore from './organisation.store';

class RecordStore {
  inProgress = false;
  errors = null;
  values = {
    orgId: '',
    recordId: '',
    recordTag: '',
    record: {},
    displayedRecord: {},
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
  setDisplayedRecord(record) {
    this.values.displayedRecord = record;
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
      .then(res => {
        this.values.record = (res ? res.data : {});
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
      .then(res => {
        this.setDisplayedRecord(res.data.length > 0 ? res.data[0] : res.data);
        return this.values.displayedRecord;
      })
      .catch(action((err) => {
        console.log(err)
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
      .then(res => {
        this.values.record = (res ? res.data : null);
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

    return agent.Record.post(organisationStore.values.organisation._id, record || this.values.record)
      .then(res => {
        if(!record)
          this.values.record = res.data;
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
  updateRecord(arrayOfFields) {
    this.inProgress = true;
    this.errors = null;

    let recordToUpdate = this.buildRecordToUpdate(arrayOfFields);

    return agent.Record.put(this.values.orgId, this.values.recordId, recordToUpdate)
      .then(res => { this.values.record = (res ? res.data : {}); return this.values.record;})
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
  setOrgId: action,
  reset: action,
  setRecordTag: action,
  setRecordId: action,
  setDisplayedRecord: action,
  setRecord: action,
  getRecord: action,
  getRecordByTag: action,
  postRecord: action,
  updateRecord: action,
  deleteRecord: action
});

export default new RecordStore();