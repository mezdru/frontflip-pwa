import React from 'react';
import {Card, CardMedia, CardContent, CardActions, Grid, IconButton, Typography, withStyles} from '@material-ui/core';
import {Mail, GpsFixedSharp} from '@material-ui/icons';

import Wings from '../utils/wing/Wing'

const styles = {
    info: {
        height: '18vh',
        paddingTop: '30%',
        paddingRight: 0,
        paddingLeft: 0,
    },
    infoTitle: {
        fontSize: '24px',
        fontWeight: '500'
    },
    wingsContainer: {
        overflowX: 'scroll',
        whiteSpace: 'nowrap',
        paddingBottom: 5,
    },
    wings: {
        display: 'inline-block',
        color: 'white',
    }
};

class CardProfile extends React.Component {
    render() {
        return (
            <Card>
                <Grid container justify={'space-between'}>
                    <Grid item>
                        <CardMedia
                            image="https://wingzy-staging.herokuapp.com/images/placeholder_person.png"
                            title="Avatar"
                        />
                    </Grid>
                    <Grid item>
                        <CardContent className={this.props.classes.info} justify={'center'}>
                            <Typography className={this.props.classes.infoTitle}>
                                Jane/John Doe
                            </Typography>
                            <Typography component="p">
                                The first
                            </Typography>
                        </CardContent>
                    </Grid>
                    <Grid item>
                        <CardActions disableActionSpacing>
                            <Grid container direction="column">
                                <IconButton aria-label="Mail">
                                    <Mail/>
                                </IconButton>
                                <IconButton aria-label="Position">
                                    <GpsFixedSharp/>
                                </IconButton>
                            </Grid>
                        </CardActions>
                    </Grid>
                    <CardContent className={this.props.classes.wingsContainer}>
                        <Grid container className={this.props.classes.wings}>
                            <Wings src="https://twemoji.maxcdn.com/2/svg/1f985.svg" label="Eagle"/>
                            <Wings src="https://wingzy-staging.herokuapp.com/images/wings/bat.png" label="Bat wings"/>
                            <Wings src="https://twemoji.maxcdn.com/2/svg/1f985.svg" label="Eagle"/>
                            <Wings src="https://wingzy-staging.herokuapp.com/images/wings/bat.png" label="Bat wings"/>
                            <Wings src="https://twemoji.maxcdn.com/2/svg/1f985.svg" label="Eagle"/>
                            <Wings src="https://wingzy-staging.herokuapp.com/images/wings/bat.png" label="Bat wings"/>
                            <Wings src="https://wingzy-staging.herokuapp.com/images/wings/bat.png" label="Bat wings"/>
                            <Wings src="https://twemoji.maxcdn.com/2/svg/1f985.svg" label="Eagle"/>
                            <Wings src="https://wingzy-staging.herokuapp.com/images/wings/bat.png" label="Bat wings"/>
                            <Wings src="https://twemoji.maxcdn.com/2/svg/1f985.svg" label="Eagle"/>
                            <Wings src="https://wingzy-staging.herokuapp.com/images/wings/bat.png" label="Bat wings"/>
                        </Grid>
                    </CardContent>
                </Grid>
            </Card>
        );
    }
}

export default withStyles(styles)(CardProfile);
