import React from 'react';
import { inject, observer } from "mobx-react";
import Button from '@material-ui/core/Button';
import { withStyles, Typography, TextField } from '@material-ui/core';
import { FormattedMessage, injectIntl } from 'react-intl';
import { observe } from 'mobx';
import Wings from '../wing/Wings';
import profileService from '../../../services/profile.service';
import PopupLayout from './PopupLayout';
import EmailService from '../../../services/email.service';
import SnackbarCustom from '../snackbars/SnackbarCustom';
import withSearchManagement from '../../../hoc/SearchManagement.hoc';
import AlgoliaService from '../../../services/algolia.service';

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
    recipients: [],
    success: false,
    error: false
  }

  componentDidMount() {
    observe(this.props.commonStore, 'searchFilters', (change) => {
      if(JSON.stringify(change.oldValue) !== JSON.stringify(change.newValue))
        this.getSearchResults();
    });

  }

  getSearchResults = async () => {
    // get request params
    let reqObject = await this.props.makeFiltersRequest();
    AlgoliaService.fetchHits(reqObject.filterRequest, reqObject.queryRequest, null, null, false, 10)
    .then((content) => {
      this.setState({recipients: Array.from(content.hits)});
    });
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.isOpen !== nextProps.isOpen) {
      this.setState({
        isOpen: nextProps.isOpen,
        message: null,
        success: false,
        error: false
      });
    }
  }

  handleClose = () => this.setState({ isOpen: false });

  handleError = (e) => {
    console.error(e);
    this.setState({ error: true})
  }

  handleSend = () => {

    if(!this.state.message) return this.setState({errorMessage: this.props.intl.formatMessage({id: "askForHelp.popup.missingMessage"})});

    let helpRequest = {
      organisation: this.props.organisationStore.values.organisation._id,
      sender: this.props.recordStore.values.record._id,
      recipients: this.buildRecipientsArray(this.state.recipients),
      results: this.props.commonStore.searchResultsCount,
      tags: this.buildTagsArray(this.props.commonStore.searchFilters),
      service: 'email',
      message: this.state.message
    }

    this.props.helpRequestStore.setHelpRequest(helpRequest);
    this.props.helpRequestStore.postHelpRequest()
      .then(hr => {
        EmailService.sendHelpRequest(hr._id)
          .then(() => {
            this.setState({success: true});
          }).catch(this.handleError);
      }).catch(this.handleError);

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
    const { isOpen, message, error, success, errorMessage, recipients } = this.state;
    const { classes } = this.props;

    return (
      <PopupLayout
        isOpen={isOpen}
        title={
          <Typography variant="h1" className={classes.title}>
            <FormattedMessage id="askForHelp.popup.title" />
          </Typography>
        }
        actions={
          <Button onClick={(error || success) ? this.handleClose : this.handleSend} color="secondary" type="submit">
            <FormattedMessage id={(error || success) ? "askForHelp.popup.close" : "askForHelp.popup.send"} />
          </Button>
        }
        onClose={this.handleClose}
      >

        <Typography variant="h6" className={classes.title}>
          <FormattedMessage id="askForHelp.popup.subtitle" />
        </Typography>

        {!error && !success && (
          <>
            <div className={classes.recipients}>
              {recipients.map((hit, index) =>
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
              helperText={errorMessage}
              error={errorMessage}
              required
            />
          </>
        )}

        {error && (
          <SnackbarCustom variant="warning" message={this.props.intl.formatMessage({id: "askForHelp.popup.error"})} />
        )}

        {success && (
          <SnackbarCustom variant="success" message={this.props.intl.formatMessage({id: "askForHelp.popup.success"})} />
        )}

      </PopupLayout >
    )
  }
}

export default inject('commonStore', 'helpRequestStore', 'recordStore', 'organisationStore')(
  observer(
    withStyles(styles, { withTheme: true })(
      injectIntl( withSearchManagement(AskForHelp))
    )
  )
);
