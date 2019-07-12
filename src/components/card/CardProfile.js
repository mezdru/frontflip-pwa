import React from 'react';
import PropTypes from 'prop-types';
import {Grid, withStyles, Typography, IconButton, CardActions, CardContent, CardHeader, Card, Tooltip} from '@material-ui/core';
import withWidth from '@material-ui/core/withWidth';
import {inject, observer} from 'mobx-react';

import '../../resources/stylesheets/font-awesome.min.css';
import Availability from '../availabilityToggle/Availability';
import Wings from '../utils/wing/Wing';
import defaultPicture from '../../resources/images/placeholder_person.png';
import ProfileService from '../../services/profile.service';
import withSearchManagement from '../search/SearchManagement.hoc';
import {styles} from './CardProfile.css';

ProfileService.setExtraLinkLimit(5);
const WINGS_DISPLAYED = 7;

class CardProfile extends React.PureComponent {
  constructor(props) {
    super(props);
    
    this.state = {
      locale: this.props.commonStore.getCookie('locale') || this.props.commonStore.locale
    }
  }
  
  getLogoSize = () => {
    switch (this.props.width) {
      case 'xs':
        return '150x150';
      default:
        return '200x200';
    }
  }
  
  render() {
    const {classes, hit, handleDisplayProfile} = this.props;
    const { addFilter } = this.props;
    const {locale} = this.props.commonStore;

    ProfileService.transformLinks(hit);
    ProfileService.makeHightlighted(hit);
    ProfileService.orderHashtags(hit);
    
    return (
      <Card className={classes.fullWidth} key={hit.objectID} >
        <Grid item container>
          <CardHeader
            onClick={(e) => handleDisplayProfile(e, hit)}
            avatar={
              <Grid item container>
                <Grid item style={{backgroundImage: `url(${ProfileService.getPicturePathResized(hit.picture, 'person ', this.getLogoSize()) || defaultPicture})`}} className={`${classes.logo} ${classes.backgroundLogo}`}/>
                {((hit.personAvailability) && (hit.personAvailability !== 'unspecified')) ? <Grid item className={classes.dispo}>
                  <Availability available={`${classes[hit.personAvailability]}`}/>
                </Grid> : ''}
              </Grid>
            }
            title={
              <Typography variant="h4" className={`${classes.name} ${classes.titleSmallestView}`} gutterBottom>
                <span dangerouslySetInnerHTML={{__html: ProfileService.htmlDecode(((hit._highlightResult && hit._highlightResult.name) ? hit._highlightResult.name.value : null) || hit.name) || hit.tag}}></span>
              </Typography>
            }
            subheader={
              <Typography variant="body1" className={`${classes.name} ${classes.intro}`} gutterBottom>
                <span dangerouslySetInnerHTML={{__html: ProfileService.htmlDecode(((hit._snippetResult && hit._snippetResult.intro) ? hit._snippetResult.intro.value : null) || hit.intro || '')}}></span>
              </Typography>
            }
            className={classes.cardHeader}
          />
        </Grid>
        <Grid item container className={classes.contactField}>
          <CardActions disableActionSpacing>
            <Grid item container>
              {hit.links && hit.links.map((link, i) => {
                if (!link.value || link.value === '') return null;
                if(link.type === 'workchat') return null; // hide workchat
                if (link.class !== 'extraLink') {
                  return (
                    <Grid item key={link._id} className={classes.contact}>
                      <Tooltip title={ProfileService.htmlDecode(link.display) || ProfileService.htmlDecode(link.value) || ProfileService.htmlDecode(link.url)}>
                        <IconButton href={link.url} rel="noopener" target="_blank" className={classes.contactButton + " fa fa-" + link.icon}/>
                      </Tooltip>
                    </Grid>
                  )
                } else {
                  return null;
                }
              })}
            </Grid>
          </CardActions>
        </Grid>
        <Grid container item className={classes.wingsContainer}>
          <CardContent>
            <Grid container className={classes.wings}>
              {hit.hashtags && hit.hashtags.map((hashtag, i) => {
                if(i >= WINGS_DISPLAYED) return null;
                let displayedName = (hashtag.name_translated ? (hashtag.name_translated[locale] || hashtag.name_translated['en-UK']) || hashtag.name || hashtag.tag : hashtag.name || hit.tag)
                return (
                  <Wings src={ProfileService.getPicturePath(hashtag.picture)} key={hashtag._id}
                      label={ProfileService.htmlDecode(displayedName)}
                      onClick={(e) => addFilter({name: displayedName, tag: hashtag.tag, value: hashtag.tag, label: displayedName})}
                      className={(hashtag.class ? hashtag.class : 'notHighlighted')}
                         color={'primary'}
                  />
                )
              })}
            </Grid>
          </CardContent>
        </Grid>
      </Card>
    );
  }
}

CardProfile.propTypes = {
  classes: PropTypes.object.isRequired,
};

CardProfile = withSearchManagement(CardProfile);

export default inject('commonStore')(
  observer(
    withWidth()(withStyles(styles)(CardProfile))
  )
);
