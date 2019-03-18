import React from 'react'
import {FormattedMessage} from 'react-intl';
import {inject, observer} from 'mobx-react';

import {Button, Grid, Typography, withStyles, Hidden} from "@material-ui/core";
import Banner from '../../components/utils/banner/Banner';
import Header from '../../components/header/Header';
import Logo from '../../components/utils/logo/Logo';
import UrlService from '../../services/url.service';

const styles = (theme) => ({
  logo: {
    width: 110,
    height: 110,
    boxShadow: '0 5px 15px -1px darkgrey, 0 0 0 5px transparent',
    bottom: 60,
    zIndex: 2,
    marginBottom: -50,
    [theme.breakpoints.down('xs')]: {
      marginBottom: -56,
    }
  },
  container: {
    [theme.breakpoints.down('xs')]: {
      padding: 8,
    }
  },
  intro: {
    textAlign: 'center',
    padding: 8,
    [theme.breakpoints.down(400)]: {
      padding: 5,
    }
  },
  title: {
    textAlign: 'center',
    paddingTop: 16,
    paddingBottom:16,
    [theme.breakpoints.down(400)]: {
      padding: 5,
    }
  },
  form: {
    width: '100%',
  },
  term: {
    [theme.breakpoints.down('md')]: {
      justifyContent: 'end',
      padding: '8px 16px',
    }
  },
  protectingData: {
    [theme.breakpoints.down('md')]: {
      justifyContent: 'flex-end',
      padding: '8px 16px',
    }
  },
  banner: {
    position: 'absolute',
    top: 64,
    width: '100%',
    textAlign: 'center',
    left: 0,
    height: 166,
    lineHeight: 166,
    [theme.breakpoints.up('md')]: {
      height: 350,
      lineHeight: '350px',
    }, 
    background: 'radial-gradient(rgba(50,50,50,.4), rgba(50,50,50,.1))',
    backgroundRepeat: 'no-repeat',
    '& h2': {
      position:'absolute',
      top: '50%',
      left:0,
      right:0,
      margin: 'auto',
      transform: 'translateY(-50%)',
      color: 'white',
      fontWeight: 600,
    }
  }
});

class OnboardWelcome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const {organisation} = this.props.organisationStore.values;
    const {classes} = this.props;

    return (
      <Grid container direction={"column"} justify={"space-around"}>
      <Grid container item>
        <Header/>
      </Grid>
      <Grid container item alignItems={"stretch"}>
        <Banner />
        <Hidden smDown>
          <div className={classes.banner}>
            <Typography variant="h2" ><FormattedMessage id={'onboard.welcome'}/> {organisation.name}</Typography>
          </div>
        </Hidden>
      </Grid>
      <Grid container item justify={"center"}>
        <Logo type={"organisation"} alt="org-logo" className={classes.logo}/>
      </Grid>
      <Grid container item justify={"center"} className={classes.container}>
        <form onSubmit={this.handleSubmitForm} className={classes.form}>
          <Grid item container direction={'column'} xs={12} sm={6} lg={4} spacing={16}>
            <Hidden mdUp>
              <Typography variant="h2" className={classes.intro}>Welcome to the Wings of {organisation.name}</Typography>
            </Hidden>
            <Grid item>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit 
            in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt 
            mollit anim id est laborum
            </Grid>
            <Grid item>
              <Button onClick={this.props.handleEnterToOnboard} fullWidth color="primary" ><FormattedMessage id={'onboard.start'}/></Button>
            </Grid>
            <Grid item container direction="row" justify='space-around' >
              <Grid item lg={6}>
                <Button  className={classes.term} variant="text" fullWidth={true} component="a" target="_blank" href={UrlService.createUrl(process.env.REACT_APP_HOST_BACKFLIP, '/terms', undefined)}>
                  <FormattedMessage id="menu.drawer.terms" />
                </Button>
              </Grid>
              <Grid item lg={6}>
                <Button className={classes.protectingData} variant="text" fullWidth={true}  component="a" target="_blank" href={UrlService.createUrl(process.env.REACT_APP_HOST_BACKFLIP, '/protectingYourData', undefined)}>
                  <FormattedMessage id="menu.drawer.protectingYourData" style={{justifyContent: 'flex-end!important'}}/>
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </Grid>
    </Grid>
    );
  }
}

export default inject('commonStore', 'organisationStore')(
  observer(
    withStyles(styles)(OnboardWelcome)
  )
);
