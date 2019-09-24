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
    onLoad: true,
    locale: this.props.commonStore.getCookie('locale') || this.props.commonStore.locale
  };

  componentWillReceiveProps(nextProps) {
    this.setState({ open: nextProps.isOpen })
  }

  handleClose = () => {
    ReactGA.event({ category: 'User', action: 'QRCode - Search' });
    if (process.env.NODE_ENV === 'production') SlackService.notify('#wingzy-events', 'QRCode - Search - ' +
      (this.state.wingsPopulated[0] ? this.state.wingsPopulated[0].tag : '') +
      ' - by ' + this.props.recordStore.values.record.name);
    this.setState({ open: false, redirectTo: '/' + this.props.commonStore.locale + '/' + this.props.organisationStore.values.orgTag });
  }

  componentDidMount() {
    this.populateWingsToAdd();
  }

  populateWingsToAdd = async () => {
    let wingsPopulated = [];
    let orgId = this.props.organisationStore.values.organisation._id ||
      this.props.organisationStore.values.orgId;

    this.props.recordStore.setOrgId(orgId);

    await this.asyncForEach(this.props.wingsToAdd, async (wing) => {
      this.props.recordStore.setRecordTag('#' + wing);
      await this.props.recordStore.getRecordByTag()
        .then((hashtagToAdd => {
          wingsPopulated.push(hashtagToAdd);
        })).catch(e => { console.log(e) });
    });

    this.setState({ wingsPopulated: wingsPopulated, onLoad: false });
  }

  recordHasHashtag = (tag) => {
    let resp = (this.props.recordStore.values.record.hashtags.find(hashtag => hashtag.tag === tag) ? true : false);
    return resp;
  }

  async asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }

  handleAddWing = async () => {
    ReactGA.event({ category: 'User', action: 'QRCode - Add Wings' });
    if (process.env.NODE_ENV === 'production') SlackService.notify('#wingzy-events', 'QRCode - Add Wings - ' +
      (this.state.wingsPopulated[0] ? this.state.wingsPopulated[0].tag : '') +
      ' - by ' + this.props.recordStore.values.record.name);

    let record = this.props.recordStore.values.record;
    let wingsToAdd = [];
    this.state.wingsPopulated.forEach(wing => {
      if (!this.recordHasHashtag(wing.tag)) {
        wingsToAdd.push(wing);
      }
    })
    record.hashtags = record.hashtags.concat(wingsToAdd);
    await this.props.recordStore.updateRecord(['hashtags']);
    this.props.handleDisplayProfile(null, record);
    this.setState({ open: false });
  }

  render() {
    const { redirectTo, wingsPopulated, onLoad } = this.state;
    const { classes } = this.props;
    const { organisation } = this.props.organisationStore.values;
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
              <FormattedMessage id="action.addWings.search" values={{ organisationName: organisation.name }} />
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

export default inject('commonStore', 'organisationStore', 'recordStore')(
  observer(
    withStyles(styles, { withTheme: true })(AddWingPopup)
  )
);