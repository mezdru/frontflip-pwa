import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
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

class AddWingPopup extends React.Component {
  state = {
    open: this.props.isOpen,
    redirectTo: null,
  };

  componentWillReceiveProps(nextProps) {
    this.setState({open: nextProps.isOpen})
  }

  handleClose = () => {
      this.setState({open: false});
  }

  recordHasHashtag = (tag) => {
    let resp =  (this.props.recordStore.values.record.hashtags.find(hashtag => hashtag.tag === tag) ? true: false);
    console.log(resp)
    return resp;
  }

  async asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }

  handleAddWing = async () => {
    let record = this.props.recordStore.values.record;
    this.props.recordStore.setOrgId(this.props.organisationStore.values.organisation._id);

    await this.asyncForEach(this.props.wingsToAdd, async (wing) => {
      if(!this.recordHasHashtag('#' + wing)) {
        this.props.recordStore.setRecordTag('#' + wing);
        await this.props.recordStore.getRecordByTag()
        .then((hashtagToAdd => {
          record.hashtags.push(hashtagToAdd);
        })).catch(e => {});
      }
    });

    await this.props.recordStore.updateRecord(['hashtags']);
    this.setState({ redirectTo: '/' + this.props.commonStore.locale + '/' + this.props.organisationStore.values.orgTag + '/' + this.props.recordStore.values.record.tag });
  }

  render() {
    const {redirectTo} = this.state;
    const {classes, wingsToAdd} = this.props;

    if (redirectTo && window.location.pathname !== redirectTo) return (<Redirect to={redirectTo} />);

    return (
      <React.Fragment>
        <Dialog
          open={this.state.open}
          TransitionComponent={Transition}
          keepMounted
          fullWidth
          maxWidth={'sm'}
          onClose={this.handleClose}
          className={classes.root}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogContent style={{overflow: 'hidden'}} >
            <img src={ColleagueImg} alt="Colleagues" className={classes.picture} />
            <Typography variant="h1" className={classes.title}>
              <FormattedMessage id="onboard.end.title" />
              <Hidden xsDown>
                <img src={ProfileService.getEmojiUrl('🎉')} alt="congratulation" className={classes.titleEmoji}/>
              </Hidden>
            </Typography>
            <DialogContentText id="alert-dialog-slide-description">
              <Typography variant="h6" className={classes.text}>
                <FormattedMessage id="onboard.end.text" values={{organisationName: this.props.organisationStore.values.organisation.name}} />
              </Typography>
            </DialogContentText>
          </DialogContent>
          <DialogActions className={classes.actions}>
            <Button onClick={this.handleAddWing} color="secondary">
              Add {wingsToAdd}
            </Button>
            <Button onClick={this.handleClose} color="secondary">
              Search {wingsToAdd}
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }
}

export default inject('commonStore', 'organisationStore', 'recordStore')(
  observer(
    withStyles(styles, { withTheme: true })(AddWingPopup)
  )
);