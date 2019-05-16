import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import {IconButton, Typography, withStyles, Grid} from "@material-ui/core";
import DialogContent from '@material-ui/core/DialogContent';
import Slide from '@material-ui/core/Slide';
import classNames from 'classnames';
import {styles} from '../../header/Header.css.js';
import Icon from "@material-ui/core/Icon";
import {FormattedMessage} from "react-intl";
import {Clear, InfoRounded, FileCopy} from "@material-ui/icons";
import {inject, observer} from "mobx-react";
import {injectIntl} from 'react-intl';


function Transition(props) {
  return <Slide direction="right" {...props} />;
}

class Invitation extends React.Component {
  state = {
    open: false,
    invitationCode: null,
    errorMessage: null
  };

  componentDidMount() {
    var orgId = this.props.organisationStore.values.organisation._id;
    if(orgId)
      this.props.authStore.getInvitationCode(orgId)
      .then(invitationCode => {
        this.setState({invitationCode: invitationCode.code});
      }).catch(e => {
        console.error(e);
        this.setState({errorMessage: this.props.intl.formatMessage({ id: 'invitation.get.error' })})
      });
  }

  formatInvitationLink = (code) => {
    var locale = this.props.commonStore.locale;
    var orgTag = this.props.organisationStore.values.organisation.tag;
    var security = (process.env.NODE_ENV === 'development' ? 'http://' : 'https://');
    return security + process.env.REACT_APP_HOST + '/' + locale + '/' + orgTag + '/signin/' + code;
  }

  copyUrl = () => {
    let copyText = document.getElementById("urlInvitation");
    copyText.select();
    document.execCommand("copy");
  }
  
  handleClickOpen = () => {
    this.setState({open: true});
  };
  
  handleClose = () => {
    this.setState({open: false});
  };
  
  render() {
    const {classes} = this.props;
    const {invitationCode, errorMessage} = this.state;

    const invitationCodeLink = this.formatInvitationLink(invitationCode);

    return (
      <React.Fragment>
        <Button className={classes.invitationBtn} onClick={this.handleClickOpen}>
          <FormattedMessage id={'menu.drawer.invitation'}/>
          <Icon
            className={classNames(classes.invitationIcon, 'fa fa-plus')}
            fontSize="inherit"
          />
        </Button>
        <Dialog
          open={this.state.open}
          TransitionComponent={Transition}
          keepMounted
          onClose={this.handleClose}
          classes={{paper: classes.invitationPaper}}
        >
          <Grid container direction={'row'} justify={'space-between'}>
            <Grid item>
              <Typography variant="h4" className={classes.invitationTitle}>
                <FormattedMessage id={'menu.drawer.invitation'}/>
              </Typography>
            </Grid>
            <Grid item>
              <IconButton aria-label="Close" onClick={this.handleClose} style={{marginLeft: -10, marginBottom: 10, marginTop: -10}}>
                <Clear fontSize="small"/>
              </IconButton>
            </Grid>
          </Grid>
          <DialogContent classes={{root: classes.invitationContent}}>
            <Typography variant="body1" style={{color: 'black'}}>
              <FormattedMessage id={'menu.drawer.invitation.description'}/>
            </Typography>
            <Grid container direction={'row'} justify={'space-between'} style={{marginTop: 8}}>
              <Grid item xs={10}>
                <input type="text" value={errorMessage || invitationCodeLink} className={classes.invitationInput} readOnly={true} id={'urlInvitation'}/>
              </Grid>
              <Grid item xs={2}>
                <Button className={classes.invitationCopyBtn} aria-label='copy' onClick={this.copyUrl}>
                  <Typography style={{color: 'white'}}>
                    <FileCopy fontSize={'small'} fontWeight={'700'}/>
                  </Typography>
                </Button>
              </Grid>
            </Grid>
            <Grid container style={{marginTop: 16}}>
              <InfoRounded style={{fontSize: '1.5rem', position: 'fixed', color: '#3276D2'}}/>
              <Typography variant="body1" style={{marginLeft: 25, fontWeight: '400', color: 'black'}}>
                <FormattedMessage id={'menu.drawer.invitation.infoUrl'}/>
              </Typography>
            </Grid>
          </DialogContent>
        </Dialog>
      </React.Fragment>
    );
  }
}

export default inject('organisationStore', 'authStore', 'commonStore')(
  injectIntl(observer(
    withStyles(styles, { withTheme: true })(Invitation)
  ))
);