import React, { Suspense } from 'react'
import { inject, observer } from "mobx-react";
import OnboardWelcome from '../components/onboard/OnboardWelcome';
import OnboardStepper from '../components/onboard/OnboardStepper';
import { withStyles, Grid, withWidth, CircularProgress } from '@material-ui/core';
import undefsafe from 'undefsafe';
import ReactGA from 'react-ga';
import {Redirect} from 'react-router-dom';
import BannerResizable from '../components/utils/banner/BannerResizable';
import Header from '../components/header/Header';
import { styles } from './OnboardPage.css';
import withAuthorization from '../hoc/withAuthorization.hoc';
import { getBaseUrl } from '../services/utils.service';

const Intercom = React.lazy(() => import('react-intercom'));

console.debug('Loading OnboardPage');

ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS_ID);

class OnboardPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      inOnboarding: undefsafe(this.props, 'match.params.step') !== undefined,
      redirectTo: null,
      renderComponent: false // do not remove this!!
    };

    // clear wings bank
    this.props.commonStore.setLocalStorage('wingsBank', [], true);

    this.props.commonStore.setUrlParams(this.props.match);
  }

  componentWillReceiveProps(nextProps) {
    this.props.commonStore.setUrlParams(nextProps.match);
  }

  async componentWillMount() {
    const {onboardMode, recordTag} = this.props.commonStore.url.params;
    const orgId = this.props.orgStore.currentOrganisation._id;

    this.props.history.listen((location, action) => {
      ReactGA.pageview(window.location.pathname);
    });

    if(onboardMode === "edit" || (onboardMode === "create" && recordTag !== "@NewProfile")) {
      await this.props.recordStore.fetchByTag(recordTag, orgId)
      .catch(e => {
        this.setState({redirectTo: getBaseUrl(this.props)});
        console.log(e);
      })
    } else if(onboardMode !== "create"){ // create primary record
      await this.props.recordStore.fetchPopulatedForUser(orgId)
      .catch(async e => {
        console.error(e);
        await this.props.recordStore.fetchPopulatedForUser(orgId)
      });
      await this.props.userStore.fetchCurrentUser(); // get updated user
    }
    this.setState({renderComponent: true});
  }

  handleEnterToOnboard = () => this.setState({ inOnboarding: true });

  render() {
    const { inOnboarding, renderComponent, redirectTo } = this.state;
    const { classes, width } = this.props;
    const editMode = (this.props.commonStore.url.params.onboardMode === 'edit');
    const createMode = (this.props.commonStore.url.params.onboardMode === 'create');

    if(redirectTo) return <Redirect to={redirectTo} />;
    if(!renderComponent) return <CircularProgress color="secondary" style={{position: 'fixed', zIndex: '9', left:0, right:0, margin:'auto', top: '40%'}} />;

    return (
      <Grid container className={classes.root} direction="row" justify="center" alignItems="center">

        {!(inOnboarding && width === "xs") && (
          <Suspense fallback={<></>}>
            <Header />
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
              create={createMode}
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

OnboardPage = withAuthorization(OnboardPage, 'onboard');

export default inject('commonStore', 'orgStore', 'recordStore')(
  observer(
    withStyles(styles, { withTheme: true })(withWidth()(OnboardPage))
  )
);
