import React from 'react'
import { inject, observer} from 'mobx-react';
import {Grid, withStyles, Typography, IconButton, CardActions, CardContent, CardHeader, Card, Tooltip, Button} from '@material-ui/core';
import '../../resources/stylesheets/font-awesome.min.css';
import Logo from '../../components/utils/logo/Logo';
import Wings from '../utils/wing/Wing';
import defaultPicture from '../../resources/images/placeholder_person.png';
import defaultHashtagPicture from '../../resources/images/placeholder_hashtag.png';

const LOGO_HEIGHT = 170;
const styles = theme => ({
    generalPart: {
        position: 'relative',
        minHeight: 'calc(100vh - 247px)',
        [theme.breakpoints.up('md')]: {
            minHeight: 'calc(100vh - 429px)'
        },
        background: theme.palette.secondary.light,
        padding: 16
    },
    hashtagsPart: {
        position: 'relative',
        minHeight: 'calc(100vh - 247px)',
        [theme.breakpoints.up('md')]: {
            minHeight: 'calc(100vh - 429px)'
        },
    },
    logoContainer: {
        position: 'relative',
        transform: 'translateY(-50%)',
        top:0,
    },
    logo: {
        position: 'relative',
        transform: 'translateY(-50%)',
        top: -16,
        left:0,
        right:0,
        marginLeft: 'auto',
        marginRight: 'auto',
        width: LOGO_HEIGHT-10,
        height: LOGO_HEIGHT,
        '& img': {
            height: '90%',
            width: '90%',
            borderRadius: '50%',
        },
    },
    subheader: {
        position: 'relative',
        top: -(LOGO_HEIGHT/2),
        marginTop: 16,
    },
    button: {
        color: theme.palette.secondary.contrastText,
        paddingLeft: 0,
        wordBreak: 'break-all',
    },
    buttonIcon: {
        width: 40,
        height: 40,
        color: 'red'
    }
});
const EXTRA_LINK_LIMIT = 5;

class ProfileLayout extends React.Component {

    constructor(props) {
        super(props);
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
        else return null;
    }
    
    makeHightlighted = function (item) {
        let filters = this.props.commonStore.getSearchFilters() || this.props.commonStore.searchFilters;
        if (filters.length > 0) {
            item.hashtags.forEach((hashtag, index) => {
                if (hashtag.tag && filters.find(filterValue => filterValue.value === hashtag.tag)) item.hashtags[index].class = 'highlighted';
            });
        }
    };
    
    orderHashtags = function (item) {
        var highlighted = [];
        var notHighlighted = [];
        item.hashtags.forEach(function (hashtag) {
            if (hashtag.class === 'highlighted') highlighted.push(hashtag);
            else notHighlighted.push(hashtag);
        });
        item.hashtags = highlighted.concat(notHighlighted);
    };
    

    componentDidMount() {
    };

    render(){
        const { hit, className, classes, theme } = this.props;
        this.transformLinks(hit);
        this.makeHightlighted(hit);
        this.orderHashtags(hit);

        if(hit) {
            return(
                <Grid container className={className} >
                    <Grid item xs={12} sm={6} lg={3} className={classes.generalPart} >
                        <Logo type={'person'} className={classes.logo} src={this.getPicturePath(hit.picture) || defaultPicture} />
                        <div className={classes.subheader}>
                            <Typography variant="h4" className={classes.name}>
                                    {hit.name || hit.tag}
                            </Typography>
                            <Typography variant="subheading" className={classes.name}>
                                    {hit.intro}
                            </Typography>
                        </div>

                        <Grid item container spacing={0}>
                            {hit.links.map((link, i) => {
                                return (
                                    <Grid item key={link._id} xs={12} >
                                        <Button variant="text" className={classes.button}>
                                            <IconButton href={link.url} className={"fa fa-" + link.icon} 
                                                        style={{color: theme.palette.secondary.contrastText, marginRight:16, position:'relative', width: 40}}/>
                                            {link.display || link.value || link.url}
                                        </Button>
                                    </Grid>
                                )
                            })}
                        </Grid>

                        
                    </Grid>
                    <Grid container item xs={12} sm={6} lg={9} className={classes.hashtagsPart} >

                    </Grid>
                </Grid>
            )
        } else {
            return (<div className={className}>You should provide a hit.</div>);
        }


    }
};

export default inject('commonStore', 'organisationStore', 'authStore', 'recordStore', 'userStore')(
    observer(
        withStyles(styles, {withTheme: true})(ProfileLayout)
    )
);
