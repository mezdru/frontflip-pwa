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
      newTag: null,
      currentHashtagsLength: (this.props.recordStore.values.record && this.props.recordStore.values.record.hashtags ? this.props.recordStore.values.record.hashtags.length : 0),
    };
  }

  componentDidMount() {
    setTimeout(() => this.props.scrollUserWingsToBottom(), 150);

    this.unsubscribeRecord = observe(this.props.recordStore.values, 'record', (change) => {
      if(change.newValue && change.newValue.hashtags && (change.newValue.hashtags.length > this.state.currentHashtagsLength)) {
        setTimeout(() => this.props.scrollUserWingsToBottom(), 150);
        this.setState({newTag: change.newValue.hashtags[change.newValue.hashtags.length - 1].tag, currentHashtagsLength: change.newValue.hashtags.length});
      } else {
        this.setState({newTag: null, currentHashtagsLength: (change.newValue && change.newValue.hashtags ? change.newValue.hashtags.length : 0)});
      }
    });
  }

  componentWillUnmount() {
    this.unsubscribeRecord();
  }

  shoudlRenderWing = (hashtag) => {
    if(!hashtag) return false;
    return true;
  } 

  shouldAnimateWing = (hashtag) => {
    if(hashtag.tag === this.state.newTag) {
      return true;
    }
    return false;
  }

  render() {
    const {record} = this.props.recordStore.values;
    const {theme, classes} = this.props;
    const {locale} = this.props.commonStore;
    if(!record) return null;

    return (
      <div className={classes.root}>
        <Typography variant="h4" style={{textAlign: 'center', color:theme.palette.primary.dark}} ><FormattedMessage id="onboard.userWings" values={{wingsCount: ( record.hashtags ? record.hashtags.length : 0)}} /></Typography>
        <div className="" style={{paddingTop: 10}}>
          {record.hashtags && record.hashtags.length > 0 && record.hashtags.map((hashtag, i) => {
            if(!this.shoudlRenderWing(hashtag)) return null;
            let displayedName = ProfileService.getWingDisplayedName(hashtag, locale);
            
            if(!this.shouldAnimateWing(hashtag)) {
              return (
                <div className="" key={hashtag._id} style={{display: 'inline-block'}} >
                  <Wings  src={ProfileService.getPicturePath(hashtag.picture)}
                    label={ProfileService.htmlDecode(displayedName)} key={hashtag.tag}
                    className={''} 
                    onDelete={(e) => {this.props.handleRemoveWing(e, hashtag.tag)}} />
                </div>
              )
            } else {
              return (
                <div className="" key={hashtag._id} style={{display: 'inline-block'}} >
                  <Wings  src={ProfileService.getPicturePath(hashtag.picture)}
                    label={ProfileService.htmlDecode(displayedName)} key={hashtag.tag}
                    className={'animated'} 
                    mode="onboard"
                    style={{background: theme.palette.primary.main}}
                    onDelete={(e) => {this.props.handleRemoveWing(e, hashtag.tag)}} />
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
    withStyles(styles, {withTheme: true})(UserWings)
  )
);
