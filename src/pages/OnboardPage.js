import React, { Suspense } from 'react'
import { inject, observer } from "mobx-react";
import OnboardWelcome from '../components/onboard/OnboardWelcome';
import OnboardStepper from '../components/onboard/OnboardStepper';
import { withStyles, Grid, withWidth, CircularProgress } from '@material-ui/core';
import undefsafe from 'undefsafe';
import ReactGA from 'react-ga';
import BannerResizable from '../components/utils/banner/BannerResizable';
import Header from '../components/header/Header';
import { styles } from './OnboardPage.css';

const Intercom = React.lazy(() => import('react-intercom'));

console.debug('Loading OnboardPage');

ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS_ID);

class OnboardPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inOnboarding: undefsafe(this.props, 'match.params.step') !== undefined,
      editMode: this.props.edit || false,
      renderComponent: false // do not remove this!!
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
      this.props.recordStore.getRecord()
      .then(() => {
        this.setState({renderComponent: true});
      }).catch(e => {
        console.log(e);
      })
    } else {
      this.getRecordForUser()
      .then(() => {
        this.setState({renderComponent: true});
      })
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
    const { inOnboarding, editMode, renderComponent } = this.state;
    const { classes, width } = this.props;

    if(!renderComponent) return <CircularProgress color="primary" style={{position: 'fixed', zIndex: '9', left:0, right:0, margin:0, top: '40%'}} />;

    return (
      <Grid container className={classes.root} direction="row" justify="center" alignItems="center">

        {!(inOnboarding && width === "xs") && (
          <Suspense fallback={<></>}>
            <Header handleDisplayProfile={this.handleDisplayProfile} />
          </Suspense>
        )}

        <BannerResizable
          type={'organisation'}
          initialHeight={100}
          style={styles.banner}
        />
        <div className={classes.blackFilter} ></div>

        <Grid item xs={12} container justify="center" className={classes.container}>
          {inOnboarding ? (
            <OnboardStepper
              edit={editMode}
              wantedStep={undefsafe(this.props, 'match.params.step')}
            />
          ) : (
              <OnboardWelcome handleEnterToOnboard={this.handleEnterToOnboard} />
            )}
        </Grid>

        {width !== 'xs' && (
          <Suspense fallback={<></>}>
            <Intercom appID={"k7gprnv3"} />
          </Suspense>
        )}

      </Grid>
    );
  }
}

export default inject('commonStore', 'organisationStore', 'recordStore', 'userStore')(
  observer(
    withStyles(styles, { withTheme: true })(withWidth()(OnboardPage))
  )
);
