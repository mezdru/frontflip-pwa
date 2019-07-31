import React from 'react';
import { withStyles } from '@material-ui/core';
import Wings from '../utils/wing/Wings';
import ProfileService from '../../services/profile.service';
import { inject, observer } from 'mobx-react';
import { withProfileManagement } from '../../hoc/profile/withProfileManagement';

const styles = theme => ({
  contactIcon: {
    marginRight: 8,
    position: 'relative',
    textAlign: 'center',
    width: 48,
    fontSize: 32,
    display: 'inline-block',
  },
});

class ProfileWings extends React.PureComponent {

  componentDidMount() {
    this.getClapsCount();
  }

  getClapsCount = () => {
    this.props.clapStore.setCurrentRecordId(this.props.profileContext.getProp('_id'));
    this.props.clapStore.getClapCountByProfile()
      .then(clapsCount => {
        this.forceUpdate();
      }).catch(e => {return;});
  }

  getClaps = (hashtagId) => {
    var hashtags_claps = this.props.profileContext.getProp('hashtags_claps');
    if(!hashtags_claps) return null;
    var clapEntry = hashtags_claps.find(elt => elt.hashtag === hashtagId);
    return clapEntry ? clapEntry.claps : null;
  }

  render() {
    const {classes, profileContext} = this.props;
    const {locale} = this.props.commonStore;
    var wings = profileContext.getProp('hashtags');

    return (
      <div className={classes.root} >
        {wings && wings.length > 0 && wings.map((wing, index) => {
          let displayedName = (wing.name_translated ? (wing.name_translated[locale] || wing.name_translated['en-UK']) || wing.name || wing.tag : wing.name || "...")
          return (
            <Wings src={ProfileService.getPicturePath(wing.picture)}
              label={ProfileService.htmlDecode(displayedName)} key={wing._id  }
              recordId={profileContext.getProp('_id')} hashtagId={wing._id} mode={(wing.class ? 'highlight' : 'profile')}
              enableClap={true} claps={this.getClaps(wing._id)}
            />
          )
        })}
      </div>
    );
  }

}

export default inject('commonStore', 'clapStore')(
  observer(
    withStyles(styles)( withProfileManagement(ProfileWings))
  )
);