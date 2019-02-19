import React from 'react'
import { withStyles } from '@material-ui/core';
import { inject, observer } from "mobx-react";
import Header from '../components/header/Header';
import OnboardWelcome from '../components/onboard/OnboardWelcome';
import OnboardStepper from '../components/onboard/OnboardStepper';

class OnboardPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inOnboarding: false
    };

    this.getRecordForUser = this.getRecordForUser.bind(this);
    this.handleEnterToOnboard = this.handleEnterToOnboard.bind(this);
  }

  componentDidMount() {
    this.getRecordForUser().then().catch(err => console.log(err));
  }

  getRecordForUser() {
    if(!this.props.recordStore.values.orgId) {
      this.props.recordStore.setOrgId(this.props.organisationStore.values.organisation._id);
    }
    return this.props.recordStore.getRecordByUser();
  }

  handleEnterToOnboard() {
    this.setState({inOnboarding: true});
  }

  render() {
    const {record} = this.props.recordStore.values;
    const {inOnboarding} = this.state;

    if(!inOnboarding) {
      return (
        <div>
          <Header/>
          <main>
            <OnboardWelcome handleEnterToOnboard={this.handleEnterToOnboard} />
            This is your record : <br/>
            {JSON.stringify(record)}
          </main>
        </div>
      );
    } else {
      return (
        <div>
          <main>
            <OnboardStepper />
          </main>
        </div>
      );
    }
  }
}

export default inject('commonStore', 'organisationStore', 'recordStore', 'userStore')(
  observer(
    withStyles(null)(OnboardPage)
  )
);
