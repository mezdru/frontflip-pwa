import React from 'react'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import { inject, observer } from 'mobx-react';

import { Button, Grid, Typography, withStyles } from "@material-ui/core";
import UrlService from '../../services/url.service';

const Entities = require('html-entities').XmlEntities;
const entities = new Entities();

const styles = (theme) => ({
  root: {
    padding: 24,
    backgroundColor: 'white',
    borderRadius: 5,
    width: 'auto',
    [theme.breakpoints.down('xs')]: {
      margin: 16,
      marginTop: 80
    }
  },
  logo: {
    width: 110,
    height: 110,
    boxShadow: '0 5px 15px -1px darkgrey, 0 0 0 5px transparent',
    zIndex: 2,
    transform: 'translateY(-50%)',
    marginBottom: -47,
  },
  container: {
    // backgroundColor: 'white',
    borderRadius: 4,
    overflow: 'hidden',
    boxShadow: '0px 1px 5px 0px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 3px 1px -2px rgba(0,0,0,0.12)',
    // overflowY: 'auto',
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
    paddingBottom: 24,
    paddingTop: 8,
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
    top: 0,
    width: '100%',
    textAlign: 'center',
    left: 0,
    height: 222,
    lineHeight: 222,
    [theme.breakpoints.up('md')]: {
      height: 416,
      lineHeight: 416,
    },
    background: 'radial-gradient(rgba(50,50,50,.4), rgba(50,50,50,.1))',
    backgroundRepeat: 'no-repeat',
    '& h2': {
      position: 'absolute',
      top: '50%',
      left: 0,
      right: 0,
      margin: 'auto',
      transform: 'translateY(-50%)',
      color: 'white',
      fontWeight: 600,
    }
  }
});

class OnboardWelcome extends React.Component {

  render() {
    const { currentOrganisation } = this.props.orgStore;
    const { locale } = this.props.commonStore;
    const { classes } = this.props;

    return (
      <Grid item xs={12} sm={8} md={6} lg={6} className={classes.container}>
      <form onSubmit={this.props.handleEnterToOnboard}>
        <Grid item container direction={'column'} xs={12} spacing={2} className={classes.root}>
          <Typography variant="h2" className={classes.title} >
            <FormattedMessage id={'onboard.welcome'} /> {entities.decode(currentOrganisation.name)}
          </Typography>
          <Grid item>
            {(currentOrganisation.onboardWelcome && currentOrganisation.onboardWelcome[locale]) ? (
              <span dangerouslySetInnerHTML={{ __html: currentOrganisation.onboardWelcome[locale]}}></span>
            ) : (
              <FormattedHTMLMessage id="onboard.welcome.text" values={{ organisationName: entities.decode(currentOrganisation.name) }} />
            )}
          </Grid>
          <Grid item>
            <Button onClick={this.props.handleEnterToOnboard} fullWidth color="secondary" ><FormattedMessage id={'onboard.start'} /></Button>
          </Grid>
          <Grid item container direction="row" justify='space-around' >
            <Grid item lg={6}>
              <Button className={classes.term} variant="text" fullWidth={true} component="a" target="_blank" href={UrlService.createUrl(process.env.REACT_APP_HOST_BACKFLIP, '/terms', undefined)}>
                <FormattedMessage id="menu.drawer.terms" />
              </Button>
            </Grid>
            <Grid item lg={6}>
              <Button className={classes.protectingData} variant="text" fullWidth={true} component="a" target="_blank" href={UrlService.createUrl(process.env.REACT_APP_HOST_BACKFLIP, '/protectingYourData', undefined)}>
                <FormattedMessage id="menu.drawer.protectingYourData" style={{ justifyContent: 'flex-end!important' }} />
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </form>
      </Grid>
    );
  }
}

export default inject('commonStore', 'orgStore')(
  observer(
    withStyles(styles)(OnboardWelcome)
  )
);
