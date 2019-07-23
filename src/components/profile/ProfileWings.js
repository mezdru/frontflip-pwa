import React from 'react';
import { withStyles, IconButton, Grid } from '@material-ui/core';
import classNames from 'classnames';
import Wings from '../utils/wing/Wings';
import ProfileService from '../../services/profile.service';
import { inject, observer } from 'mobx-react';

const styles = theme => ({
  root: {
  },
  contactIcon: {
    marginRight: 8,
    position: 'relative',
    textAlign: 'center',
    width: 48,
    fontSize: 32,
    display: 'inline-block',
  },
});

let getClaps = (hashtags_claps, hashtagId) => {
  if(!hashtags_claps) return null;
  var clapEntry = hashtags_claps.find(elt => elt.hashtag === hashtagId);
  return clapEntry ? clapEntry.claps : null;
}


class ProfileWings extends React.PureComponent {
  state = {
  }

  componentWillReceiveProps(nextProps) {
    this.getClapsCount(nextProps.recordId);
  }

  getClapsCount = (recordId) => {
    console.log('GET count')
    this.props.clapStore.setCurrentRecordId(recordId);
    this.props.clapStore.getClapCountByProfile()
      .then(clapsCount => {
        console.log('COUNT FETCHED')
        this.forceUpdate();
      }).catch(e => console.log(e));
  }

  render() {
    const {classes, wings, recordId, clapDictionnary} = this.props;
    const {locale} = this.props.commonStore;

    console.log('UPDATE WINGS')

    return (
      <div className={classes.root} >
        {wings && wings.length > 0 && wings.map((wing, index) => {
          let displayedName = (wing.name_translated ? (wing.name_translated[locale] || wing.name_translated['en-UK']) || wing.name || wing.tag : wing.name || "...")
          return (
            <Wings src={ProfileService.getPicturePath(wing.picture)}
              label={ProfileService.htmlDecode(displayedName)} key={wing._id  }
              recordId={recordId} hashtagId={wing._id} mode={(wing.class ? 'highlight' : 'profile')}
              enableClap={true} claps={getClaps(clapDictionnary, wing._id)}
            />
          )
        })}
      </div>
    );
  }

}

export default inject('commonStore', 'recordStore', 'clapStore', 'userStore')(
  observer(
    withStyles(styles)(ProfileWings)
  )
);