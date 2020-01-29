import React from 'react';
import Button from '@material-ui/core/Button';
import { Redirect } from 'react-router-dom';
import { withStyles, Typography } from '@material-ui/core';
import { inject, observer } from "mobx-react";
import { FormattedMessage } from 'react-intl';

import PopupLayout from './PopupLayout';
import { getBaseUrl } from '../../../services/utils.service';
import profileService from '../../../services/profile.service';

const styles = theme => ({
  picture: {
    position: 'relative',
    left: '50%',
    transform: 'translateX(-50%)',
  },
  text: {
    margin: 0,
    padding: 0,
    textAlign: 'center'
  },
  title: {
    textAlign: 'center',
    [theme.breakpoints.down('sm')]: {
      fontSize: '4.8rem',
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: '3rem',
    }
  }
});

class OnboardCongratulation extends React.Component {
  state = {
    open: this.props.isOpen,
    redirectTo: null,
  };

  componentWillReceiveProps(nextProps) {
    this.setState({ open: nextProps.isOpen })
  }

  handleOnboardEnd = () => {
    this.setState({ redirectTo: getBaseUrl(this.props) }); 
  }

  render() {
    const { redirectTo } = this.state;
    const { classes } = this.props;
    const { currentOrganisation} = this.props.orgStore;

    if (redirectTo && window.location.pathname !== redirectTo) return (<Redirect push to={redirectTo} />);

    return (
      <PopupLayout
        isOpen={this.state.open}
        title={
          <>
            <img src={profileService.getEmojiUrl('🥳')} alt="Congratulation!" className={classes.picture} />
            <Typography variant="h1" className={classes.title}>
              <FormattedMessage id="onboard.end.title" />
            </Typography>
          </>
        }
        actions={
          <Button onClick={this.handleOnboardEnd} color="secondary" variant="contained">
            <FormattedMessage id="onboard.end.cta" values={{ organisationName: currentOrganisation.name }} />
          </Button>
        }
        onClose={this.handleOnboardEnd}
      >
        <Typography variant="h6" className={classes.text}>
          <FormattedMessage id="onboard.end.text" values={{ organisationName: currentOrganisation.name }} />
        </Typography>
      </PopupLayout>
    );
  }
}

export default inject('commonStore', 'orgStore')(
  observer(
    withStyles(styles, { withTheme: true })(OnboardCongratulation)
  )
);