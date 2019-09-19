import React from 'react';
import { withStyles, Typography } from '@material-ui/core';
import Wings from '../utils/wing/Wings';
import ProfileService from '../../services/profile.service';
import { inject, observer } from 'mobx-react';
import { withProfileManagement } from '../../hoc/profile/withProfileManagement';
import { observe } from 'mobx';
import { FormattedMessage } from 'react-intl';

const styles = theme => ({
  contactIcon: {
    marginRight: 8,
    position: 'relative',
    textAlign: 'center',
    width: 48,
    fontSize: 32,
    display: 'inline-block',
  },
  buttonAddWings: {
    padding: '6px 12px',
    cursor: 'pointer',
    margin: '16px 8px 4px 8px',
    borderRadius: 16,
    boxSizing: 'border-box',
    fontSize: '0.9125rem',
    display: 'inline-flex',
    fontWeight: 600,
    height: 32,
    transition: 'background-color 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    backgroundColor: theme.palette.secondary.dark,
    textDecoration: 'none',
    color: '#FFFFFF',
    '&:hover': {
      backgroundColor: theme.palette.secondary.main,
      boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)'
    }
  },
  wingsFamilyContainer: {
    paddingBottom: 16
  }
});

class ProfileWings extends React.PureComponent {

  componentDidMount() {
    observe(this.props.recordStore.values, 'displayedRecord', (change) => {
      this.getClapsCount(change.newValue ? change.newValue._id : null);
    });
  }

  getClapsCount = (recordId) => {
    let displayedRecord = this.props.recordStore.values.displayedRecord;
    this.props.clapStore.setCurrentRecordId(recordId || (displayedRecord ? displayedRecord._id : null));
    this.props.clapStore.getClapCountByProfile()
      .then(clapsCount => {
        this.forceUpdate();
      }).catch(e => { console.log(e); return; });
  }

  getClaps = (hashtagId) => {
    var hashtags_claps = this.props.profileContext.getProp('hashtags_claps');
    if (!hashtags_claps) return null;
    var clapEntry = hashtags_claps.find(elt => elt.hashtag === hashtagId);
    return clapEntry ? clapEntry.claps : null;
  }

  render() {
    const { classes, profileContext } = this.props;
    const { isEditable, wingsByFamilies } = this.props.profileContext;
    const { locale } = this.props.commonStore;
    const { organisation } = this.props.organisationStore.values;

    return (
      <div className={classes.root} >
        {wingsByFamilies && wingsByFamilies.length > 0 && wingsByFamilies.map((wbf, index) => {
          if (wbf.wings.length === 0) return null;
          return (
            <div key={index} className={classes.wingsFamilyContainer}>
              <Typography variant="h3" style={{ textTransform: 'uppercase', color: (wingsByFamilies.length > 1) ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0,0,0,0)' }}>
                {(wingsByFamilies.length > 1) ? wbf.family.name : '.'}
              </Typography>
              {wbf.wings.map((wing, index) => {
                let displayedName = ProfileService.getWingDisplayedName(wing, locale);
                return (
                  <Wings src={ProfileService.getPicturePath(wing.picture)}
                    label={ProfileService.htmlDecode(displayedName)} key={wing._id}
                    recordId={profileContext.getProp('_id')} hashtagId={wing._id} mode={(wing.class ? 'highlight' : 'profile')}
                    enableClap={true} claps={this.getClaps(wing._id)}
                  />
                )
              })}
            </div>
          );
        })}

        {isEditable && (
          <a href={"/" + locale + "/" + organisation.tag + "/onboard/wings/edit/" + profileContext.getProp('_id')}
            className={classes.buttonAddWings} >
            <FormattedMessage id="profile.addWings" />
          </a>
        )}
      </div>
    );
  }

}

export default inject('commonStore', 'clapStore', 'recordStore', 'organisationStore')(
  observer(
    withStyles(styles)(withProfileManagement(ProfileWings))
  )
);