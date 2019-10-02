import React, { Suspense } from 'react'
import { inject, observer } from "mobx-react";
import OnboardWelcome from '../components/onboard/OnboardWelcome';
import OnboardStepper from '../components/onboard/OnboardStepper';
import { withStyles, Grid } from '@material-ui/core';
import undefsafe from 'undefsafe';
import ReactGA from 'react-ga';
import BannerResizable from '../components/utils/banner/BannerResizable';
import Header from '../components/header/Header';

const Intercom = React.lazy(() => import('react-intercom'));

console.debug('Loading OnboardPage');

ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS_ID);

const styles = theme => ({
  root: {
    height: '100vh',
  },
  logo: {
    width: '6.5rem',
    height: '6.5rem',
    boxShadow: '0 5px 15px -1px darkgrey, 0 0 0 5px transparent',
    bottom: '3.6rem',
    marginBottom: '-7rem',
    zIndex: 2,
  },
  blackFilter: {
    position: 'fixed',
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
    opacity: 0.35,
    overflow: 'hidden',
  },
  banner: {
    position: 'fixed',
  },
  container: {
    position: 'absolute',
    backgroundColor: 'white',
    width: '100%',
    zIndex: 2,
    borderRadius: 5,
    boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
    overflow: 'hidden',
    margin: 16,
    [theme.breakpoints.down('xs')]: {
      top: 48,
      marginTop: 32,
      left: 0,
      maxWidth: 'calc(100% - 32px)'
    }
  }
});

class OnboardPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inOnboarding: undefsafe(this.props, 'match.params.step') !== undefined,
      editMode: this.props.edit || false
    };

    // clear wings bank
    this.props.commonStore.setLocalStorage('wingsBank', [], true);
  }

  componentDidMount() {
    this.props.history.listen((location, action) => {
      ReactGA.pageview(window.location.pathname);
      // setTimeout(() => this.makeSteps(this.props.match.params.step), 10);
    });

    if (this.props.match && this.props.match.params && this.props.match.params.recordId && this.props.edit) {
      this.props.recordStore.setRecordId(this.props.match.params.recordId);
      this.props.recordStore.getRecord();
    } else {
      this.getRecordForUser();
    }
  }

  shouldComponentUpdate(nextProp, nextState) {
    return (JSON.stringify(nextState) !== JSON.stringify(this.state))
  }

  getRecordForUser = () => {
    this.props.recordStore.setOrgId(this.props.organisationStore.values.organisation._id);
    return this.props.recordStore.getRecordByUser();
  }

  handleEnterToOnboard = () => this.setState({ inOnboarding: true });

  render() {
    const { inOnboarding, editMode } = this.state;
    const { classes } = this.props;

    return (
      <Grid container className={classes.root} direction="row" justify="center" alignItems="center">

        <Suspense fallback={<></>}>
          <Header handleDisplayProfile={this.handleDisplayProfile} />
        </Suspense>

        <BannerResizable
          type={'organisation'}
          initialHeight={100}
          style={styles.banner}
        />
        <div className={classes.blackFilter} ></div>

        <Grid item xs={12} sm={8} md={6} lg={6} className={classes.container}>
          {inOnboarding ? (
            <OnboardStepper 
              edit={editMode}
              wantedStep={undefsafe(this.props, 'match.params.step')} 
            />
          ) : (
              <OnboardWelcome handleEnterToOnboard={this.handleEnterToOnboard} />
            )}
        </Grid>

        <Suspense fallback={<></>}>
          <Intercom appID={"k7gprnv3"} />
        </Suspense>
      </Grid>
    );
  }
}

export default inject('commonStore', 'organisationStore', 'recordStore', 'userStore')(
  observer(
    withStyles(styles, { withTheme: true })(OnboardPage)
  )
);
