import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import {observe} from 'mobx';

const withClapManagement = (ComponentToWrap) => {
  class ClapManagement extends Component {

    getClapCount = (hashtagId) => {
      var clapCountEntry = this.props.clapStore.values.currentRecordClapCount.find(entry => entry._id === hashtagId);
      return (clapCountEntry ? clapCountEntry.claps : null);
    }

    observeClapCount = (cb) => {
      return observe(this.props.clapStore.values, 'currentRecordClapCount', cb);
    }

    handleClap = (recipient, hashtag,  given) => {
      if(!recipient || !hashtag || !this.props.recordStore.currentUserRecord) return;
      this.props.clapStore.setCurrentRecordId(recipient);

      var clap = {
        recipient: recipient,
        hashtag: hashtag,
        given: given || 1,
        giver: this.props.recordStore.currentUserRecord._id,
        organisation: this.props.orgStore.currentOrganisation._id
      };

      this.props.clapStore.setClap(clap);
      return this.props.clapStore.postClap();
    }

    canClap = (recipient) => {
      let record = this.props.recordStore.currentUserRecord;
      return record && record._id !== recipient;
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

  ClapManagement = inject('clapStore', 'orgStore', 'recordStore')(observer(ClapManagement));

  return ClapManagement;
}
export default withClapManagement;
