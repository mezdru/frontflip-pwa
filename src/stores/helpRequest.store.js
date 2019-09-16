import { observable, action, decorate } from "mobx";
import agent from '../agent';

class HelpRequestStore {
  inProgress = false;
  errors = null;
  values = {
    helpRequest: {
      recipients: [],
      organisation: '',
      sender: '',
      message: 'Message',
      results: 0,
      query: '',
      tags: []
    }
  };

  setHelpRequest(hr) {
    this.values.helpRequest = hr;
  }

  /**
   * @description Post search log
   */
  postHelpRequest() {
    this.inProgress = true;
    this.errors = null;

    return agent.HelpRequest.post(this.values.helpRequest)
      .then(res => {
        this.setHelpRequest(res.data);
        return this.values.helpRequest; 
      })
      .catch(action((err) => {
        this.errors = err.response && err.response.body && err.response.body.errors;
        throw err;
      }))
      .finally(action(() => { this.inProgress = false; }));
  }

}

decorate(HelpRequestStore, {
  inProgress: observable,
  errors: observable,
  values: observable,
  postHelpRequest: action,
  setHelpRequest: action,
});

export default new HelpRequestStore();