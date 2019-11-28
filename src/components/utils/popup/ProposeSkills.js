import React from 'react';
import Button from '@material-ui/core/Button';
import { Redirect } from 'react-router-dom';
import { withStyles, Typography, Hidden, CircularProgress } from '@material-ui/core';
import { inject, observer } from "mobx-react";
import { FormattedMessage } from 'react-intl';
import { Add, Search } from '@material-ui/icons';
import ReactGA from 'react-ga';

import Wings from '../wing/Wing';
import ProfileService from '../../../services/profile.service';
import SlackService from '../../../services/slack.service';
import PopupLayout from './PopupLayout';
import { getBaseUrl } from '../../../services/utils.service';

ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS_ID);

const styles = theme => ({

  text: {
    margin: 0,
    padding: 0,
    paddingTop: 16,
    textAlign: 'center'
  },
  titleEmoji: {
    marginLeft: 16
  },
  title: {
    marginTop: -8,
    marginBottom: -8,
    textAlign: 'center',
    [theme.breakpoints.down('sm')]: {
      fontSize: '4.8rem',
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: '3rem',
    }
  },
  actions: {
    margin: 0,
    padding: 8,
    display: 'block'
  },
  buttons: {
    height: 'unset',
    margin: 8,
  }
});

class ProposeSkills extends React.Component {
  state = {
    open: this.props.isOpen,
  };

  componentWillReceiveProps(nextProps) {
    if(this.state.open !== nextProps.isOpen)
      this.setState({open: nextProps.isOpen});
  }

  handleClose = () => this.setState({ open: false });

  render() {
    const { classes } = this.props;

    return (
      <PopupLayout
        isOpen={this.state.open}
        title={
          <Typography variant="h1" className={classes.title}>
            <FormattedMessage id="onboard.end.title" />
            <Hidden xsDown>
              <img src={ProfileService.getEmojiUrl('🎉')} alt="congratulation" className={classes.titleEmoji} />
            </Hidden>
          </Typography>
        }
        actions={
          <div className={classes.actions}>
            <Button onClick={() => {}} color="secondary" variant="contained" size="medium" className={classes.buttons} >
              <Add />
              <FormattedMessage id="action.addWings.add" />
            </Button>
            <Hidden smUp>
              <br /><br />
            </Hidden>
            <Button onClick={() => {}} color="secondary" variant="contained" size="medium" className={classes.buttons}  >
              <Search />
            </Button>
          </div>
        }
        onClose={this.handleClose}
        style={this.props.style}
      >
        <Typography variant="h6" className={classes.text}>
          <br />
          <div className={classes.wingsList}>
          </div>
        </Typography>
      </PopupLayout>
    );
  }
}

export default inject('commonStore', 'orgStore', 'recordStore')(
  observer(
    withStyles(styles, { withTheme: true })(ProposeSkills)
  )
);