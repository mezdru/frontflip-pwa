import React, { Component } from "react";
import { inject, observer } from "mobx-react";

const withClapManagement = (ComponentToWrap) => {
  class ClapManagement extends Component {

    getClapCount = (hashtagId) => {
      var clapCountEntry = this.props.clapStore.values.currentRecordClapCount.find(entry => entry._id === hashtagId);
      return (clapCountEntry ? clapCountEntry.claps : 0);
    }

    handleClap = (recipient, hashtag) => {
      var clap = {
        recipient: recipient,
        hashtag: hashtag,
        given: 1,
        giver: this.props.recordStore.values.record._id,
        organisation: this.props.organisationStore.values.organisation._id
      };

      this.props.clapStore.setClap(clap);
      this.props.clapStore.postClap()
      .then(() => this.props.clapStore.getClapCountByProfile());
    }

    render() {
      return (
        <ComponentToWrap {...this.props} 
          handleClap={this.handleClap} 
          getClapCount={this.getClapCount}
        />
      )
    }
  }

  ClapManagement = inject('clapStore', 'organisationStore', 'recordStore')(observer(ClapManagement));

  return ClapManagement;
}
export default withClapManagement;
