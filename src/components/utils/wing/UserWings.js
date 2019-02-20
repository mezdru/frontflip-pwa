import React from 'react'
import { withStyles } from '@material-ui/core';
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
    console.log(record.hashtags.length);
    return (
      <div>
        {record.hashtags && record.hashtags.map((hashtag, i) => {
          let displayedName = (hashtag.name_translated ? (hashtag.name_translated[this.state.locale] || hashtag.name_translated['en-UK']) || hashtag.name || hashtag.tag : hashtag.name)
          return (
                              <Wings  src={ProfileService.getPicturePath(hashtag.picture) || defaultHashtagPicture} key={i}
                  label={ProfileService.htmlDecode(displayedName)} key={hashtag.tag}
                  className={(hashtag.class ? hashtag.class : 'notHighlighted')}/>
          )
        })}
      </div>
    );
  }
}

export default inject('commonStore', 'recordStore')(
  observer(
    withStyles(null)(UserWings)
  )
);
