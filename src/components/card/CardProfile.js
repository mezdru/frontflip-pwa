import React from 'react';
import PropTypes from 'prop-types';
import {Grid, withStyles, Typography, IconButton, CardActions, CardContent, CardHeader, Card} from '@material-ui/core';
import {loadCSS} from 'fg-loadcss/src/loadCSS';
import {inject, observer} from 'mobx-react';

import Logo from '../../components/utils/logo/Logo';
import Wings from '../utils/wing/Wing';


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
    }
    
    componentDidMount() {
        loadCSS(
            'https://use.fontawesome.com/releases/v5.1.0/css/all.css',
            document.querySelector('#insertion-point-jss'),
        );
    }
    
    render() {
        const {classes, hit, addToFilters} = this.props;
        
        return (
            <Card>
                <Grid item>
                    <CardHeader
                        className={classes.header}
                        avatar={
                            <Logo className={classes.logo} src={'https://media.glamour.com/photos/5a425fd3b6bcee68da9f86f8/master/w_644,c_limit/best-face-oil.png'}/>
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
                            <Grid item>
                                <IconButton className="fas fa-envelope"
                                            color="secondary"
                                />
                            </Grid>
                            <Grid item>
                                <IconButton className="fas fa-phone"
                                            color="secondary"
                                />
                            </Grid>
                            <Grid item>
                                <IconButton className="fas fa-map-marker-alt"
                                            color="secondary"/>
                            </Grid>
                            <Grid item>
                                <IconButton className="fab fa-github"
                                            color="secondary"/>
                            </Grid>
                            <Grid item>
                                <IconButton className="fab fa-linkedin"
                                            color="secondary"/>
                            </Grid>
                        </Grid>
                    </CardActions>
                </Grid>
                <Grid item container spacing={8}>
                    <CardContent className={this.props.classes.wingsContainer}>
                        <Grid container className={this.props.classes.wings}>
                            {hit.hashtags.map((hashtag, i) => {
                                let displayedName = (hashtag.name_translated ? (hashtag.name_translated[this.state.locale] || hashtag.name_translated['en-UK']) || hashtag.name || hashtag.tag : hashtag.name || hit.tag )
                                return (<Wings src="https://twemoji.maxcdn.com/2/svg/1f985.svg" label={displayedName} onClick={(e) => addToFilters(e, {name: displayedName, tag: hashtag.tag})} />)
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
        withStyles(styles)(CardProfile)
    )
);
