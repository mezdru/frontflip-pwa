import { observable, action, decorate } from "mobx";
import agent from '../agent';
import commonStore from "./common.store";

class OrganisationStore {
    inProgress = false;
    errors = null;
    values = {
        orgTag: '',
        organisation: {},
        public_key: {}
    };

    setOrgTag(orgTag) {
        this.values.orgTag = orgTag;
    }

    setOrganisation(organisation) {
        this.values.organisation = organisation;
    }
    
    setPublicKey(public_key) {
        this.values.public_key = public_key;
    }

    reset() {
        this.values.organisation = {};
        this.values.public_key = {};
        this.values.orgTag = '';
    }

    getAlgoliaKey() {
        this.inProgress = true;
        this.errors = null;

        return agent.Organisation.getAlgoliaKey(this.values.organisation.tag, this.values.organisation.public)
            .then(data => { this.setPublicKey(data.public_key);})
            .catch(action((err) => {
                this.errors = err.response && err.response.body && err.response.body.errors;
                throw err;
            }))
            .finally(action(()=> { this.inProgress = false; }));
    }

    getOrganisationForPublic() {
        this.inProgress = true;
        this.errors = null;

        return agent.Organisation.getForPublic(this.values.orgTag)
            .then(data => { this.setOrganisation(data.organisation);})
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
    reset: action,
    setOrganisation: action,
    setOrgTag: action,
    setPublicKey: action,
    getAlgoliaKey: action,
    getOrganisationForPublic: action
});

export default new RecordStore();