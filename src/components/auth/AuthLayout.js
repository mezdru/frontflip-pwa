import React, {Suspense} from 'react';
import { Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Logo from '../utils/logo/Logo';
import Banner from '../utils/banner/Banner';
import Header from '../header/Header';

const Intercom = React.lazy(() => import('react-intercom'));

const styles = (theme) => ({
  logo: {
    width: '6.6rem',
    height: '6.6rem',
    boxShadow: '0 5px 15px -1px darkgrey, 0 0 0 5px transparent',
    bottom: '3.2rem',
    marginBottom: '-7rem',
    zIndex: 2,
    border: '4px solid white'
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
        <main>
          <Grid container direction={"column"} justify={"space-around"} alignItems={"center"}>
            <Grid container item alignItems={"stretch"}>
              <Banner />
            </Grid>
            <Grid item container justify={"center"}>
              <Logo type={'organisation'} alt="org-logo" className={classes.logo} />
            </Grid>
            <Grid container item xs={12} sm={6} lg={4}>
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

export default withStyles(styles)(Auth);
