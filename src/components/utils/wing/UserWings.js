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
    };
  }

  componentDidMount() {
    observe(this.props.recordStore.values, 'record', (change) => {
      this.forceUpdate();
    });
  }

  render() {
    const {record} = this.props.recordStore.values;

    if(!record) return null;
    

    return (
      <div>
        <Typography variant="h3" style={{textAlign: 'center'}} >Your {record.hashtags.length} Wings</Typography>
        <div className="" data-id="userwings">
          {record && record.hashtags.map((hashtag, i) => {
            if(!hashtag) return null;
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
