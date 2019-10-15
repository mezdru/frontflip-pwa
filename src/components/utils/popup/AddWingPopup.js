import React from 'react';
import Button from '@material-ui/core/Button';
import { Redirect } from 'react-router-dom';
import { withStyles, Typography, Hidden, CircularProgress } from '@material-ui/core';
import { inject, observer } from "mobx-react";
import { FormattedMessage } from 'react-intl';
import { Add, Search } from '@material-ui/icons';
import ReactGA from 'react-ga';

import Wings from '../wing/Wing';
import ProfileService from '../../../services/profile.service';
import SlackService from '../../../services/slack.service';
import PopupLayout from './PopupLayout';
import { getBaseUrl } from '../../../services/utils.service';

ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS_ID);

const styles = theme => ({

  text: {
    margin: 0,
    padding: 0,
    paddingTop: 16,
    textAlign: 'center'
  },
  titleEmoji: {
    marginLeft: 16
  },
  title: {
    marginTop: -8,
    marginBottom: -8,
    textAlign: 'center',
    [theme.breakpoints.down('sm')]: {
      fontSize: '4.8rem',
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: '3rem',
    }
  },
  actions: {
    margin: 0,
    padding: 8,
    display: 'block'
  },
  buttons: {
    height: 'unset',
    margin: 8,
  }
});

class AddWingPopup extends React.Component {
  state = {
    open: this.props.isOpen,
    redirectTo: null,
    wingsPopulated: [],
    onLoad: true
  };

  componentWillReceiveProps(nextProps) {
    this.setState({ open: nextProps.isOpen })
  }

  handleClose = () => {
    ReactGA.event({ category: 'User', action: 'QRCode - Search' });

    if (process.env.NODE_ENV === 'production') SlackService.notify('#wingzy-events', 'QRCode - Search - ' +
      (this.state.wingsPopulated[0] ? this.state.wingsPopulated[0].tag : '') +
      ' - by ' + this.props.recordStore.currentUserRecord.name);

    this.setState({ open: false, redirectTo: getBaseUrl(this.props) });
  }

  componentDidMount() {
    this.populateWingsToAdd();
  }

  populateWingsToAdd = async () => {
    let wingsPopulated = [];
    let orgId = this.props.orgStore.currentOrganisation._id;

    await this.asyncForEach(this.props.wingsToAdd, async (wing) => {
      let recordToAdd = await this.props.recordStore.fetchByTag('#' + wing, orgId);
      wingsPopulated.push(recordToAdd);
    });

    this.setState({ wingsPopulated: wingsPopulated, onLoad: false });
  }

  recordHasHashtag = (tag) => this.props.recordStore.currentUserRecord.hashtags.find(hashtag => hashtag.tag === tag) ? true: false;

  async asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }

  handleAddWing = async () => {
    ReactGA.event({ category: 'User', action: 'QRCode - Add Wings' });
    if (process.env.NODE_ENV === 'production') SlackService.notify('#wingzy-events', 'QRCode - Add Wings - ' +
      (this.state.wingsPopulated[0] ? this.state.wingsPopulated[0].tag : '') +
      ' - by ' + this.props.recordStore.currentUserRecord.name);

    let record = this.props.recordStore.currentUserRecord;
    let wingsToAdd = [];
    this.state.wingsPopulated.forEach(wing => {
      if (!this.recordHasHashtag(wing.tag)) {
        wingsToAdd.push(wing);
      }
    })
    await this.props.recordStore.updateRecord(record._id, ['hashtags'], {hashtags: record.hashtags.concat(wingsToAdd)});
    this.setState({ open: false, redirectTo: getBaseUrl(this.props) + '/' + record.tag});
  }

  render() {
    const { redirectTo, wingsPopulated, onLoad } = this.state;
    const { classes } = this.props;
    const { currentOrganisation } = this.props.orgStore;
    const { locale } = this.props.commonStore;

    if (redirectTo && window.location.pathname !== redirectTo) return (<Redirect push to={redirectTo} />);

    return (
      <PopupLayout
        isOpen={this.state.open}
        title={
          <Typography variant="h1" className={classes.title}>
            <FormattedMessage id="onboard.end.title" />
            <Hidden xsDown>
              <img src={ProfileService.getEmojiUrl('🎉')} alt="congratulation" className={classes.titleEmoji} />
            </Hidden>
          </Typography>
        }
        actions={
          <div className={classes.actions}>
            <Button onClick={this.handleAddWing} color="secondary" variant="contained" size="medium" className={classes.buttons} >
              <Add />
              <FormattedMessage id="action.addWings.add" />
            </Button>
            <Hidden smUp>
              <br /><br />
            </Hidden>
            <Button onClick={this.handleClose} color="secondary" variant="contained" size="medium" className={classes.buttons}  >
              <Search />
              <FormattedMessage id="action.addWings.search" values={{ organisationName: currentOrganisation.name }} />
            </Button>
          </div>
        }
        onClose={this.handleClose}
      >
        <Typography variant="h6" className={classes.text}>
          <FormattedMessage id="action.addWings.text" values={{ wingsCount: wingsPopulated.length }} />
          <br />
          <div className={classes.wingsList}>
            {onLoad && (
              <CircularProgress color='secondary' />
            )}

            {!onLoad && wingsPopulated.map((wing, i) => {
              let displayedName = ProfileService.getWingDisplayedName(wing, locale);
              return (
                <Wings src={ProfileService.getPicturePath(wing.picture)} key={i}
                  label={ProfileService.htmlDecode(displayedName)}
                  className={'bigWing'}
                />);
            })}
          </div>
        </Typography>
      </PopupLayout>
    );
  }
}

export default inject('commonStore', 'orgStore', 'recordStore')(
  observer(
    withStyles(styles, { withTheme: true })(AddWingPopup)
  )
);