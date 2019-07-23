import React, { PureComponent } from 'react';
import { withStyles, Paper, Grid, Typography } from '@material-ui/core';
import Logo from '../utils/logo/Logo';

import ProfileService from '../../services/profile.service';
import ProfileContacts from './ProfileContacts';

const styles = theme => ({
  root: {
    height: '100%',
    width: '100%',
    background: 'white'
  },
  main: {
    position: 'relative',
    width: '100%',
    height: '100%',
    padding: 32 
  },
  profilePicture: {
    position: 'absolute',
    left: 0,
    right: 0,
    margin: 'auto',
    top: -100,
    width: 200,
    height: 200,
    boxShadow: '0px 1px 5px 0px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 3px 1px -2px rgba(0,0,0,0.12)',
  },
  topOffset: {
    position: 'relative',
    height: 100,
  },
  text: {
    color: theme.palette.primary.dark,
  },
});

class ProfileThumbnail extends PureComponent {

  render() {

    const { classes, record } = this.props;

    return (
      <Paper className={classes.main}>
        <Logo className={classes.profilePicture} src={record.picture ? record.picture.url : null} />
        <div className={classes.topOffset} ></div>
        <Grid container spacing={32}>
          <Grid item xs={12}>
            <Typography variant="h1" className={classes.text}>
              {ProfileService.htmlDecode(record.name) || record.tag}
            </Typography>
            <Typography variant="h2" className={classes.text} style={{color: '#555555', marginTop: 16}} >
              {ProfileService.htmlDecode(record.intro || '')}
            </Typography>
          </Grid>

          <Grid item container xs={12} direction="row" >
            <ProfileContacts contacts={record.links} />
          </Grid>

          <Grid item xs={12} >
            <Typography variant="h3" className={classes.text}>
              A propos de moi
            </Typography>

          </Grid>


        </Grid>
      </Paper>
    );
  }

}

export default withStyles(styles)(ProfileThumbnail);