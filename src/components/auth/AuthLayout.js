import { Grid } from '@material-ui/core';
import React, {Suspense} from 'react';
import { withStyles } from '@material-ui/core/styles';
import Header from '../header/Header';
import BannerResizable from '../utils/banner/BannerResizable';

const Intercom = React.lazy(() => import('react-intercom'));

const styles = (theme) => ({
  root: {
    height: '100vh'
  },
  rootContainer: {
    position: 'relative',
    height: '100%',
  },
  authContainer: {
    maxWidth: 500,
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 40,
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
      width: 'calc(100vw - 32px)',
      padding: 8
    }
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

});

class AuthLayout extends React.Component {
  constructor(props) {
    super(props);

    console.debug('Construct AuthLayout.js')
  };

  render() {
    const { classes } = this.props;

    console.debug('%c Render AuthLayout.js', 'background-color: grey; padding: 6px 12px; border-radius: 5px; color: white;');

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
            <Grid container item xs={12} className={classes.authContainer}>
              {this.props.children}
            </Grid>
          </Grid>

          <Suspense fallback={<></>}>
            <Intercom appID={"k7gprnv3"} />
          </Suspense>
        </main>
      </div>
    );
  }
}

export default withStyles(styles)(AuthLayout);
