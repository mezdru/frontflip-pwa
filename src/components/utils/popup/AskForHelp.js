import React from 'react';
import { inject, observer } from "mobx-react";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Slide from '@material-ui/core/Slide';
import { withStyles, Typography, TextField } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import { observe } from 'mobx';
import Wings from '../wing/Wings';
import profileService from '../../../services/profile.service';

const styles = theme => ({
  root: {
    textAlign: 'left',
  },
  picture: {
    width: '60%',
    height: 'auto',
    marginBottom: 40,
  },
  text: {
    margin: 0,
    padding:0,
    paddingTop: 16,
    textAlign: 'left'
  },
  titleEmoji: {
    marginLeft: 16
  },
  title: {
    textAlign: 'center',
    [theme.breakpoints.down('sm')] : {
      fontSize: '4.8rem',
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: '3rem',
    }
  },
  actions: {
    justifyContent: 'center', 
    margin: 0,
    padding: 24,
  },
  textarea: {
    marginTop: 16,
  }
});

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class AskForHelp extends React.Component {

  state = {
    isOpen: this.props.isOpen,
    message: null,
    recipients: this.props.commonStore.searchResults
  }

  componentDidMount() {
    observe(this.props.commonStore, 'searchResults', (change) => {
      console.log(change)
      this.setState({recipients: change.newValue});
    });
  }

  handleClose = () => this.setState({isOpen: false});

  handleSend = () => {

    let helpRequest = {
      organisation: this.props.organisationStore.values.organisation._id,
      sender: this.props.recordStore.values.record._id,
      recipients: this.buildRecipientsArray(this.props.commonStore.searchResults),
      results: this.props.commonStore.searchResultsCount,
      tags: this.buildTagsArray(this.props.commonStore.searchFilters),
      service: 'email'
    }

    this.props.helpRequestStore.setHelpRequest(helpRequest);
    this.props.helpRequestStore.postHelpRequest()
    .then(hr => {
      this.setState({isOpen: false});
    });

  }

  buildRecipientsArray(recipients) {
    if(!recipients) return [];
    return recipients.map(recipient => recipient._id || recipient.objectID);
  }

  buildTagsArray(filters) {
    if(!filters) return [];
    return filters.map(filter => filter.tag);
  }

  handleMessageChange = (e) => this.setState({message: e.target.value});

  handleRemoveRecipient = (rId) => {
    let recipients = this.state.recipients;
    let indexToRemove = recipients.findIndex(recipient => (recipient._id  || recipient.objectID) === rId);
    recipients.splice(indexToRemove, 1);
    this.setState({recipients: recipients});
  }

  render() {
    const { isOpen, message } = this.state;
    const {classes} = this.props;
    const { searchResults, searchResultsCount, searchFilters } = this.props.commonStore;
    const {helpRequest} = this.props.helpRequestStore.values;

    console.log(JSON.parse(JSON.stringify(searchResults)))
    return (
      <React.Fragment>
        <Dialog
          open={isOpen}
          TransitionComponent={Transition}
          keepMounted
          fullWidth
          maxWidth={'sm'}
          onClose={this.handleClose}
          className={classes.root}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogContent style={{ overflow: 'hidden' }} >
            <Typography variant="h1" className={classes.title}>
              <FormattedMessage id="askForHelp.popup.title" />
            </Typography>
            <DialogContentText id="alert-dialog-slide-description">
              <Typography variant="h6" className={classes.title}>
                <FormattedMessage id="askForHelp.popup.subtitle" />
              </Typography>
              {searchResults.map( (hit, index) => 
                <Wings  
                  label={hit.name || hit.tag} 
                  src={profileService.getPicturePath(hit.picture) || profileService.getDefaultPictureByType(hit.type)} 
                  key={hit._id || hit.objectID} 
                  mode="person" 
                  onDelete={() => this.handleRemoveRecipient(hit._id || hit.objectID)} 
                />
              )}
              <TextField
                className={classes.textarea}
                label="Explain your needs here"
                fullWidth
                multiline
                rows={8}
                value={message}
                onChange={this.handleMessageChange}
                variant="outlined"
              />

            </DialogContentText>
          </DialogContent>
          <DialogActions className={classes.actions}>
            <Button onClick={this.handleSend} color="secondary">
              <FormattedMessage id="askForHelp.popup.send" />
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }
}

export default inject('commonStore', 'helpRequestStore', 'recordStore', 'organisationStore')(
  observer(
    withStyles(styles, { withTheme: true })(
      AskForHelp
    )
  )
);
