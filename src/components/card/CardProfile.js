import React from 'react';
import PropTypes from 'prop-types';
import {Grid, withStyles, Typography, IconButton, CardActions, CardContent, CardHeader, Card, Tooltip} from '@material-ui/core';
import {inject, observer} from 'mobx-react';
import '../../resources/stylesheets/font-awesome.min.css';
import Logo from '../../components/utils/logo/Logo';
import Wings from '../utils/wing/Wing';
import defaultPicture from '../../resources/images/placeholder_person.png';
import defaultHashtagPicture from '../../resources/images/placeholder_hashtag.png';

const EXTRA_LINK_LIMIT = 5;

const styles = theme => ({
    logo: {
        width: '9rem',
        height: '9rem',
        marginBottom: '-4rem',
        ['& img']: {
            height: '100%',
        },
    },
    name: {
        marginRight: 65,
    },
    contact: {
        width: 10
    },
    header: {
        backgroundColor: theme.palette.secondary.main,
        textAlign: 'center',
        boxShadow: '0 2px 2px -1px darkgrey',
        
    },
    actions: {
        display: 'flex',
        padding: '8px',
    },
    wingsContainer: {
        whiteSpace: 'nowrap',
        overflowX: 'scroll',
    },
    wings: {
        display: 'inline-block',
        color: 'white',
        position: 'relative',
    }
});

class RecipeReviewCard extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            locale: this.props.commonStore.getCookie('locale') || this.props.commonStore.locale
        }
        this.transformLinks = this.transformLinks.bind(this);
    }

    // @todo find somewhere to put & deduplicate the transformLinks (public/js/index.js + views/hbs.js) logic.
    transformLinks(item) {
        item.links = item.links || [];
        item.links.forEach(function (link, index, array) {
            this.makeLinkDisplay(link);
            this.makeLinkIcon(link);
            this.makeLinkUrl(link);
            if (index > EXTRA_LINK_LIMIT-1) link.class = 'extraLink';
        }.bind(this));
    }

    makeLinkIcon(link) {
        switch (link.type) {
            case 'email': link.icon = 'envelope-o'; break;
            case 'address': case 'location': link.icon = 'map-marker'; break;
            case 'hyperlink': link.icon = 'link'; break;
            case 'location': link.icon = 'map-marker'; break;
            case 'workplace': link.icon = 'user'; break;
            case 'workchat': link.icon = 'comment'; break;
            default: link.icon = link.type;	break;
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
                    link.url = 'mailto:'+link.value;
                    break;
                case 'phone':
                    link.url = 'tel:'+link.value;
                    break;
                case 'home':
                    link.url = 'tel:'+link.value;
                    break;
                case 'address':
                    link.url = 'http://maps.google.com/?q='+encodeURIComponent(link.value);
                    break;
                default:
                    link.url = link.value;
                    break;
            }
        }
    }

    getPicturePath(picture) {
        if(picture && picture.path){
            return null;
        } else if (picture && picture.url) {
            return picture.url;
        } else if (picture && picture.uri) {
                return picture.uri;
        } else {
            return null;
        }
    }
    
    render() {
        const {classes, hit, addToFilters} = this.props;
        this.transformLinks(hit);

        return (
            <Card>
                <Grid item>
                    <CardHeader
                        className={classes.header}
                        avatar={
                            <Logo type={'person'} className={classes.logo} src={this.getPicturePath(hit.picture) || defaultPicture}/>
                        }
                        title={
                            <Typography variant="h4" className={classes.name} gutterBottom>
                                {hit.name || hit.tag}
                            </Typography>
                        }
                        subheader={
                            <Typography variant="subheading" className={classes.name} gutterBottom>
                                {hit.intro}
                            </Typography>
                        }
                    />
                </Grid>
                <Grid item container justify={'flex-end'}>
                    <CardActions className={classes.actions} disableActionSpacing>
                        <Grid item container spacing={0}>
                            {hit.links.map((link, i) => {
                                return (
                                    <Grid item>
                                        <Tooltip title={link.display || link.value || link.url} >
                                            <IconButton href={link.url} className={"fa fa-"+link.icon} />
                                        </Tooltip>
                                    </Grid>
                                )
                            })}
                        </Grid>
                    </CardActions>
                </Grid>
                <Grid item container spacing={8}>
                    <CardContent className={this.props.classes.wingsContainer}>
                        <Grid container className={this.props.classes.wings}>
                            {hit.hashtags.map((hashtag, i) => {
                                let displayedName = (hashtag.name_translated ? (hashtag.name_translated[this.state.locale] || hashtag.name_translated['en-UK']) || hashtag.name || hashtag.tag : hashtag.name || hit.tag )
                                return (<Wings src={this.getPicturePath(hashtag.picture) || defaultHashtagPicture} label={displayedName} onClick={(e) => addToFilters(e, {name: displayedName, tag: hashtag.tag})} />)
                            })}
                        </Grid>
                    </CardContent>
                </Grid>
            </Card>
        );
    }
}

RecipeReviewCard.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default inject('commonStore')(
    observer(
        withStyles(styles)(RecipeReviewCard)
    )
);
