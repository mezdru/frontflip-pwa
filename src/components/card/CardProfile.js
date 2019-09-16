import React from 'react';
import PropTypes from 'prop-types';
import {Grid, withStyles, Typography, IconButton, CardActions, CardContent, CardHeader, Card, Tooltip} from '@material-ui/core';
import withWidth from '@material-ui/core/withWidth';
import {inject, observer} from 'mobx-react';

import '../../resources/stylesheets/font-awesome.min.css';
import Availability from '../availabilityToggle/Availability';
import Wings from '../utils/wing/Wings';
import defaultPicture from '../../resources/images/placeholder_person.png';
import ProfileService from '../../services/profile.service';
import withSearchManagement from '../../hoc/SearchManagement.hoc';
import {styles} from './CardProfile.css';
import { injectIntl } from 'react-intl';

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

  getClaps(hit, hashtagId) {
    if(!hit || !hit.hashtags_claps) return null;
    var clapEntry = hit.hashtags_claps.find(elt => elt.hashtag === hashtagId);
    return clapEntry ? clapEntry.claps : null;
  }

  isHidden = (tag) => {
    return (this.props.commonStore.hiddenWings.find((hiddenWing => hiddenWing.tag === tag)));
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
          <CardContent style={{paddingBottom: 0}}>
            <Grid container className={classes.wings}>
              {hit.hashtags && hit.hashtags.map((hashtag, i) => {
                if(i >= WINGS_DISPLAYED || this.isHidden(hashtag.tag)) return null;
                let displayedName = ProfileService.getWingDisplayedName(hashtag, locale);
                let claps = this.getClaps(hit, hashtag._id);
                return (
                  <Wings src={ProfileService.getPicturePath(hashtag.picture)} key={hashtag._id}
                    label={ProfileService.htmlDecode(displayedName)}
                    onClick={(e) => addFilter({name: displayedName, tag: hashtag.tag, value: hashtag.tag, label: displayedName})}
                    recordId={hit.objectID} hashtagId={hashtag._id} claps={claps} mode={(hashtag.class ? 'highlight' : 'card')}
                    enableClap={true}
                  />
                )
              })}
              {hit.hashtags && hit.hashtags.length > WINGS_DISPLAYED && (
                <Wings label={this.props.intl.formatMessage({ id: 'card.moreWings' }, { counter: (hit.hashtags.length - WINGS_DISPLAYED)})}
                  enableClap={false} 
                  mode='card' 
                  onClick={(e) => handleDisplayProfile(e, hit)}
                />
              )}
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
    withWidth()(withStyles(styles)(injectIntl(CardProfile)))
  )
);
