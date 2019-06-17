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
import { Add, Search } from '@material-ui/icons';
import ReactGA from 'react-ga';

import Wings from '../wing/Wing';
import ProfileService from '../../../services/profile.service';
import SlackService from '../../../services/slack.service';

ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS_ID);

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
    margin: 0,
    padding: 16,
    display: 'block'
  },
  buttons: {
    height: 'unset',
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
    ReactGA.event({category: 'User', action: 'QRCode - Search'});
    SlackService.notify('#wingzy-events', 'QRCode - Search - '+
                                          (this.state.wingsPopulated[0] ? this.state.wingsPopulated[0].tag : '')+
                                          ' - by '+this.props.recordStore.values.record.name);
    this.setState({open: false, redirectTo: '/' + this.props.commonStore.locale + '/' + this.props.organisationStore.values.orgTag});
  }

  componentDidMount() {
    this.populateWingsToAdd();
  }

  populateWingsToAdd = async () => {
    let wingsPopulated = [];
    this.props.recordStore.setOrgId(this.props.organisationStore.values.organisation._id);

    await this.asyncForEach(this.props.wingsToAdd, async (wing) => {
        this.props.recordStore.setRecordTag('#' + wing);
        await this.props.recordStore.getRecordByTag()
        .then((hashtagToAdd => {
          wingsPopulated.push(hashtagToAdd);
        })).catch(e => {console.log(e)});
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
    ReactGA.event({category: 'User', action: 'QRCode - Add Wings'});
    SlackService.notify('#wingzy-events', 'QRCode - Add Wings - '+
                                          (this.state.wingsPopulated[0] ? this.state.wingsPopulated[0].tag : '')+
                                          ' - by '+this.props.recordStore.values.record.name);    let record = this.props.recordStore.values.record;
    let wingsToAdd = [];
    this.state.wingsPopulated.forEach(wing => {
      if(!this.recordHasHashtag(wing.tag)) {
        wingsToAdd.push(wing);
      }
    })
    record.hashtags = record.hashtags.concat(wingsToAdd);
    await this.props.recordStore.updateRecord(['hashtags']);
    this.setState({ redirectTo: '/' + this.props.commonStore.locale + '/' + this.props.organisationStore.values.orgTag + '/' + this.props.recordStore.values.record.tag });
  }

  render() {
    const {redirectTo, wingsPopulated} = this.state;
    const {classes} = this.props;
    const {organisation} = this.props.organisationStore.values;
    const {locale} = this.props.commonStore;

    if (redirectTo && window.location.pathname !== redirectTo) return (<Redirect push to={redirectTo} />);

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
            <Typography variant="h1" className={classes.title}>
              <FormattedMessage id="onboard.end.title" />
              <Hidden xsDown>
                <img src={ProfileService.getEmojiUrl('🎉')} alt="congratulation" className={classes.titleEmoji}/>
              </Hidden>
            </Typography>
            <DialogContentText id="alert-dialog-slide-description" className={classes.content}>
              <Typography variant="h6" className={classes.text}>
                <FormattedMessage id="action.addWings.text" values={{wingsCount: wingsPopulated.length}} />
                <br/>
                <div className={classes.wingsList}>
                {wingsPopulated.map( (wing, i) => {
                  let displayedName = (wing.name_translated ? (wing.name_translated[locale] || wing.name_translated['en-UK']) || wing.name || wing.tag : wing.name || wing.tag)
                  return(
                  <Wings src={ProfileService.getPicturePath(wing.picture)} key={i}
                    label={ProfileService.htmlDecode(displayedName)}
                    className={'bigWing'}
                    />);
                })}
                </div>
              </Typography>
            </DialogContentText>
          </DialogContent>
          <DialogActions className={classes.actions}>
            <Button onClick={this.handleAddWing} color="secondary" variant="contained" size="medium" className={classes.buttons} >
                <Add />
                <FormattedMessage id="action.addWings.add" />
            </Button>
            <Hidden smUp>
                <br/><br/>
            </Hidden>
            <Button onClick={this.handleClose} color="secondary" variant="contained"  size="medium" className={classes.buttons}  >
                <Search />
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