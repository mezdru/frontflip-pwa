import React from 'react';
import {inject, observer} from 'mobx-react';
import {FormattedMessage, injectIntl} from 'react-intl';
import {Redirect} from 'react-router-dom';
import classNames from 'classnames';
import {Button, Grid, IconButton, Typography, withStyles} from '@material-ui/core';
import {Clear} from '@material-ui/icons';
import '../../resources/stylesheets/font-awesome.min.css';
import './ContactsColors.css';
import {styles} from './ProfileLayout.css';
import defaultHashtagPicture from '../../resources/images/placeholder_hashtag.png';
import defaultPicture from '../../resources/images/placeholder_person.png';
import Banner from '../../components/utils/banner/Banner';
import Logo from '../../components/utils/logo/Logo';
import MenuButton from './menuButton'
import Wings from '../utils/wing/Wing';
import UrlService from '../../services/url.service';
import ProfileService from '../../services/profile.service';

class ProfileLayout extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      canEdit: false,
      record: null,
      displayIn: true,
    }
  }
  
  canEdit = (workingRecord) => {
    if (!(this.props.userStore.values.currentUser && this.props.userStore.values.currentUser._id)) return false;
    if (this.props.userStore.values.currentUser.superadmin) return true;
    else if (this.props.userStore.values.currentUser.orgsAndRecords.find(orgAndRecord => orgAndRecord.record === workingRecord.objectID)) return true;
    else return false;
  }
  
  componentDidMount() {
    if (!this.props.hit) return;
    if (!this.props.authStore.isAuth()) return;
    this.props.recordStore.setRecordTag(this.props.hit.tag);
    this.props.recordStore.setOrgId(this.props.organisationStore.values.organisation._id);
    this.props.recordStore.getRecordByTag()
      .then((record) => {
        record.objectID = record._id;
        this.setState({record: record, canEdit: this.canEdit(record)});
      }).catch(() => {
      return;
    })
  };
  
  handleReturnToSearch = (e, element) => {
    this.setState({displayIn: false}, () => {
      if (!element) {
        setTimeout(function () {
          this.props.handleReturnToSearch();
        }.bind(this), 600);
      } else {
        this.props.addToFilters(e, element, true);
      }
    });
  }
  
  render() {
    const {hit, className, classes, theme} = this.props;
    const {canEdit, record, displayIn} = this.state;
    const {locale} = this.props.commonStore;
    const orgTag = this.props.organisationStore.values.organisation.tag;
    let rootUrl = '/' + locale + (orgTag ? '/' + orgTag : '');
    
    const currentHit = record || hit;
    ProfileService.transformLinks(currentHit);
    ProfileService.makeHightlighted(currentHit);
    ProfileService.orderHashtags(currentHit);
    
    if (!currentHit) return (<div></div>);
    
    return (
      <Grid container className={(displayIn ? className : classes.profileContainerHide)}>
        {(window.location.pathname !== rootUrl + '/' + hit.tag) && (
          <Redirect to={rootUrl + '/' + hit.tag}/>
        )}
        <Grid container item alignItems={"stretch"}>
          <Banner source={(currentHit && currentHit.cover && currentHit.cover.url) ? currentHit.cover.url : null}>
            <IconButton aria-label="Edit" className={classes.returnButton} onClick={this.handleReturnToSearch}>
              <Clear fontSize="large" className={classes.returnButtonSize}/>
            </IconButton>
            {canEdit && (
              <MenuButton urlUpdateCover={UrlService.createUrl(process.env.REACT_APP_HOST_BACKFLIP, '/cover/id/' + currentHit.objectID, orgTag)}
                          urlEditIntro={UrlService.createUrl(process.env.REACT_APP_HOST_BACKFLIP, '/onboard/intro', orgTag, 'recordId=' + currentHit.objectID)}
                          urlEditAboutMe={UrlService.createUrl(process.env.REACT_APP_HOST_BACKFLIP, '/about/id/' + currentHit.objectID, orgTag)}
                          urlDeleteProfile={UrlService.createUrl(process.env.REACT_APP_HOST_BACKFLIP, '/admin/record/delete/' + currentHit.objectID, orgTag)}
              />
            )}
          </Banner>
        </Grid>
        <Grid item xs={12} sm={6} lg={3} className={classes.generalPart}>
          <Grid item>
            <Logo type={'person'} className={classes.logo} src={ProfileService.getPicturePath(currentHit.picture, 'person', '170x170') || defaultPicture}/>
            <div className={classes.subheader}>
              <Typography variant="h4" className={classes.name}>
                {ProfileService.htmlDecode(currentHit.name) || currentHit.tag}
              </Typography>
              <Typography variant="subheading" className={classes.name}>
                {ProfileService.htmlDecode(currentHit.intro || '')}
              </Typography>
            </div>
          </Grid>
          {currentHit.links.map((link, i) => {
            if(!link.value || link.value === '') return null;
            return (
              <Grid item key={link._id} xs={12} style={{position: 'relative'}}>
                <Button variant="text" className={classes.button} key={link._id} href={link.url} rel="noopener" target="_blank">
                  <div className={classNames(classes.contactIcon, "fa fa-" + link.icon)}></div>
                  {ProfileService.htmlDecode(link.display) || ProfileService.htmlDecode(link.value) || ProfileService.htmlDecode(link.url)}
                </Button>
              </Grid>
            )
          })}
          {canEdit && (
            <Grid item xs={12} style={{position: 'relative'}}>
              <Button variant="text" className={classes.button} style={{color: theme.palette.primary.main, fontWeight: 'bold'}}
                      href={UrlService.createUrl(process.env.REACT_APP_HOST_BACKFLIP, '/onboard/links', orgTag, 'recordId=' + currentHit.objectID)}>
                <div href={''} className={classNames(classes.contactIcon, "fa fa-plus")} style={{color: theme.palette.primary.main}}></div>
                <FormattedMessage id="profile.addContacts"/>
              </Button>
            </Grid>
          )}
        </Grid>
        <Grid container item xs={12} sm={6} lg={9} className={classes.hashtagsPart}>
          <Grid item xs={12} className={classes.minHeightPossible}>
            {currentHit.hashtags && currentHit.hashtags.map((hashtag, i) => {
              let displayedName = (hashtag.name_translated ? (hashtag.name_translated[locale] || hashtag.name_translated['en-UK']) || hashtag.name || hashtag.tag : hashtag.name || currentHit.tag)
              return (
                <Wings src={ProfileService.getPicturePath(hashtag.picture, 'hashtag') || defaultHashtagPicture}
                       label={ProfileService.htmlDecode(displayedName)} key={hashtag.tag}
                       onClick={(e) => this.handleReturnToSearch(e, {name: displayedName, tag: hashtag.tag})}
                       className={(hashtag.class ? hashtag.class : 'notHighlighted')}/>
              )
            })}
            {canEdit && (
              <Wings label={this.props.intl.formatMessage({id: 'profile.addWings'})} className={'button'}
                     onClick={() => {
                       window.location.href = UrlService.createUrl(process.env.REACT_APP_HOST_BACKFLIP, '/onboard/hashtags', orgTag, 'recordId=' + currentHit.objectID)
                     }}/>
            )}
            <div style={{marginTop: 16}}>
              <Typography variant="h5" style={{padding: 8}}>
                <FormattedMessage id={'profile.aboutMe'}/>
              </Typography>
              <div className={classes.aboutMe}>
                {ProfileService.htmlDecode(currentHit.description || '')}
              </div>
            </div>
          </Grid>
        </Grid>
      </Grid>
    )
  }
}

export default inject('commonStore', 'organisationStore', 'authStore', 'recordStore', 'userStore')(
  injectIntl(observer(
    withStyles(styles, {withTheme: true})(ProfileLayout)
  ))
);
