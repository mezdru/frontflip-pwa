import React from 'react'
import { inject, observer} from 'mobx-react';
import {Grid, withStyles, Typography, IconButton, Button} from '@material-ui/core';
import { Edit } from '@material-ui/icons';
import '../../resources/stylesheets/font-awesome.min.css';
import Logo from '../../components/utils/logo/Logo';
import Wings from '../utils/wing/Wing';
import defaultPicture from '../../resources/images/placeholder_person.png';
import defaultHashtagPicture from '../../resources/images/placeholder_hashtag.png';
import './ContactsColors.css';
import { FormattedMessage, injectIntl } from 'react-intl';
import classNames from 'classnames';
import UrlService from '../../services/url.service';
import {styles} from './ProfileLayout.css';
import twemoji from 'twemoji';

const EXTRA_LINK_LIMIT = 20;


class ProfileLayout extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            canEdit: this.canEdit(),
            record: null
        }

        this.transformLinks = this.transformLinks.bind(this);
        this.canEdit = this.canEdit.bind(this);
    }

    canEdit() {
        if(!(this.props.userStore.values.currentUser && this.props.userStore.values.currentUser._id)) return false;
        if(this.props.userStore.values.currentUser.superadmin) return true;
        else if(this.props.userStore.values.currentUser.orgsAndRecords.find(orgAndRecord => orgAndRecord.record === this.props.hit.objectID)) return true;
        else return false;
    }

    transformLinks(item) {
        item.links = item.links || [];
        item.links.forEach(function (link, index, array) {
            this.makeLinkDisplay(link);
            this.makeLinkIcon(link);
            this.makeLinkUrl(link);
            if (index > EXTRA_LINK_LIMIT - 1) link.class = 'extraLink';
        }.bind(this));
    }
    
    makeLinkIcon(link) {
        switch (link.type) {
            case 'email':
                link.icon = 'envelope-o';
                break;
            case 'address':
            case 'location':
                link.icon = 'map-marker';
                break;
            case 'hyperlink':
                link.icon = 'link';
                break;
            case 'workplace':
                link.icon = 'user';
                break;
            case 'workchat':
                link.icon = 'comment';
                break;
            default:
                link.icon = link.type;
                break;
        }
    }
    
    makeLinkDisplay(link) {
        link.display = link.display || link.value;
    }
    
    makeLinkUrl(link) {
        link.url = link.url || link.uri;
        if (!link.url) {
            switch (link.type) {
                case 'email':
                    link.url = 'mailto:' + link.value;
                    break;
                case 'phone':
                    link.url = 'tel:' + link.value;
                    break;
                case 'home':
                    link.url = 'tel:' + link.value;
                    break;
                case 'address':
                    link.url = 'http://maps.google.com/?q=' + encodeURIComponent(link.value);
                    break;
                default:
                    link.url = link.value;
                    break;
            }
        }
    }
    
    getPicturePath(picture) {
        if(picture && picture.path) return null;
        else if (picture && picture.url) return picture.url;
        else if (picture && picture.uri) return picture.uri;
        else if (picture && picture.emoji) return this.getEmojiUrl(picture.emoji);
        else return null;
    }

    getEmojiUrl(emoji) {
        let str = twemoji.parse(emoji);
        str = str.split(/ /g);
        str = str[4].split(/"/g);
        return str[1];
    }
    
    makeHightlighted = function (item) {
        let filters = this.props.commonStore.getSearchFilters() || this.props.commonStore.searchFilters;
        if (filters && filters.length > 0) {
            item.hashtags.forEach((hashtag, index) => {
                if (hashtag.tag && filters.find(filterValue => filterValue.value === hashtag.tag)) item.hashtags[index].class = 'highlighted';
            });
        }
    };
    
    orderHashtags = function (item) {
        if(!item.hashtags) return;
        var highlighted = [];
        var notHighlighted = [];
        item.hashtags.forEach(function (hashtag) {
            if (hashtag.class === 'highlighted') highlighted.push(hashtag);
            else notHighlighted.push(hashtag);
        });
        item.hashtags = highlighted.concat(notHighlighted);
    };
    

    componentDidMount() {
        this.props.recordStore.setRecordTag(this.props.hit.tag);
        this.props.recordStore.setOrgId(this.props.organisationStore.values.organisation._id);
        this.props.recordStore.getRecordByTag()
        .then((record) => {
            record.objectID = record._id;
            this.setState({record: record});
        })
    };

    render(){
        const { hit, className, classes, theme, addToFilters } = this.props;
        const { canEdit, record } = this.state;
        const { locale } = this.props.commonStore;
        const orgTag = this.props.organisationStore.values.organisation.tag;

        const currentHit = record || hit;
        this.transformLinks(currentHit);
        this.makeHightlighted(currentHit);
        this.orderHashtags(currentHit);

        if(!currentHit) return (<div></div>);

        return(
            <Grid container className={className} >
                <Grid item xs={12} sm={6} lg={3} className={classes.generalPart} >
                    <Grid item>
                    <Logo type={'person'} className={classes.logo} src={this.getPicturePath(currentHit.picture) || defaultPicture} />
                    <div className={classes.subheader}>
                        <Typography variant="h4" className={classes.name}>
                                {currentHit.name || currentHit.tag}
                                {canEdit && (
                                    <IconButton aria-label="Edit" className={classes.editButton} 
                                                href={UrlService.createUrl(process.env.REACT_APP_HOST_BACKFLIP, '/onboard/intro', orgTag, 'recordId='+currentHit.objectID)}>
                                        <Edit fontSize="default"  />
                                    </IconButton>
                                )}
                        </Typography>
                        <Typography variant="subheading" className={classes.name}>
                                {currentHit.intro}
                        </Typography>
                    </div>
                    </Grid>
                        {currentHit.links.map((link, i) => {
                            return (
                                <Grid item key={link._id} xs={12} style={{position: 'relative'}}>
                                    <Button variant="text" className={classes.button} key={link._id}>
                                        <div href={link.url} className={classNames(classes.contactIcon, "fa fa-"+link.icon)}></div>
                                        {link.display || link.value || link.url}
                                    </Button>
                                </Grid>
                            )
                        })}
                        {canEdit && (
                            <Grid item xs={12} style={{position: 'relative'}}>
                                <Button variant="text" className={classes.button} style={{color: theme.palette.primary.main, fontWeight: 'bold'}}
                                        href={UrlService.createUrl(process.env.REACT_APP_HOST_BACKFLIP, '/onboard/links', orgTag, 'recordId='+currentHit.objectID)} >
                                    <div href={''} className={classNames(classes.contactIcon, "fa fa-plus")} style={{color: theme.palette.primary.main}}></div>
                                    <FormattedMessage id="profile.addContacts"/>
                                </Button>
                            </Grid>
                        )}
                </Grid>
                <Grid container item xs={12} sm={6} lg={9} className={classes.hashtagsPart} >
                        {canEdit && (
                            <Button className={classes.updateCoverButton} color="primary"
                                    href={UrlService.createUrl(process.env.REACT_APP_HOST_BACKFLIP, '/cover/id/'+currentHit.objectID, orgTag)} >
                                <FormattedMessage id="profile.updateCover" />
                            </Button>
                        )}
                        <Grid item xs={12} className={classes.minHeightPossible} >
                            {currentHit.hashtags && currentHit.hashtags.map((hashtag, i) => {
                                let displayedName = (hashtag.name_translated ? (hashtag.name_translated[locale] || hashtag.name_translated['en-UK']) || hashtag.name || hashtag.tag : hashtag.name || currentHit.tag)
                                return (
                                    <Wings src={this.getPicturePath(hashtag.picture) || defaultHashtagPicture}
                                        label={displayedName} key={hashtag.tag}
                                        onClick={(e) => addToFilters(e, {name: displayedName, tag: hashtag.tag})}
                                        className={(hashtag.class ? hashtag.class : 'notHighlighted')}/>
                                )
                            })}
                            {canEdit && (
                                <Wings label={this.props.intl.formatMessage({id: 'profile.addWings'})} className={'highlighted'} 
                                        onClick={()=>{window.location.href=UrlService.createUrl(process.env.REACT_APP_HOST_BACKFLIP, '/onboard/hashtags', orgTag, 'recordId='+currentHit.objectID)}} />
                            )}
                            <div style={{marginTop: 16}}>
                                <Typography variant="h5" style={{padding: 16}}>
                                    <FormattedMessage id={'profile.aboutMe'} />
                                    {canEdit && (
                                        <IconButton aria-label="Edit" className={classes.editButton}
                                                    href={UrlService.createUrl(process.env.REACT_APP_HOST_BACKFLIP, '/about/id/'+currentHit.objectID, orgTag)}>
                                            <Edit fontSize="default"  />
                                        </IconButton>
                                    )}
                                </Typography>
                                <div>
                                    {currentHit.description}
                                </div>
                            </div>
                        </Grid>
                </Grid>
            </Grid>
        )
    }
};

export default inject('commonStore', 'organisationStore', 'authStore', 'recordStore', 'userStore')(
    injectIntl(observer(
        withStyles(styles, {withTheme: true})(ProfileLayout)
    ))
);
