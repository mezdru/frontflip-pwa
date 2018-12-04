import React from 'react';
import {Card, CardMedia, CardContent, CardActions, Grid, IconButton, Typography} from '@material-ui/core';
import {Mail, GpsFixedSharp} from '@material-ui/icons';

import Wings from '../utils/wings/Wings';

import './CardProfile.css'

class CardProfile extends React.Component {
    render() {
        return (
            <Card id="card">
                <Grid container justify={'space-between'}>
                    <Grid item>
                        <CardMedia
                            id="card-picture"
                            image="https://wingzy-staging.herokuapp.com/images/placeholder_person.png"
                            title="Avatar"
                        />
                    </Grid>
                    <Grid item>
                        <CardContent id="card-info" justify={'center'}>
                            <Typography style={{fontSize: '24px', fontWeight: '500'}}>
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
                    <CardContent id="card-content">
                        <Grid container id={'card-wings'}>
                            <Wings src="https://twemoji.maxcdn.com/2/svg/1f985.svg" label="Eagle"></Wings>
                            <Wings src="https://wingzy-staging.herokuapp.com/images/wings/bat.png" label="Bat wings"></Wings>
                            <Wings src="https://twemoji.maxcdn.com/2/svg/1f985.svg" label="Eagle"></Wings>
                            <Wings src="https://wingzy-staging.herokuapp.com/images/wings/bat.png" label="Bat wings"></Wings>
                            <Wings src="https://twemoji.maxcdn.com/2/svg/1f985.svg" label="Eagle"></Wings>
                            <Wings src="https://wingzy-staging.herokuapp.com/images/wings/bat.png" label="Bat wings"></Wings>
                            <Wings src="https://wingzy-staging.herokuapp.com/images/wings/bat.png" label="Bat wings"></Wings>
                            <Wings src="https://twemoji.maxcdn.com/2/svg/1f985.svg" label="Eagle"></Wings>
                            <Wings src="https://wingzy-staging.herokuapp.com/images/wings/bat.png" label="Bat wings"></Wings>
                            <Wings src="https://twemoji.maxcdn.com/2/svg/1f985.svg" label="Eagle"></Wings>
                            <Wings src="https://wingzy-staging.herokuapp.com/images/wings/bat.png" label="Bat wings"></Wings>
                        </Grid>
                    </CardContent>
                </Grid>
            </Card>
        );
    }
}

export default CardProfile
