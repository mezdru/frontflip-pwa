import React from 'react'
import { inject, observer } from "mobx-react";
import { observe } from 'mobx';
import OnboardWelcome from '../components/onboard/OnboardWelcome';
import OnboardStepper from '../components/onboard/OnboardStepper';
import { withStyles } from '@material-ui/core';
import SuggestionsController from '../services/suggestionsController.service';
import ReactGA from 'react-ga';
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
      observer: ()=>{},
      stepNumber: 0,
      editMode: this.props.edit || false,
      renderComponent: (this.props.edit ? false : true)
    };

    // clear wings bank
    this.props.commonStore.setLocalStorage('wingsBank', [], true);
  }

  componentDidMount() {
    this.props.history.listen((location, action) => ReactGA.pageview(window.location.pathname));

    this.setState({observer: observe(this.props.recordStore.values, 'record', (change) => {
      this.forceUpdate();
    })});
    if(this.props.match && this.props.match.params && this.props.match.params.recordId && this.props.edit) {
      this.props.recordStore.setRecordId(this.props.match.params.recordId);
      this.props.recordStore.getRecord()
      .then(() => {this.setState({renderComponent: true})}).catch(err => console.log(err));
    } else {
      this.getRecordForUser()
      .then(() => {this.setState({renderComponent: true})}).catch(err => console.log(err));
    }
    if (this.props.match && this.props.match.params && this.props.match.params.step) {
      this.populateStep(this.props.match.params.step);
    }
  }

  componentWillUnmount() {
    this.state.observer();
  }

  populateStep = (stepLabel) => {
    switch (stepLabel) {
      case 'intro':
        this.setState({inOnboarding: true});
        break;
      case 'contacts':
        this.setState({stepNumber: 1, inOnboarding: true});
        break;
      case 'firstWings':
        this.setState({stepNumber: 2, inOnboarding: true});
        break;
      case 'wings':
        this.setState({stepNumber: 3, inOnboarding: true});
        break;
      default:
        if(stepLabel && (stepLabel.replace('%23', '#')).charAt(0) === '#') {
          this.setState({stepNumber: 3, inOnboarding: true});
        }
        break;
    }
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
    const {inOnboarding, stepNumber, editMode, renderComponent} = this.state;

    if(!renderComponent) return null;

    if(!inOnboarding) {
      return (
        <OnboardWelcome handleEnterToOnboard={this.handleEnterToOnboard} />
      );
    } else {
      return (
        <div>
          <main>
            <OnboardStepper initStep={stepNumber} SuggestionsController={SuggestionsController} edit={editMode} />
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
