import React, {Suspense} from 'react';
import { withStyles, Grid, Slide, CircularProgress } from '@material-ui/core';
import { Redirect } from 'react-router-dom';
import { inject, observer } from 'mobx-react';

import ProfileThumbnail from './ProfileThumbnail';
import BannerResizable from '../utils/banner/BannerResizable';
import ProfileWings from './ProfileWings';
import ProfileActions from './ProfileActions';
import { styles } from './ProfileLayout.css';
import { withProfileManagement } from '../../hoc/profile/withProfileManagement';

const ProfileClapHistory = React.lazy(() => import('./ProfileClapHistory'));


class ProfileLayout extends React.Component {

  state = {
    isVisible: false
  }

  componentDidMount() {
    this.setState({isVisible: true})
  }

  componentWillReceiveProps(nextProps) {
    this.setState({isVisible: true})
  }

  handleClose = () => {
    this.setState({isVisible: false}, () => {
      setTimeout(() => {
        this.props.profileContext.reset();
      }, this.props.transitionDuration /2 );
    })
  }

  render() {
    const { classes, transitionDuration } = this.props;
    const { isVisible } = this.state;

    return (
      <Slide direction="up" in={isVisible} mountOnEnter unmountOnExit timeout={{ enter: transitionDuration, exit: transitionDuration / 2 }}>

        <Grid container className={classes.root} alignContent="flex-start">

          <BannerResizable
            type={'profile'}
            initialHeight={100}
            style={styles.banner}
          />
          <div className={classes.blackFilter} ></div>

          <Grid container alignContent="flex-start" style={{ height: '100vh', overflowY: 'auto', zIndex: 1 }} >

            <Grid container item xs={12} style={{ height: 116 }} alignContent="flex-start" justify="flex-start" className={classes.actions} >
              <ProfileActions canPropose canFilter handleClose={this.handleClose} />
            </Grid>
            <Grid item className={classes.thumbnail} xs={12} lg={3}>
              <ProfileThumbnail />
            </Grid>
            <Grid container item className={classes.content} xs={12} lg={9} alignContent="flex-start">
              <Grid item xs={12} lg={8} className={classes.wings} >
                <ProfileWings />
              </Grid>

              <Grid item xs={12} lg={4} className={classes.clapHistory}>
                <Suspense fallback={<CircularProgress color='secondary' />}>
                  <ProfileClapHistory />
                </Suspense>
              </Grid>
            </Grid>
          </Grid>

        </Grid>
      </Slide>
    )
  }
}

export default inject('commonStore', 'organisationStore', 'authStore', 'recordStore', 'userStore')(
  observer(
    withStyles(styles)( withProfileManagement(ProfileLayout))
  )
);
