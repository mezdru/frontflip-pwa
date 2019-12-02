import React, { Suspense } from 'react';
import Button from '@material-ui/core/Button';
import { withStyles, CircularProgress, Stepper, Step, StepLabel } from '@material-ui/core';
import { inject, observer } from "mobx-react";
import { FormattedMessage } from 'react-intl';
import ReactGA from 'react-ga';

import Wings from '../../wing/Wings';
import ProfileService from '../../../../services/profile.service';
import PopupLayout from '../PopupLayout';
import { styles } from './ProposeSkills.css';
import EmailService from '../../../../services/email.service';
import {getUnique} from '../../../../services/utils.service';

ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS_ID);

class AcceptSkills extends React.Component {
  state = {
    open: this.props.isOpen,
    error: null,
    ready: false
  };

  componentDidMount() {
    this.props.skillsPropositionStore.fetchSkillsProposition(this.props.skillsPropositionId)
    .then(sp => {
      this.setState({ready: true});
    }).catch(e => {
      this.setState({error: e});
    })
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.open !== nextProps.isOpen)
      this.setState({ open: nextProps.isOpen });
  }

  handleAccept = () => {

    let hashtags = JSON.parse(JSON.stringify(this.props.recordStore.currentUserRecord.hashtags.concat(this.props.skillsPropositionStore.skillsProposition.hashtags)));


    this.props.recordStore.updateRecord(
      this.props.recordStore.currentUserRecord._id, 
      ['hashtags'], 
      {hashtags: getUnique(hashtags, '_id')}
    );
  }

  handleClose = () => this.setState({ open: false });

  onDelete = (selectedId) => {
    this.props.skillsPropositionStore.skillsProposition.hashtags = this.props.skillsPropositionStore.skillsProposition.hashtags.filter(elt => (elt._id) !== (selectedId));
    this.forceUpdate();
  }

  render() {
    const { classes } = this.props;
    const { ready, error } = this.state;
    const { locale } = this.props.commonStore;
    const { skillsProposition } = this.props.skillsPropositionStore;

    if(!ready && !error) return null;

    return (
      <PopupLayout
        isOpen={this.state.open}
        title={
          <div>HELLO</div>
        }
        actions={
          <div className={classes.actions}>
            <Button onClick={this.handleClose} className={classes.buttons} >
              Refuse
            </Button>
            <Button variant="contained" color="secondary" onClick={this.handleAccept} className={classes.buttons} >
              Accept
            </Button>
          </div>
        }
        onClose={this.handleClose}
        style={this.props.style}
      >

        {/* Selected wings */}
        <div className={classes.selectedSkillsContainer} >
          {skillsProposition && skillsProposition.hashtags && skillsProposition.hashtags.map(selected =>
            <Wings
              key={selected.tag}
              label={ProfileService.getWingDisplayedName(selected, locale)}
              mode="profile"
              onDelete={() => this.onDelete(selected._id)}
            />
          )}
        </div>
      </PopupLayout >
    );
  }
}

export default inject('commonStore', 'orgStore', 'recordStore', 'skillsPropositionStore')(
  observer(
    withStyles(styles, { withTheme: true })(AcceptSkills)
  )
);