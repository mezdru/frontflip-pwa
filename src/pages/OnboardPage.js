import React from 'react'
import { inject, observer } from "mobx-react";
import { observe } from 'mobx';
import OnboardWelcome from '../components/onboard/OnboardWelcome';
import OnboardStepper from '../components/onboard/OnboardStepper';
import { withStyles, Grid } from '@material-ui/core';
import Banner from '../components/utils/banner/Banner';
import Logo from '../components/utils/logo/Logo';

const styles = {
  logo: {
    width: '6.5rem',
    height: '6.5rem',
    boxShadow: '0 5px 15px -1px darkgrey, 0 0 0 5px transparent',
    bottom: '3.6rem',
    marginBottom: '-7rem',
    zIndex: 2,
  }
};

class OnboardPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inOnboarding: false
    };
  }

  componentDidMount() {
    observe(this.props. recordStore.values, 'record', (change) => {
      this.forceUpdate();
    });
    this.getRecordForUser().then().catch(err => console.log(err));
  }

  getRecordForUser = () => {
    if(!this.props.recordStore.values.orgId) {
      this.props.recordStore.setOrgId(this.props.organisationStore.values.organisation._id);
    }
    return this.props.recordStore.getRecordByUser();
  }

  handleEnterToOnboard = () => {
    this.setState({inOnboarding: true});
  }

  render() {
    const {record} = this.props.recordStore.values;
    const {inOnboarding} = this.state;
    const {theme, classes} = this.props;

    if(!inOnboarding) {
      return (
        <div>
          <main>
          <Grid container direction={"column"} justify={"space-around"} alignItems={"center"}>
            <Grid container item alignItems={"stretch"}>
              <Banner />
            </Grid>
            <Grid item container justify={"center"}>
              <Logo type={'organisation'} alt="org-logo" className={classes.logo} />
            </Grid>
            <Grid container item xs={12} sm={6} lg={4} alignContent={"center"} justify='center'>
            <OnboardWelcome handleEnterToOnboard={this.handleEnterToOnboard} />
            This is your record : <br/>
            {JSON.stringify(record)}
          </Grid>
          </Grid>
            
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
    withStyles(styles, {withTheme: true})(OnboardPage)
  )
);
