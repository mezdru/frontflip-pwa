import React from 'react'
import { withStyles, Typography } from '@material-ui/core';
import { inject, observer } from "mobx-react";
import { observe } from 'mobx';

import Wings from './Wing';
import ProfileService from '../../../services/profile.service';
import defaultHashtagPicture from '../../../resources/images/placeholder_hashtag.png';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';

const styles = theme => ({
  animated: {
    transition: 'background 250ms ease-in',
    background: theme.palette.secondary.main,
  }
});

class UserWings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      observer: ()=> {},
      newTag: null,
      currentHashtagsLength: this.props.recordStore.values.record.hashtags.length
    };
  }

  componentDidMount() {
    this.setState({observer: observe(this.props.recordStore.values, 'record', (change) => {
      if(change.newValue.hashtags.length > this.state.currentHashtagsLength) {
        this.setState({newTag: change.newValue.hashtags[change.newValue.hashtags.length - 1].tag, currentHashtagsLength: change.newValue.hashtags.length});
      } else {
        this.setState({newTag: null, currentHashtagsLength: change.newValue.hashtags.length});
      }
    }) });
  }

  componentWillUnmount() {
    // destroy observe
    this.state.observer();
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
    const {classes, theme} = this.props;

    if(!record) return null;

    return (
      <div>
        <Typography variant="h4" style={{textAlign: 'center'}} ><FormattedMessage id="onboard.userWings" values={{wingsCount: record.hashtags.length}} /></Typography>
        <div className="" style={{padding: 8, paddingTop: 10}} >
          {record && record.hashtags && record.hashtags.length > 0 && record.hashtags.map((hashtag, i) => {
            if(!this.shoudlRenderWing(hashtag)) return null;
            let displayedName = (hashtag.name_translated ? (hashtag.name_translated[this.state.locale] || hashtag.name_translated['en-UK']) || hashtag.name || hashtag.tag : hashtag.name)
            
            if(!this.shouldAnimateWing(hashtag)) {
              return (
                <div className="" key={i} style={{display: 'inline-block'}} >
                  <Wings  src={ProfileService.getPicturePath(hashtag.picture) || defaultHashtagPicture}
                    label={ProfileService.htmlDecode(displayedName)} key={hashtag.tag}
                    className={''} 
                    onDelete={(e) => {this.props.handleRemoveWing(e, hashtag.tag)}} />
                </div>
              )
            } else {
              return (
                <div className="" key={i} style={{display: 'inline-block'}} >
                  <Wings  src={ProfileService.getPicturePath(hashtag.picture) || defaultHashtagPicture}
                    label={ProfileService.htmlDecode(displayedName)} key={hashtag.tag}
                    className={'animated'} 
                    style={{background: theme.palette.primary.main}}
                    onDelete={(e) => {this.props.handleRemoveWing(e, hashtag.tag)}} />
                </div>
              )
            }

          })}
          {record && record.hashtags && record.hashtags.length === 0 && (
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
