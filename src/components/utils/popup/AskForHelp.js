import React from 'react';
import { inject, observer } from "mobx-react";
import Button from '@material-ui/core/Button';
import { withStyles, Typography, TextField } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import { observe } from 'mobx';
import Wings from '../wing/Wings';
import profileService from '../../../services/profile.service';
import PopupLayout from './PopupLayout';

const styles = theme => ({
  text: {
    margin: 0,
    padding: 0,
    paddingTop: theme.spacing.unit * 2,
    textAlign: 'left'
  },
  title: {
    textAlign: 'center',
  },
  textarea: {
    marginTop: theme.spacing.unit * 2,
    '& textarea': {
      lineHeight: 1.5,
      fontSize: '1rem',
    }
  },
  recipients: {
    height: 180,
    overflowY: 'auto'
  }
});

class AskForHelp extends React.Component {

  state = {
    isOpen: this.props.isOpen,
    message: null,
    recipients: this.props.commonStore.searchResults
  }

  componentDidMount() {
    observe(this.props.commonStore, 'searchResults', (change) => {
      console.log(change)
      this.setState({ recipients: change.newValue });
    });
  }

  handleClose = () => this.setState({ isOpen: false });

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
        this.setState({ isOpen: false });
      });

  }

  buildRecipientsArray(recipients) {
    if (!recipients) return [];
    return recipients.map(recipient => recipient._id || recipient.objectID);
  }

  buildTagsArray(filters) {
    if (!filters) return [];
    return filters.map(filter => filter.tag);
  }

  handleMessageChange = (e) => this.setState({ message: e.target.value });

  handleRemoveRecipient = (rId) => {
    let recipients = this.state.recipients;
    let indexToRemove = recipients.findIndex(recipient => (recipient._id || recipient.objectID) === rId);
    recipients.splice(indexToRemove, 1);
    this.setState({ recipients: recipients });
  }

  render() {
    const { isOpen, message } = this.state;
    const { classes } = this.props;
    const { searchResults, searchResultsCount, searchFilters } = this.props.commonStore;
    const { helpRequest } = this.props.helpRequestStore.values;

    console.log(JSON.parse(JSON.stringify(searchResults)))

    return (
      <PopupLayout
        isOpen={isOpen}
        title={
          <Typography variant="h1" className={classes.title}>
            <FormattedMessage id="askForHelp.popup.title" />
          </Typography>
        }
        actions={
          <Button onClick={this.handleSend} color="secondary">
            <FormattedMessage id="askForHelp.popup.send" />
          </Button>
        }
      >

        <Typography variant="h6" className={classes.title}>
          <FormattedMessage id="askForHelp.popup.subtitle" />
        </Typography>

        <div className={classes.recipients}>
          {searchResults.map((hit, index) =>
            <Wings
              label={hit.name || hit.tag}
              src={profileService.getPicturePath(hit.picture) || profileService.getDefaultPictureByType(hit.type)}
              key={hit._id || hit.objectID}
              mode="person"
              onDelete={() => this.handleRemoveRecipient(hit._id || hit.objectID)}
            />
          )}
        </div>

        <TextField
          className={classes.textarea}
          label="Explain your needs here"
          fullWidth
          multiline
          rows={5}
          maxRows={10}
          margin="none"
          value={message}
          onChange={this.handleMessageChange}
          variant="outlined"
        />

      </PopupLayout >
    )
  }
}

export default inject('commonStore', 'helpRequestStore', 'recordStore', 'organisationStore')(
  observer(
    withStyles(styles, { withTheme: true })(
      AskForHelp
    )
  )
);
