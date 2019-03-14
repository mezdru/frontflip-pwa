import React from 'react'
import { withStyles, Typography } from '@material-ui/core';
import { inject, observer } from "mobx-react";
import { observe } from 'mobx';

import Wings from './Wing';
import ProfileService from '../../../services/profile.service';
import defaultHashtagPicture from '../../../resources/images/placeholder_hashtag.png';

class UserWings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      observer: ()=> {}
    };
  }

  componentDidMount() {
    this.setState({observer: observe(this.props.recordStore.values, 'record', (change) => {
      this.forceUpdate();
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

  render() {
    const {record} = this.props.recordStore.values;

    if(!record) return null;

    return (
      <div>
        <Typography variant="h4" style={{textAlign: 'center'}} >Your {record.hashtags.length} Wings:</Typography>
        <div className="" style={{padding: 8, paddingTop: 10}} >
          {record && record.hashtags && record.hashtags.length > 0 && record.hashtags.map((hashtag, i) => {
            if(!this.shoudlRenderWing(hashtag)) return null;
            let displayedName = (hashtag.name_translated ? (hashtag.name_translated[this.state.locale] || hashtag.name_translated['en-UK']) || hashtag.name || hashtag.tag : hashtag.name)
            return (
                <div className="" key={i} style={{display: 'inline-block'}} >
                  <Wings  src={ProfileService.getPicturePath(hashtag.picture) || defaultHashtagPicture}
                    label={ProfileService.htmlDecode(displayedName)} key={hashtag.tag}
                    className={''} 
                    onDelete={(e) => {this.props.handleRemoveWing(e, hashtag.tag)}} />
                </div>
            )
          })}
          {record && record.hashtags && record.hashtags.length === 0 && (
            <Typography variant="h6">
              Les Wings sont vos compétences, talents et hobbies. frf ref er fre f
              bla rkgo rkgokepkg krtg ktkg pktkgtkrgktrgkrtkg krtgtrg rt gtr gr tggrg 
              grgrtg rfrfjjjjjjjjjj jjjjjjjjj jjjjjjjjjjjj jjjjjjjjjjjjjjjjjjjjjjjjj
            </Typography>
          )}
        </div>
      </div>
    );
  }
}

export default inject('commonStore', 'recordStore')(
  observer(
    withStyles(null)(UserWings)
  )
);
