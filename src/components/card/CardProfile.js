import React from 'react';
import PropTypes from 'prop-types';
import {Grid, withStyles, Typography, IconButton, CardActions, CardContent, CardHeader, Card, Tooltip} from '@material-ui/core';
import {inject, observer} from 'mobx-react';
import '../../resources/stylesheets/font-awesome.min.css';
import Logo from '../../components/utils/logo/Logo';
import Wings from '../utils/wing/Wing';
import defaultPicture from '../../resources/images/placeholder_person.png';
import defaultHashtagPicture from '../../resources/images/placeholder_hashtag.png';
import twemoji from 'twemoji';

const EXTRA_LINK_LIMIT = 5;

const styles = theme => ({
    logo: {
        width: 170,
        height: 170,
        marginBottom: '-5rem',
        '& img': {
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            border: '9px solid white'
        },
    },
    name: {
        '& span span': {
            backgroundColor: theme.palette.primary.main,
            borderRadius: 30,
            paddingLeft: 8,
            paddingRight: 8,
        },
        display: 'block',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
    },
    wings: {
        display: 'inline-block',
        color: 'white',
        position: 'relative',
    },
    fullWidth: {
        width: '100%'
    },
    cardHeader: {
        cursor: 'pointer'
    }
});

class CardProfile extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            locale: this.props.commonStore.getCookie('locale') || this.props.commonStore.locale
        }
        this.transformLinks = this.transformLinks.bind(this);
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

        if(item && item._highlightResult) {
            if(item._highlightResult.intro && item._highlightResult.intro.value) item.intro = item._highlightResult.intro.value;
            if(item._highlightResult.name && item._highlightResult.name.value && item._highlightResult.name.matchLevel === 'full') item.name = item._highlightResult.name.value;
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

    htmlDecode = function(input){
        var e = document.createElement('textarea');
        e.innerHTML = input;
        return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
    }
    
    render() {
        const {classes, hit, addToFilters, handleDisplayProfile} = this.props;
        this.transformLinks(hit);
        this.makeHightlighted(hit);
        this.orderHashtags(hit);
        return (
            <Card className={classes.fullWidth} key={hit.objectID}>
                <Grid item container>
                    <CardHeader
                        avatar={
                            <Logo type={'person'} className={classes.logo} src={this.getPicturePath(hit.picture) || defaultPicture}/>
                        }
                        title={
                            <Typography variant="h4" className={classes.name} gutterBottom>
                                <span dangerouslySetInnerHTML={{__html: this.htmlDecode(hit.name) || hit.tag}}></span>
                            </Typography>
                        }
                        subheader={
                            <Typography variant="subheading" className={classes.name} gutterBottom>
                                <span dangerouslySetInnerHTML={{__html: this.htmlDecode(hit.intro || '')}}></span>
                            </Typography>
                        }
                        onClick={(e) => handleDisplayProfile(e, hit)}
                        className={classes.cardHeader}
                    />
                </Grid>
                <Grid item container justify={'flex-end'}>
                    <CardActions className={classes.actions} disableActionSpacing>
                        <Grid item container spacing={0}>
                            {hit.links && hit.links.map((link, i) => {
                                if(link.class !== 'extraLink'){
                                    return (
                                        <Grid item key={link._id}>
                                            <Tooltip title={this.htmlDecode(link.display) || this.htmlDecode(link.value) || this.htmlDecode(link.url)}>
                                                <IconButton href={link.url} className={"fa fa-" + link.icon}/>
                                            </Tooltip>
                                        </Grid>
                                    )
                                }
                            })}
                        </Grid>
                    </CardActions>
                </Grid>
                <Grid container item>
                    <CardContent className={this.props.classes.wingsContainer}>
                        <Grid container className={this.props.classes.wings}>
                            {hit.hashtags && hit.hashtags.map((hashtag, i) => {
                                let displayedName = (hashtag.name_translated ? (hashtag.name_translated[this.state.locale] || hashtag.name_translated['en-UK']) || hashtag.name || hashtag.tag : hashtag.name || hit.tag)
                                return (
                                    <Wings src={this.getPicturePath(hashtag.picture) || defaultHashtagPicture}
                                           label={this.htmlDecode(displayedName)} key={hashtag.tag}
                                           onClick={(e) => addToFilters(e, {name: displayedName, tag: hashtag.tag})}
                                           className={(hashtag.class ? hashtag.class : 'notHighlighted')}/>
                                )
                            })}
                        </Grid>
                    </CardContent>
                </Grid>
            </Card>
        );
    }
}

CardProfile.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default inject('commonStore')(
    observer(
        withStyles(styles)(CardProfile)
    )
);
