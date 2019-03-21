import React from 'react';
import PropTypes from 'prop-types';
import {Grid, withStyles, Typography, IconButton, CardActions, CardContent, CardHeader, Card, Tooltip} from '@material-ui/core';
import withWidth from '@material-ui/core/withWidth';
import {inject, observer} from 'mobx-react';

import '../../resources/stylesheets/font-awesome.min.css';
import Availability from '../availabilityToggle/Availability';
import Wings from '../utils/wing/Wing';
import defaultPicture from '../../resources/images/placeholder_person.png';
import defaultHashtagPicture from '../../resources/images/placeholder_hashtag.png';
import ProfileService from '../../services/profile.service';

ProfileService.setExtraLinkLimit(5);


const styles = theme => ({
  logo: {
    width: 240,
    height: 240,
    marginBottom: -38,
    marginLeft: -62,
    backgroundColor: 'white',
    // [theme.breakpoints.down(320)]: {
    //   width: 179,
    //   height: 160,
    //   marginTop: -37,
    //   marginLeft: -52,
    // },
    // [theme.breakpoints.down(400)]: {
    //   width: 190,
    //   height: 180,
    //   marginTop: -42,
    //   marginBottom: -75,
    //   marginLeft: -51,
    // },
    [theme.breakpoints.down('xs')]: {
      width: 190,
      height: 190,
      marginLeft: -49,
      marginBottom: -25,
    },
  },
  name: {
    '& span em': {
      backgroundColor: theme.palette.primary.main,
      borderRadius: 30,
      color: 'white',
      fontWeight: '600',
      paddingLeft: 2,
      paddingRight: 2,
      // paddingLeft: 8,
      // paddingRight: 8,
    },
    display: 'block',
  },
  intro: {
    maxHeight: '3em',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  titleSmallestView: {
    marginLeft: -2,
    [theme.breakpoints.down('xs')]: {
      fontSize: '1.2rem!important',
      marginLeft: -6,
    },
  },
  wings: {
    display: 'inline-block',
    color: 'white',
    position: 'relative',
    marginTop: '22px!important',
    marginBottom: 4,
    // [theme.breakpoints.down(400)]: {
    //   marginTop: '14px!important',
    // },
    [theme.breakpoints.down('xs')]: {
      marginTop: '18px!important',
    }
  },
  fullWidth: {
    width: '100%'
  },
  cardHeader: {
    cursor: 'pointer',
    maxHeight: 138,
    [theme.breakpoints.down('xs')]: {
      maxHeight: 100,
    }
  },
  contact: {
    [theme.breakpoints.up('xs')]: {
      margin: 2,
    }
  },
  contactField: {
    marginLeft: 100,
    paddingLeft: 76,
    backgroundColor: theme.palette.primary.dark,
    boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
    // [theme.breakpoints.down(400)]: {
    //   marginLeft: 75,
    //   paddingLeft: 63
    // },
    [theme.breakpoints.down('xs')]: {
      marginLeft: 75,
      paddingLeft: 66,
    },
    // [theme.breakpoints.down(320)]: {
    //   marginLeft: 20,
    //   paddingLeft: 107,
    // },
  },
  contactButton: {
    width: 37,
    height: 37,
    [theme.breakpoints.down('xs')]: {
      width: 30,
      height: 30,
    },
    '&::before': {
      position: 'absolute',
      left: 0,
      right: 0,
      margin: 'auto',
    }
  },
  dispo: {
    position: 'relative',
    [theme.breakpoints.down('xs')]: {
      marginLeft: -42,
      marginTop: 133,
    },
    // [theme.breakpoints.down(400)]: {
    //   marginLeft: -40,
    //   marginTop: 100,
    //   marginBottom: -50,
    // },
    // [theme.breakpoints.down(320)]: {
    //   marginTop: 75,
    //   marginLeft: -40,
    //   marginBottom: -50,
    // },
    marginLeft: -51,
    marginTop: 174,
    // marginBottom: -14,
  },
  available: {
    backgroundColor: 'green',
  },
  unavailable: {
    backgroundColor: 'red',
  },
  backgroundLogo: {
    backgroundRepeat: 'no-repeat',
    backgroundPositionX: 'right',
    backgroundPositionY: 'bottom',
    borderRadius: '50%',
    border: '8px solid white',
    backgroundSize: '200px auto',
    // [theme.breakpoints.down(320)]: {
    //   backgroundSize: '84%',
    //   backgroundPositionX: '106%',
    //   backgroundPositionY:'182%',
    // },
    // [theme.breakpoints.down(400)]: {
    //   backgroundSize: '87%'
    // },
    [theme.breakpoints.down('xs')]: {
      backgroundSize: '150px auto',
    }
  }
})

class CardProfile extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      locale: this.props.commonStore.getCookie('locale') || this.props.commonStore.locale
    }
  }
  
  getLogoSize = () => {
    switch (this.props.width) {
      case 'xs':
        if (window.innerWidth < 400) {
          return '190x190';
        } else {
          return '190x190';
        }
      default:
        return '240x240';
    }
  }
  
  render() {
    const {classes, hit, addToFilters, handleDisplayProfile} = this.props;
    ProfileService.transformLinks(hit);
    ProfileService.makeHightlighted(hit);
    ProfileService.orderHashtags(hit);
    
    return (
      <Card className={classes.fullWidth} key={hit.objectID}>
        <Grid item container>
          <CardHeader
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
            onClick={(e) => handleDisplayProfile(e, hit)}
            className={classes.cardHeader}
          />
        </Grid>
        <Grid item container className={classes.contactField}>
          <CardActions disableActionSpacing>
            <Grid item container>
              {hit.links && hit.links.map((link, i) => {
                if (!link.value || link.value === '') return null;
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
        <Grid container item>
          <CardContent>
            <Grid container className={classes.wings}>
              {hit.hashtags && hit.hashtags.map((hashtag, i) => {
                let displayedName = (hashtag.name_translated ? (hashtag.name_translated[this.state.locale] || hashtag.name_translated['en-UK']) || hashtag.name || hashtag.tag : hashtag.name || hit.tag)
                return (
                  <Wings src={ProfileService.getPicturePath(hashtag.picture, 'hashtag') || defaultHashtagPicture} key={i}
                         label={ProfileService.htmlDecode(displayedName)}
                         onClick={(e) => addToFilters(e, {name: displayedName, tag: hashtag.tag})}
                         className={(hashtag.class ? hashtag.class : 'notHighlighted')}/>
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

export default inject('commonStore')(
  observer(
    withWidth()(withStyles(styles)(CardProfile))
  )
);
