import agent from '../agent';

class EmailService {
  inProgress = false;
  errors = null;

  confirmLoginEmail(orgTag) {
    this.inProgress = true;
    this.errors = null;

    return agent.Email.confirmLoginEmail(orgTag)
      .then((response) => {
        return true;
      })
      .catch((err) => {
        this.errors = err.response && err.response.body && err.response.body.errors;
        throw err;
      })
      .finally(() => { this.inProgress = false; });
  }

  sendConfirmIntegrationEmail(integrationName) {
    this.inProgress = true;
    this.errors = null;

    return agent.Email.confirmIntegrationEmail(integrationName)
      .then((response) => {
        return true;
      })
      .catch((err) => {
        this.errors = err.response && err.response.body && err.response.body.errors;
        throw err;
      })
      .finally(() => { this.inProgress = false; });
  }

  sendHelpRequest(helpRequestId) {
    this.inProgress = true;
    this.errors = null;

    return agent.Email.sendHelpRequest(helpRequestId)
      .then((response) => {
        return true;
      })
      .catch((err) => {
        this.errors = err.response && err.response.body && err.response.body.errors;
        throw err;
      })
      .finally(() => { this.inProgress = false; });
  }
}



export default new EmailService();