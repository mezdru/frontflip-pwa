import { observable, computed, action, decorate } from "mobx";
import agent from '../agent';
import commonStore from "./common.store";

class RecordStore {
    inProgress = false;
    errors = null;
    values = {
        orgTag: '',
        recordTag: '',
        record: {}
    };

    setOrgTag(orgTag) {
        this.values.orgTag = orgTag;
    }
    setRecordTag(recordTag) {
        this.values.recordTag = recordTag;
    }
    setRecord(record) {
        this.values.record = record;
    }

    reset() {
        this.values.orgTag = '';
        this.values.recordTag = '';
        this.values.record = {};
    }

    /**
     * @description Get record by orgTag and recordTag
     */
    getRecordByTag() {
        this.inProgress = true;
        this.errors = null;

        return agent.Record.get(this.values.orgTag, this.values.recordTag)
            .then(data => { this.values.record = data.record;})
            .catch(action((err) => {
                this.errors = err.response && err.response.body && err.response.body.errors;
                throw err;
            }))
            .finally(action(()=> { this.inProgress = false; }));
    }

    /**
     * @description Post new record
     */
    postRecord() {
        this.inProgress = true;
        this.errors = null;

        return agent.Record.post(this.values.orgTag, this.values.record)
            .then(data => { this.values.record = data.record;})
            .catch(action((err) => {
                this.errors = err.response && err.response.body && err.response.body.errors;
                throw err;
            }))
            .finally(action(()=> { this.inProgress = false; }));
    }

    /**
     * @description Update record
     */
    updateRecord() {
        this.inProgress = true;
        this.errors = null;

        return agent.Record.put(this.values.orgTag, this.values.recordTag, this.values.record)
            .then(data => { this.values.record = data.record;})
            .catch(action((err) => {
                this.errors = err.response && err.response.body && err.response.body.errors;
                throw err;
            }))
            .finally(action(()=> { this.inProgress = false; }));
    }

    /**
     * @description Get my record
     */
    getMyRecord() {
        this.inProgress = true;
        this.errors = null;

        return agent.Record.getMe(this.values.orgTag)
            .then(data => { this.values.record = data.record;})
            .catch(action((err) => {
                this.errors = err.response && err.response.body && err.response.body.errors;
                throw err;
            }))
            .finally(action(()=> { this.inProgress = false; }));
    }

    /**
     * @description Delete my record
     */
    deleteMyRecord() {
        this.inProgress = true;
        this.errors = null;

        return agent.Record.deleteMe(this.values.orgTag)
            .then(data => { this.values.record = data.record;})
            .catch(action((err) => {
                this.errors = err.response && err.response.body && err.response.body.errors;
                throw err;
            }))
            .finally(action(()=> { this.inProgress = false; }));
    }

}

decorate(RecordStore, {
    inProgress: observable,
    errors: observable,
    values: observable,
    setOrgTag: action,
    reset: action,
    setRecordTag: action,
    setRecord: action,
    getRecordByTag: action,
    postRecord: action,
    updateRecord: action,
    getMyRecord: action,
    deleteMyRecord: action
});

export default new RecordStore();