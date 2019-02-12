import React from 'react'
import { withStyles } from '@material-ui/core';
import { inject, observer } from "mobx-react";
import Header from '../components/header/Header';

class OnboardPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    // user here has provided an orgTag and is allowed to access organisation
    // if routes retrieve record by user, with welcomed=false, routes redirect to here with record.store populated
    if(this.props.recordStore.values.record) return;

    // is there a record link to the org in user data ? (double check)
    if(this.findOnboardRecordByUser(this.props.userStore.values.currentUser, this.props.organisationStore.values.organisation)) return;

    // @todo try to get record by email OR google id (check backflip)

    // try to find user other record to prefill this one


    // if no record, try to find other user record to prefill fields

    // if no record, create one and retrieve it from backflip

    // then, the record should be link to the user and the user should be saved
  }

  /**
   * @description Try to find user record with user object.
   * @param {*} user 
   * @param {*} organisation 
   */
  async findOnboardRecordByUser(user, organisation) {
    if(this.props.userStore.values.currentUser && this.props.userStore.values.currentUser.orgsAndRecords && 
      this.props.userStore.values.currentUser.orgsAndRecords.length > 0) {

      let currentOrgAndRecord = user.orgsAndRecords.find(orgAndRecord => orgAndRecord.organisation === organisation._id);
      if(!currentOrgAndRecord || (currentOrgAndRecord && currentOrgAndRecord.welcomed)) return null;

      this.props.recordStore.setRecordId(currentOrgAndRecord.record);
      return await this.props.recordStore.getRecord()
      .then((record) => {return record;}).catch(() => {return null;});

    } else {
      return null;
    }
  }

  render() {

    return (
      <div>
        <Header/>
        <main>
        </main>
      </div>
    );
  }
}

export default inject('commonStore', 'organisationStore', 'recordStore', 'userStore')(
  observer(
    withStyles(null)(OnboardPage)
  )
);
