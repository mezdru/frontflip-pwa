import React from 'react';
import {Grid} from '@material-ui/core';
import { withStyles} from '@material-ui/core/styles';
import ReactGA from 'react-ga';
import Logo from '../utils/logo/Logo';
import Banner from '../utils/banner/Banner';
import Header from '../header/Header';
ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS_ID);


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
    const {classes} = this.props;

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
        </main>
      </div>
    );
  }
}

export default withStyles(styles)(Auth);
