import React, { Suspense } from 'react';
import Button from '@material-ui/core/Button';
import { Redirect } from 'react-router-dom';
import { withStyles, Typography, Hidden, CircularProgress, Stepper, Step, StepLabel } from '@material-ui/core';
import { inject, observer } from "mobx-react";
import { FormattedMessage } from 'react-intl';
import ReactGA from 'react-ga';

import Wings from '../../wing/Wings';
import ProfileService from '../../../../services/profile.service';
import SlackService from '../../../../services/slack.service';
import PopupLayout from '../PopupLayout';
import { getBaseUrl } from '../../../../services/utils.service';
import { styles } from './ProposeSkills.css';
import { withProfileManagement } from '../../../../hoc/profile/withProfileManagement';
import EmailService from '../../../../services/email.service';

const Search = React.lazy(() => import('../../../search/Search'));

ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS_ID);

class ProposeSkills extends React.Component {
  state = {
    open: this.props.isOpen,
    steps: ['Choose skills', 'Give claps on it'],
    activeStep: 0,
    selectedSkills: []
  };

  handleNext = async () => {
    if(this.state.activeStep === 1) {
      let sp = await this.props.skillsPropositionStore.postSkillsProposition({
          organisation: this.props.orgStore.currentOrganisation._id,
          hashtags: this.state.selectedSkills.map(elt => {return {_id: (elt._id ||elt.objectID)};}),
          sender: this.props.recordStore.currentUserRecord._id,
          recipient: this.props.profileContext.getProp('_id'),
      }).catch(e => null);
      if(sp) await EmailService.sendSkillsProposition(sp._id);
    }
    this.setState({ activeStep: this.state.activeStep + 1 })
  };

  handleBack = () => {
    this.setState({ activeStep: this.state.activeStep - 1 })
  };

  componentWillReceiveProps(nextProps) {
    if (this.state.open !== nextProps.isOpen)
      this.setState({ open: nextProps.isOpen });
  }

  handleClose = () => this.setState({ open: false });

  onSelect = (selected) => {
    console.log(selected)
    this.setState({ selectedSkills: this.state.selectedSkills.concat([selected]) });
  }

  onCreate = (created) => {
    // create then add
    console.log(created)
  }

  onDelete = (selectedId) => {
    this.setState({selectedSkills: this.state.selectedSkills.filter(elt => (elt._id || elt.objectID) !== (selectedId))});
  }

  render() {
    const { classes, profileContext } = this.props;
    const { steps, activeStep, selectedSkills } = this.state;
    const { locale } = this.props.commonStore;

    return (
      <PopupLayout
        isOpen={this.state.open}
        title={
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map(label => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        }
        actions={
          <div className={classes.actions}>
            <Button
              disabled={activeStep === 0}
              onClick={this.handleBack}
              className={classes.buttons}
            >
              Back
              </Button>
            <Button variant="contained" color="secondary" onClick={this.handleNext} className={classes.buttons} >
              {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </div>
        }
        onClose={this.handleClose}
        style={this.props.style}
      >
        <>
          {activeStep === 0 && (
            <Suspense fallback={<CircularProgress color="secondary" />}>
              <Search mode="propose" onSelect={this.onSelect} handleCreateWing={this.onCreate} max={10} exclude={selectedSkills} />
            </Suspense>
          )}

          {/* Selected wings */}
          <div className={classes.selectedSkillsContainer} >
            {selectedSkills.map(selected =>
              <Wings
                key={selected.tag}
                label={ProfileService.getWingDisplayedName(selected, locale)}
                mode="profile"
                recordId={profileContext.getProp('_id')}
                hashtagId={selected._id || selected.objectID}
                onDelete={activeStep === 0 ? () => this.onDelete(selected._id || selected.objectID) : null}
                enableClap={activeStep === 1}
              />
            )}
          </div>
        </>
      </PopupLayout >
    );
  }
}

export default inject('commonStore', 'orgStore', 'recordStore', 'skillsPropositionStore')(
  observer(
    withStyles(styles, { withTheme: true })(withProfileManagement(ProposeSkills))
  )
);