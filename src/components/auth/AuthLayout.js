import React from 'react';
import { Grid, Typography, Hidden } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { Clear } from '@material-ui/icons';

import Logo from '../utils/logo/Logo';
import Header from '../header/Header';
import BannerResizable from '../utils/banner/BannerResizable';

const styles = (theme) => ({
  root: {
    height: '100vh'
  },
  rootContainer: {
    position: 'relative',
    height: '100%',
  },
  authContainer: {
    backgroundColor: 'white',
    borderRadius: 5,
    zIndex: 2,
    margin: 16,
    minHeight: '50%',
    overflow: 'hidden',
    boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
    [theme.breakpoints.down('xs')]: {
      position: 'absolute',
      top: 48,
      marginTop: 32,
      left:0,
      width: 'calc(100vw - 32px)'
    }
  },
  logo: {
    position: 'relative',
    left: 0,
    right: 0,
    margin: 'auto',
    marginBottom: 16,
    width: '7rem',
    height: '7rem',
    boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
    // bottom: '3.2rem',
    // marginBottom: '-7rem',
    // zIndex: 2,
    border: '4px solid white'
  },
  orgPart: {
    position: 'relative',
    backgroundImage: 'linear-gradient(to bottom, #2b2d3c, #292a38, #262733, #24242f, #21212b)',
    padding: 16,
  },
  orgPartTitle: {
    color: 'white',
    width: '100%',
    textAlign: 'center',
  },
  shadowedBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    background: 'rgb(0,0,0)',
    opacity: .3,
  },
  logoCross: {
    position: 'absolute',
    color: 'white',
    right: 0,
    top: '50%',
    transform: 'translateY(-50%) translateX(50%)',
  }
});

class Auth extends React.Component {
  constructor(props) {
    super(props);
  };

  render() {
    const { classes } = this.props;

    return (
      <div>
        <Header />
        <main className={classes.root}>
          <BannerResizable
            type={'organisation'}
            initialHeight={100}
            style={{ position: 'absolute' }}
          />
          <div id="shadowed-background" className={classes.shadowedBackground} />


          <Grid container direction={"row"} justify="center" alignItems="center" className={classes.rootContainer} >
            <Grid container item xs={12} lg={8} className={classes.authContainer}>
              <Grid item container lg={6} xs={0} className={classes.orgPart} alignItems={"center"} justify={"center"} alignContent={"center"}>
                <Grid item xs={12} container direction={"row"} >

                  <Hidden smDown>
                    <Grid item md={12}>
                      <Logo type={'organisation'} alt="org-logo" className={classes.logo} />
                    </Grid>
                  </Hidden>

                  <Typography variant="h2" className={classes.orgPartTitle}>Welcome to Wingzy</Typography>
                </Grid>

              </Grid>

              <Grid item xs={12} lg={6} style={{padding: 8}}>
                {this.props.children}
              </Grid>
            </Grid>
          </Grid>
        </main>
      </div>
    );
  }
}

export default withStyles(styles)(Auth);
