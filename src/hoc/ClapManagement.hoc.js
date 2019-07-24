import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import {observe} from 'mobx';

const withClapManagement = (ComponentToWrap) => {
  class ClapManagement extends Component {

    getClapCount = (hashtagId) => {
      var clapCountEntry = this.props.clapStore.values.currentRecordClapCount.find(entry => entry._id === hashtagId);
      return (clapCountEntry ? clapCountEntry.claps : 0);
    }

    observeClapCount = (cb) => {
      observe(this.props.clapStore.values, 'currentRecordClapCount', cb);
    }

    handleClap = (recipient, hashtag,  given) => {
      if(!recipient || !hashtag || !this.props.recordStore.values.record._id) return;
      this.props.clapStore.setCurrentRecordId(recipient);

      var clap = {
        recipient: recipient,
        hashtag: hashtag,
        given: given || 1,
        giver: this.props.recordStore.values.record._id,
        organisation: this.props.organisationStore.values.organisation._id
      };

      this.props.clapStore.setClap(clap);
      return this.props.clapStore.postClap();
    }

    canClap = (recipient) => {
      return !(this.props.recordStore.values.record._id === (recipient));
    }

    render() {
      return (
        <ComponentToWrap {...this.props} 
          handleClap={this.handleClap} 
          getClapCount={this.getClapCount}
          canClap={this.canClap}
          observeClapCount={this.observeClapCount}
        />
      )
    }
  }

  ClapManagement = inject('clapStore', 'organisationStore', 'recordStore')(observer(ClapManagement));

  return ClapManagement;
}
export default withClapManagement;
