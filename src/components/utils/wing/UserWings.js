import React from 'react'
import { withStyles, Typography } from '@material-ui/core';
import { inject, observer } from "mobx-react";
import { observe } from 'mobx';
import Wings from './Wing';
import ProfileService from '../../../services/profile.service';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';

const styles = theme => ({
  root: {
    paddingTop: 16, paddingLeft: 24, paddingRight: 24, paddingBottom: 26,
    [theme.breakpoints.down('xs')]: {
      paddingTop: 0, paddingLeft: 8, paddingRight: 8, paddingBottom: 10
    }
  }
});

class UserWings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newTag: null
    };
  }

  componentDidMount() {
    setTimeout(() => this.props.scrollUserWingsToBottom(), 150);
    let record = (this.props.edit ? this.props.recordStore.currentUrlRecord : this.props.recordStore.currentUserRecord);

    this.unsubscribeRecord = observe(record, (change) => {
      if (change.name === 'hashtags' && (change.newValue.length > change.oldValue.length)) { // add wings
        setTimeout(() => this.props.scrollUserWingsToBottom(), 150);
        this.setState({ newTag: change.newValue[change.newValue.length - 1].tag });
      } else if (change.name === 'hashtags' && (change.newValue.length < change.oldValue.length)) { // remove wings
        this.setState({ newTag: null });
      }
    });
  }

  componentWillUnmount() {
    this.unsubscribeRecord();
  }

  shoudlRenderWing = (hashtag) => {
    if (!hashtag) return false;
    return true;
  }

  shouldAnimateWing = (hashtag) => {
    if (hashtag.tag === this.state.newTag) {
      return true;
    }
    return false;
  }

  render() {
    let record = (this.props.edit ? this.props.recordStore.currentUrlRecord : this.props.recordStore.currentUserRecord);
    const { theme, classes, wingsFamily } = this.props;
    const { locale } = this.props.commonStore;
    if (!record) return null;

    let filteredHashtags = wingsFamily && record.hashtags ? record.hashtags.filter(elt => elt && elt.hashtags && elt.hashtags.find(elt2 => (elt2._id || elt2) === wingsFamily._id)) : record.hashtags || [];
    return (
      <div className={classes.root}>
        <Typography variant="h4" style={{ textAlign: 'center', color: theme.palette.primary.dark }} ><FormattedMessage id="onboard.userWings" values={{ wingsCount: filteredHashtags.length, familyName: (wingsFamily ? wingsFamily.name : 'Wings') }} /></Typography>
        <div className="" style={{ paddingTop: 10 }}>
          {filteredHashtags.length > 0 && filteredHashtags.map((hashtag, i) => {
            if (!this.shoudlRenderWing(hashtag)) return null;
            let displayedName = ProfileService.getWingDisplayedName(hashtag, locale);

            if (!this.shouldAnimateWing(hashtag)) {
              return (
                <div className="" key={hashtag._id} style={{ display: 'inline-block' }} >
                  <Wings src={ProfileService.getPicturePath(hashtag.picture)}
                    label={ProfileService.htmlDecode(displayedName)} key={hashtag.tag}
                    className={''}
                    onDelete={(e) => { this.props.handleRemoveWing(e, hashtag.tag) }} />
                </div>
              )
            } else {
              return (
                <div className="" key={hashtag._id} style={{ display: 'inline-block' }} >
                  <Wings src={ProfileService.getPicturePath(hashtag.picture)}
                    label={ProfileService.htmlDecode(displayedName)} key={hashtag.tag}
                    className={'animated'}
                    mode="onboard"
                    style={{ background: theme.palette.primary.main }}
                    onDelete={(e) => { this.props.handleRemoveWing(e, hashtag.tag) }} />
                </div>
              )
            }

          })}
          {record.hashtags && record.hashtags.length === 0 && (
            <Typography variant="h6">
              <FormattedHTMLMessage id="onboard.noWings" />
            </Typography>
          )}
        </div>
      </div>
    );
  }
}

export default inject('commonStore', 'recordStore')(
  observer(
    withStyles(styles, { withTheme: true })(UserWings)
  )
);
