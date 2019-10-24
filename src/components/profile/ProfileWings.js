import React from 'react';
import { withStyles, Typography, IconButton } from '@material-ui/core';
import Wings from '../utils/wing/Wings';
import ProfileService from '../../services/profile.service';
import { inject, observer } from 'mobx-react';
import { withProfileManagement } from '../../hoc/profile/withProfileManagement';
import { observe } from 'mobx';
import { Add } from '@material-ui/icons';
import { getBaseUrl } from '../../services/utils.service';
import { Link } from 'react-router-dom';
import undefsafe from 'undefsafe';

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
    paddingBottom: 24
  },
  wingsFamilyTitle: {
    textTransform: 'uppercase',
    fontSize: '0.8rem',
    fontWeight: 400,
    marginLeft: 16,
    lineHeight: 1,
  },
  addWingsButton: {
    color: theme.palette.secondary.dark,
    transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    backgroundColor: 'white',
    width: 32,
    height: 32,
    marginLeft: 8,
    opacity: 0.7,
    marginTop: 16,
    verticalAlign: 'bottom !important',
    '& span': {
      // marginTop: -4
    },
    '&:hover': {
      color: theme.palette.secondary.main,
      backgroundColor: 'white',
      opacity: 1
    }
  }
});

class ProfileWings extends React.PureComponent {

  async componentWillMount() {
    if(this.props.commonStore.url.params.recordTag) {
      let record = await this.props.recordStore.getOrFetchRecord(null, this.props.commonStore.url.params.recordTag, this.props.orgStore.currentOrganisation._id);
      await this.getClapsCount(record._id || record.objectID);
    }

    let inProgress = false;
    this.unsubscribeUrlRecord = observe(this.props.commonStore.url, 'params', async (change) => {
      if (change.newValue.recordTag && !inProgress) {
        inProgress = true;
        let record = await this.props.recordStore.getOrFetchRecord(null, change.newValue.recordTag, this.props.orgStore.currentOrganisation._id);
        await this.getClapsCount(record._id || record.objectID);
        inProgress = false;
      }
    });
  }

  componentWillUnmount() {
    this.isUnmount = true;
    if(this.unsubscribeUrlRecord) this.unsubscribeUrlRecord();
  }

  getClapsCount = async (recordId) => {
    if(!this.props.authStore.isAuth()) return;
    this.props.clapStore.setCurrentRecordId(recordId);
    await this.props.clapStore.getClapCountByProfile().catch(e => { return; });
    if(!this.isUnmount) this.forceUpdate();
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

    return (
      <div className={classes.root} id="profile-wings">
        {wingsByFamilies && wingsByFamilies.length > 0 && wingsByFamilies.map((wbf, index) => {
          if (wbf.wings.length === 0) return null;
          return (
            <div key={index} className={classes.wingsFamilyContainer}>
              <Typography variant="body1" style={{ color: (wingsByFamilies.length > 1 || isEditable) ? 'rgba(255, 255, 255, 1)' : 'rgba(0,0,0,0)' }} className={classes.wingsFamilyTitle}>
                {(wingsByFamilies.length > 1 || isEditable) ? wbf.family.intro : '.'}
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
              {isEditable && (
                <IconButton
                  className={classes.addWingsButton}
                  component={Link}
                  to={getBaseUrl(this.props) + `/onboard/${(wbf.family.tag ? wbf.family.tag.replace('#', '%23') : 'wings')}/edit/${this.props.profileContext.getProp('tag')}`}
                >
                  <Add />
                </IconButton>
              )}
            </div>
          );
        })}
      </div>
    );
  }

}

export default inject('commonStore', 'clapStore', 'recordStore', 'orgStore', 'authStore')(
  observer(
    withStyles(styles)(withProfileManagement(ProfileWings))
  )
);