import React from 'react';
import PropTypes from 'prop-types';
import { Grid, withStyles, Typography, IconButton, CardActions, CardContent, CardHeader, Card, Tooltip } from '@material-ui/core';
import withWidth from '@material-ui/core/withWidth';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import '../../resources/stylesheets/font-awesome.min.css';
import Availability from '../availabilityToggle/Availability';
import Wings from '../utils/wing/Wings';
import defaultPicture from '../../resources/images/placeholder_person.png';
import ProfileService from '../../services/profile.service';
import withSearchManagement from '../../hoc/SearchManagement.hoc';
import { styles } from './CardProfile.css';
import { injectIntl } from 'react-intl';
import { getBaseUrl } from '../../services/utils.service';

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
    var clapEntry = {};
    if (!hit || !hit.hashtags_claps) return null;
    clapEntry = Object.assign(clapEntry, hit.hashtags_claps.find(elt => elt.hashtag === hashtagId));
    return clapEntry ? clapEntry.claps : null;
  }

  isHidden = (tag) => {
    return (this.props.commonStore.hiddenWings.find((hiddenWing => hiddenWing.tag === tag)));
  }

  handleContactClick = (link) => {
    this.props.keenStore.recordEvent('contact', {type: link.type, value: link.value, recordEmitter: this.props.recordStore.currentUserRecord._id, recordTarget: this.props.hit.objectID});
  }

  render() {
    const { classes, hit } = this.props;
    const { addFilter } = this.props;
    const { locale } = this.props.commonStore;
    let currentWings = 0;

    ProfileService.transformLinks(hit);
    ProfileService.makeHightlighted(hit);
    ProfileService.orderHashtags(hit);

    hit.provider = 'algolia';
    this.props.recordStore.addRecord(hit);

    return (
      <Card className={classes.fullWidth} key={hit.objectID} >
        <Grid item container>
          <Link to={getBaseUrl(this.props) + '/' + hit.tag} style={{ width: '100%', textDecoration: 'none' }}>
            <CardHeader
              avatar={
                <Grid item container>
                  <Grid item style={{ backgroundImage: `url(${ProfileService.getPicturePathResized(hit.picture, 'person ', this.getLogoSize()) || defaultPicture})` }} className={`${classes.logo} ${classes.backgroundLogo}`} />
                  {((hit.personAvailability) && (hit.personAvailability !== 'unspecified')) ? <Grid item className={classes.dispo}>
                    <Availability available={`${classes[hit.personAvailability]}`} />
                  </Grid> : ''}
                </Grid>
              }
              title={
                <Typography variant="h1" className={`${classes.name} ${classes.titleSmallestView}`} gutterBottom>
                  <span dangerouslySetInnerHTML={{ __html: ProfileService.htmlDecode(((hit._highlightResult && hit._highlightResult.name) ? hit._highlightResult.name.value : null) || hit.name) || hit.tag }}></span>
                </Typography>
              }
              subheader={
                <Typography variant="h2" className={`${classes.name} ${classes.intro}`} gutterBottom>
                  <span dangerouslySetInnerHTML={{ __html: ProfileService.htmlDecode(((hit._snippetResult && hit._snippetResult.intro) ? hit._snippetResult.intro.value : null) || hit.intro || '') }}></span>
                </Typography>
              }
              className={classes.cardHeader}
            />
          </Link>
        </Grid>
        <Grid item container className={classes.contactField}>
          <CardActions disableActionSpacing>
            <Grid item container>
              {hit.links && hit.links.map((link, i) => {
                if (!link.value || link.value === '') return null;
                if (link.type === 'workchat') return null; // hide workchat
                if (link.class !== 'extraLink') {
                  return (
                    <Grid item key={link._id} className={classes.contact} onClick={() => this.handleContactClick(link)}>
                      <Tooltip title={ProfileService.htmlDecode(link.display) || ProfileService.htmlDecode(link.value) || ProfileService.htmlDecode(link.url)}>
                        <IconButton href={link.url} rel="noopener" target="_blank" className={classes.contactButton + " fa fa-" + link.icon} />
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
          <CardContent style={{ paddingBottom: 0 }}>
            <Grid container className={classes.wings}>
              {hit.hashtags && hit.hashtags.map((hashtag, i) => {
                if (currentWings >= WINGS_DISPLAYED || this.isHidden(hashtag.tag)) return null;
                currentWings++;
                let displayedName = ProfileService.getWingDisplayedName(hashtag, locale);
                let claps = this.getClaps(hit, hashtag._id);
                return (
                  <Wings src={ProfileService.getPicturePath(hashtag.picture)} key={hashtag._id}
                    label={ProfileService.htmlDecode(displayedName)}
                    onClick={(e) => addFilter({ name: displayedName, tag: hashtag.tag, value: hashtag.tag, label: displayedName })}
                    recordId={hit.objectID} hashtagId={hashtag._id} claps={claps} mode={(hashtag.class ? 'highlight' : 'card')}
                    enableClap={true}
                  />
                )
              })}
              {hit.hashtags && hit.hashtags.length > WINGS_DISPLAYED && (
                <Link to={getBaseUrl(this.props) + '/' + hit.tag}>
                  <Wings label={this.props.intl.formatMessage({ id: 'card.moreWings' }, { counter: (hit.hashtags.length - WINGS_DISPLAYED) })}
                    enableClap={false}
                    mode='card'
                  />
                </Link>
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

export default inject('commonStore', 'orgStore', 'recordStore', 'keenStore')(
  observer(
    withWidth()(withStyles(styles)(injectIntl(CardProfile)))
  )
);
