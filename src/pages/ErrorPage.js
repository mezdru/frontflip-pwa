import React from 'react'
import { Grid, withStyles, Typography } from '@material-ui/core';
import Banner from '../components/utils/banner/Banner';
import Card from '../components/card/CardProfile';
import { inject, observer } from "mobx-react";
import Header from '../components/header/Header';
import { Redirect } from "react-router-dom";
import { FormattedHTMLMessage } from 'react-intl';
import ProfileService from '../services/profile.service';

const styles = theme =>  ({
  layout: {
    height: 'calc(100vh - 72px)',
    flexGrow: 1
  },
  title: {
    fontSize: '4rem'
  },
  subLayout: {
    height: 'auto'
  }
});

class ErrorPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      locale: this.props.commonStore.getCookie('locale') || this.props.commonStore.locale,
      errorCode: null,
      errorType: null,
    };
  }

  componentDidMount() {
    if(this.props.match && this.props.match.params) {
      this.setState({errorCode: this.props.match.params.errorCode, errorType: this.props.match.params.errorType});
    }
  }

  render() {
    const {classes} = this.props;
    const { errorCode, errorType} = this.state;
    const {currentUser} = this.props.userStore.values;

    return (
      <div>
        <Header />
        <main>
          <Grid container className={classes.layout} alignItems={'center'} justify={'center'}>
            <Grid item xs={12} md={6}>
              <Grid
                container
                spacing={16}
                className={classes.subLayout}
                alignItems={'center'}
                direction={'column'}
                justify={'center'}
              >
                <Grid item>
                  <img className={classes.bigPicture} src={ProfileService.getEmojiUrl('🧰')} />
                </Grid>
                <Grid item>
                  <Typography variant={'h1'} className={classes.title}>{errorCode} Oops</Typography>
                </Grid>
                <Grid item>
                  {errorType === 'email' && (
                    <Typography variant={'subheading'}>
                      <FormattedHTMLMessage id="errorPage.emailNotValidated" values={{email: currentUser.email.value}} />
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </main>
      </div>
    );
  }
}

export default inject('commonStore', 'organisationStore', 'authStore', 'recordStore', 'userStore')(
  observer(
    withStyles(styles, {withTheme: true})(ErrorPage)
  )
);
