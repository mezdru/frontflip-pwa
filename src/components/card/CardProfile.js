import React from 'react';
import PropTypes from 'prop-types';
import {Grid, withStyles, Typography, IconButton, CardActions, CardContent, CardHeader, Card, Tooltip} from '@material-ui/core';
import withWidth from '@material-ui/core/withWidth';
import {inject, observer} from 'mobx-react';
import '../../resources/stylesheets/font-awesome.min.css';
import Logo from '../../components/utils/logo/Logo';
import Availability from '../availabilityToggle/Availability';
import Wings from '../utils/wing/Wing';
import defaultPicture from '../../resources/images/placeholder_person.png';
import defaultHashtagPicture from '../../resources/images/placeholder_hashtag.png';
import ProfileService from '../../services/profile.service';
ProfileService.setExtraLinkLimit(5);


const styles = theme => ({
  logo: {
    width: 170,
    height: 170,
    marginBottom: '-5rem',
    [theme.breakpoints.down('xs')]: {
      width: 146,
      height: 146,
      marginBottom: '-3rem',
    },
    [theme.breakpoints.down(400)]: {
      width: 124,
      height: 124,
      marginBottom: '-3rem',
    },
    '& img': {
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      border: '8px solid white'
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
    [theme.breakpoints.down('xs')]: {
      fontSize: '1.2rem!important',
    },
  },
  wings: {
    display: 'inline-block',
    color: 'white',
    position: 'relative',
    [theme.breakpoints.up('sm')]: {
      marginTop: '32px!important',
    },
  },
  fullWidth: {
    width: '100%'
  },
  cardHeader: {
    cursor: 'pointer',
    maxHeight: 138,
  },
  contact: {
    [theme.breakpoints.up(400)]: {
      margin: 4,
    }
  },
  contactButton: {
    width: 37,
    height: 37,
    '&::before': {
      position:'absolute',
      left:0,
      right:0,
      margin:'auto',
    }
  },
  dispo: {
    position: 'relative',
    [theme.breakpoints.down('xs')]: {
      marginLeft: -42,
      marginTop: 106,
      marginBottom: -50,
    },
    [theme.breakpoints.down(400)]: {
      marginLeft: -36,
      marginTop: 90,
      marginBottom: -50,
    },
    marginLeft: -42,
    marginTop: 125,
    marginBottom: -120,
  },
  available: {
    backgroundColor: 'green',
  },
  unavailable: {
    backgroundColor: 'red',
  },
  unspecified: {
    backgroundColor: '#C2CACF',
  }
});

class CardProfile extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      locale: this.props.commonStore.getCookie('locale') || this.props.commonStore.locale
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
              <Logo type={'person'} className={classes.logo} src={ProfileService.getPicturePath(hit.picture) || defaultPicture}/>
                <Grid item className={classes.dispo}>
                <Availability available={`${classes[hit.personAvailability]}`} />
              </Grid>
              </Grid>
            }
            title={
              <Typography variant="h4" className={`${classes.name} ${classes.titleSmallestView}`} gutterBottom>
                                <span dangerouslySetInnerHTML={{__html: ProfileService.htmlDecode(( (hit._highlightResult && hit._highlightResult.name) ? hit._highlightResult.name.value : null) || hit.name) || hit.tag}}></span>
              </Typography>
            }
            subheader={
              <Typography variant="body1" className={`${classes.name} ${classes.intro}`} gutterBottom>
                                <span dangerouslySetInnerHTML={{__html: ProfileService.htmlDecode(( (hit._snippetResult && hit._snippetResult.intro) ? hit._snippetResult.intro.value : null) || hit.intro || '')}}></span>
              </Typography>
            }
            onClick={(e) => handleDisplayProfile(e, hit)}
            className={classes.cardHeader}
          />
        </Grid>
        <Grid item container justify={'flex-end'}>
          <CardActions disableActionSpacing>
            <Grid item container>
              {hit.links && hit.links.map((link, i) => {
                if(link.class !== 'extraLink'){
                  return (
                    <Grid item key={link._id} className={classes.contact}>
                      <Tooltip title={ProfileService.htmlDecode(link.display) || ProfileService.htmlDecode(link.value) || ProfileService.htmlDecode(link.url)}>
                        <IconButton href={link.url} target="_blank" className={classes.contactButton + " fa fa-" + link.icon}/>
                      </Tooltip>
                    </Grid>
                  )
                } else { return null; }
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
                                    <Wings  src={ProfileService.getPicturePath(hashtag.picture) || defaultHashtagPicture}
                         label={ProfileService.htmlDecode(displayedName)} key={hashtag.tag}
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
