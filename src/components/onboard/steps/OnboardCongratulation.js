import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Slide from '@material-ui/core/Slide';
import { Redirect } from 'react-router-dom';
import { withStyles, Typography, Hidden } from '@material-ui/core';
import { inject, observer } from "mobx-react";
import { FormattedMessage } from 'react-intl';

import ColleagueImg from '../../../resources/images/colleagues.png';
import ProfileService from '../../../services/profile.service';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

const styles = theme => ({
  root: {
    textAlign: 'center',
  },
  picture: {
    width: '60%',
    height: 'auto',
    marginBottom: 40,
  },
  text: {
    margin: 0,
    padding:0,
    paddingTop: 16,
    textAlign: 'center'
  },
  titleEmoji: {
    marginLeft: 16
  },
  title: {
    textAlign: 'center',
    [theme.breakpoints.down('sm')] : {
      fontSize: '4.8rem',
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: '3rem',
    }
  },
  actions: {
    justifyContent: 'center', 
    margin: 0,
    padding: 24,
  }
});

class OnboardCongratulation extends React.Component {
  state = {
    open: this.props.isOpen,
    redirectTo: null,
  };

  componentWillReceiveProps(nextProps) {
    this.setState({open: nextProps.isOpen})
  }

  handleOnboardEnd = () => {
      this.setState({ redirectTo: '/' + this.props.commonStore.locale + '/' + this.props.organisationStore.values.orgTag });
  }

  render() {
    const {redirectTo} = this.state;
    const {classes} = this.props;

    if (redirectTo && window.location.pathname !== redirectTo) return (<Redirect to={redirectTo} />);

    return (
      <React.Fragment>
        <Dialog
          open={this.state.open}
          TransitionComponent={Transition}
          keepMounted
          fullWidth
          maxWidth={'sm'}
          onClose={this.handleOnboardEnd}
          className={classes.root}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogContent style={{overflow: 'hidden'}} >
            <img src={ColleagueImg} alt="Colleagues" className={classes.picture} />
            <Typography variant="h1" className={classes.title}>
              <FormattedMessage id="onboard.end.title" />
            </Typography>
            <DialogContentText id="alert-dialog-slide-description">
              <Typography variant="h6" className={classes.text}>
                <FormattedMessage id="onboard.end.text" values={{organisationName: this.props.organisationStore.values.organisation.name}} />
              </Typography>
            </DialogContentText>
          </DialogContent>
          <DialogActions className={classes.actions}>
            <Button onClick={this.handleOnboardEnd} color="secondary">
              <FormattedMessage id="onboard.end.cta" values={{organisationName: this.props.organisationStore.values.organisation.name}} />
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }
}

export default inject('commonStore', 'organisationStore')(
  observer(
    withStyles(styles, { withTheme: true })(OnboardCongratulation)
  )
);