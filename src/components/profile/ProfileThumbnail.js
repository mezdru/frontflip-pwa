import React from 'react';
import { withStyles, Paper, Grid, Typography } from '@material-ui/core';
import Logo from '../utils/logo/Logo';
import ProfileService from '../../services/profile.service';
import ProfileContacts from './ProfileContacts';
import {styles} from './ProfileThumbnail.css';
import { FormattedMessage } from 'react-intl';
import { withProfileManagement } from '../../hoc/profile/withProfileManagement';

const ProfileThumbnail = React.memo(withProfileManagement(withStyles(styles)(({classes, record, profileContext,  ...props}) => {
  return (
    <Paper className={classes.main}>
      <Logo className={classes.profilePicture} src={ProfileService.getPicturePathResized( profileContext.getProp('picture'), 'person', '200x200')} type="person" />
      <div className={classes.topOffset} ></div>

      <Grid container spacing={32}>

        <Grid item xs={12}>
          <Typography variant="h1" className={classes.text}>
            {ProfileService.htmlDecode(profileContext.getProp('name')) || profileContext.getProp('tag')}
          </Typography>
          <Typography variant="h2" className={classes.text} style={{color: '#555555', marginTop: 16}} >
            {ProfileService.htmlDecode(profileContext.getProp('intro'))}
          </Typography>
        </Grid>

        <Grid item container xs={12} direction="row" >
          <ProfileContacts />
        </Grid>

        <Grid item xs={12} >
          <Typography variant="h3" className={classes.text}>
            <FormattedMessage id="profile.aboutMe" />
          </Typography>
          <Typography variant="body2" className={classes.description}>
            {profileContext.getProp('description')}
          </Typography>
        </Grid>

      </Grid>
    </Paper>
  );
})));

export default ProfileThumbnail;