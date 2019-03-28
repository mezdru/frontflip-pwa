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

import Wings from '../wing/Wing';
import PeopleWingsImg from '../../../resources/images/people_with_wings.png';
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
    marginBottom: 32,
  },
  text: {
    margin: 0,
    padding:0,
    paddingTop: 16,
    textAlign: 'center'
  },
  content: {
    padding: 0,
  },
  titleEmoji: {
    marginLeft: 16
  },
  title: {
    marginTop: -8,
    marginBottom: -8,
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
    padding: 16,
  }
});

class AddWingPopup extends React.Component {
  state = {
    open: this.props.isOpen,
    redirectTo: null,
    wingsPopulated: [],
    locale: this.props.commonStore.getCookie('locale') || this.props.commonStore.locale
  };

  componentWillReceiveProps(nextProps) {
    this.setState({open: nextProps.isOpen})
  }

  handleClose = () => {
      this.setState({open: false});
  }

  componentDidMount() {
    this.populateWingsToAdd();
  }

  populateWingsToAdd = async () => {
    console.log(this.props.wingsToAdd)
    console.log('e')
    let wingsPopulated = [];
    this.props.recordStore.setOrgId(this.props.organisationStore.values.organisation._id);

    await this.asyncForEach(this.props.wingsToAdd, async (wing) => {
      console.log(wing)
      if(!this.recordHasHashtag('#' + wing)) {
        this.props.recordStore.setRecordTag('#' + wing);
        await this.props.recordStore.getRecordByTag()
        .then((hashtagToAdd => {
          console.log(hashtagToAdd)
          wingsPopulated.push(hashtagToAdd);
        })).catch(e => {console.log(e)});
      }
    });

    this.setState({wingsPopulated: wingsPopulated});
  }

  recordHasHashtag = (tag) => {
    let resp =  (this.props.recordStore.values.record.hashtags.find(hashtag => hashtag.tag === tag) ? true: false);
    return resp;
  }

  async asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }

  handleAddWing = async () => {
    let record = this.props.recordStore.values.record;
    record.hashtags.concat(this.state.wingsPopulated);
    await this.props.recordStore.updateRecord(['hashtags']);
    this.setState({ redirectTo: '/' + this.props.commonStore.locale + '/' + this.props.organisationStore.values.orgTag + '/' + this.props.recordStore.values.record.tag });
  }

  render() {
    const {redirectTo, wingsPopulated} = this.state;
    const {classes, wingsToAdd} = this.props;
    const {organisation} = this.props.organisationStore.values;

    if (redirectTo && window.location.pathname !== redirectTo) return (<Redirect to={redirectTo} />);

    console.log(wingsPopulated)
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
          <DialogContent style={{overflow: 'hidden', padding: 16}} >
            <img src={PeopleWingsImg} alt="People with Wings" className={classes.picture} />
            <Typography variant="h1" className={classes.title}>
              <FormattedMessage id="onboard.end.title" />
              <Hidden xsDown>
                <img src={ProfileService.getEmojiUrl('🎉')} alt="congratulation" className={classes.titleEmoji}/>
              </Hidden>
            </Typography>
            <DialogContentText id="alert-dialog-slide-description" className={classes.content}>
              <Typography variant="h6" className={classes.text}>
                <FormattedMessage id="action.addWings.text" />
                <br/>
                {wingsPopulated.map( (wing, i) => {
                  let displayedName = (wing.name_translated ? (wing.name_translated[this.state.locale] || wing.name_translated['en-UK']) || wing.name || wing.tag : wing.name || wing.tag)
                  return(
                  <Wings src={ProfileService.getPicturePath(wing.picture)} key={i}
                    label={ProfileService.htmlDecode(displayedName)}
                    />);
                })}
              </Typography>
            </DialogContentText>
          </DialogContent>
          <DialogActions className={classes.actions}>
            <Button onClick={this.handleAddWing} color="secondary">
              <FormattedMessage id="action.addWings.add" />
            </Button>
            <Button onClick={this.handleClose} color="secondary">
            <FormattedMessage id="action.addWings.search" values={{organisationName: organisation.name}}/>
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