import React from 'react';
import {Grid} from '@material-ui/core';
import { withStyles} from '@material-ui/core/styles';
import Logo from '../utils/logo/Logo';
import Banner from '../utils/banner/Banner';
import Header from '../header/Header';
import BannerResizable from '../utils/banner/BannerResizable';

const styles = (theme) => ({
  root: {
    height: '100vh'
  },
  rootContainer: {
    height: '100%',
  },
  authContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    zIndex:2,
    margin: 16,
    minHeight: '50%',
    overflow: 'hidden',
    boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
  },
  logo: {
    position: 'relative',
    left:0,
    right:0,
    margin: 'auto',
    marginTop: 32,
    width: '6rem',
    height: '6rem',
    // boxShadow: '0 5px 15px -1px darkgrey, 0 0 0 5px transparent',
    // bottom: '3.2rem',
    // marginBottom: '-7rem',
    // zIndex: 2,
    border: '4px solid white'
  },
  orgPart: {
    backgroundImage: 'linear-gradient(to bottom, #2b2d3c, #292a38, #262733, #24242f, #21212b)',
  },
  shadowedBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    background: 'rgb(0,0,0)',
    opacity: .2,
  }
});

class Auth extends React.Component {
  constructor(props) {
    super(props);
  };

  render() {
    const {classes} = this.props;

    return (
      <div>
        <Header />
        <main className={classes.root}>
        <BannerResizable
            type={'organisation'}
            initialHeight={100}
            style={{position: 'absolute'}}
          />
                    <div id="shadowed-background" className={classes.shadowedBackground} />


          <Grid container direction={"row"} justify="center" alignItems="center" className={classes.rootContainer} >
            <Grid container item xs={12} lg={6} className={classes.authContainer}>
              <Grid item lg={6} xs={0} className={classes.orgPart} >
              <Logo type={'organisation'} alt="org-logo" className={classes.logo} />
              </Grid>

              <Grid item xs={12} lg={6}>
                {this.props.children}
              </Grid>
            </Grid>
          </Grid>
          {/* <Grid container direction={"column"} justify={"space-around"} alignItems={"center"}>
            <Grid container item alignItems={"stretch"}>
              <Banner />
            </Grid>
            <Grid item container justify={"center"}>
              <Logo type={'organisation'} alt="org-logo" className={classes.logo} />
            </Grid>
            <Grid container item xs={12} sm={6} lg={4}>
              {this.props.children}
            </Grid>
          </Grid> */}
        </main>
      </div>
    );
  }
}

export default withStyles(styles)(Auth);
