import React, { Suspense } from 'react'
import { inject, observer } from "mobx-react";
import { observe } from 'mobx';
import OnboardWelcome from '../components/onboard/OnboardWelcome';
import OnboardStepper from '../components/onboard/OnboardStepper';
import { withStyles } from '@material-ui/core';
import SuggestionsController from '../services/suggestionsController.service';
import ReactGA from 'react-ga';

const Intercom = React.lazy(() => import('react-intercom'));

console.debug('Loading OnboardPage');

ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS_ID);

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
      inOnboarding: false,
      observer: () => { },
      stepNumber: 0,
      steps: [],
      editMode: this.props.edit || false,
      renderComponent: (this.props.edit ? false : true)
    };

    // clear wings bank
    this.props.commonStore.setLocalStorage('wingsBank', [], true);
  }

  componentDidMount() {
    this.makeStepOrder();
    this.props.history.listen((location, action) => {
      ReactGA.pageview(window.location.pathname);
      // The react router dom params are updated async
      setTimeout(() => this.populateStep(this.props.match.params.step), 10);
    });

    this.setState({
      observer: observe(this.props.recordStore.values, 'record', (change) => {
        this.forceUpdate();
      })
    });
    if (this.props.match && this.props.match.params && this.props.match.params.recordId && this.props.edit) {
      this.props.recordStore.setRecordId(this.props.match.params.recordId);
      this.props.recordStore.getRecord()
        .then(() => { this.setState({ renderComponent: true }) }).catch(err => console.log(err));
    } else {
      this.getRecordForUser()
        .then(() => { this.setState({ renderComponent: true }) }).catch(err => console.log(err));
    }
    if (this.props.match && this.props.match.params && this.props.match.params.step) {
      this.populateStep(this.props.match.params.step);
    }
  }

  componentWillUnmount() {
    this.state.observer();
  }

  makeStepOrder = async () => {
    let org = this.props.organisationStore.values.organisation;
    if(org && org.onboardSteps && org.onboardSteps.length > 0) {
      await this.setState({steps: org.onboardSteps});
    } else {
      await this.setState({steps: ['intro', 'contacts', 'wings']});
    }

    if(org.featuredWingsFamily && org.featuredWingsFamily.length > 0) {
      var steps = this.state.steps;
      org.featuredWingsFamily.forEach(fwf => {
        if(!steps.find(elt => elt === fwf.tag))
          steps.push(fwf.tag);

      });
    }
  }

  populateStep = (stepLabel) => {
    this.makeStepOrder()
    .then(() => {
      this.setState({ stepNumber: this.state.steps.indexOf(stepLabel.replace('%23', '#')), inOnboarding: true });
    });
  }

  getRecordForUser = () => {
    if (!this.props.recordStore.values.orgId) {
      this.props.recordStore.setOrgId(this.props.organisationStore.values.organisation._id);
    }
    return this.props.recordStore.getRecordByUser();
  }

  handleEnterToOnboard = () => {
    this.setState({ inOnboarding: true });
  }

  render() {
    const { inOnboarding, stepNumber, steps, editMode, renderComponent } = this.state;

    if (!renderComponent) return null;

    if (!inOnboarding) {
      return (
        <>
          <OnboardWelcome handleEnterToOnboard={this.handleEnterToOnboard} />

          <Suspense fallback={<></>}>
            <Intercom appID={"k7gprnv3"} />
          </Suspense>
        </>
      );
    } else {
      return (
        <React.Fragment>
          <main>
            <OnboardStepper initStep={stepNumber} steps={steps} SuggestionsController={SuggestionsController} edit={editMode} />
            <Suspense fallback={<></>}>
              <Intercom appID={"k7gprnv3"} />
            </Suspense>
          </main>
        </React.Fragment>
      );
    }
  }
}

export default inject('commonStore', 'organisationStore', 'recordStore', 'userStore')(
  observer(
    withStyles(styles, { withTheme: true })(OnboardPage)
  )
);
