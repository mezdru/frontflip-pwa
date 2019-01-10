import React from 'react';
import {Card, CardActions, CardContent, CardMedia, Grid, IconButton, Typography, withStyles} from '@material-ui/core';
import {GpsFixedSharp, Mail} from '@material-ui/icons';

import Wings from '../utils/wing/Wing';

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
        whiteSpace: 'nowrap',
        overflowX: 'scroll',
    },
    wings: {
        display: 'inline-block',
        color: 'white',
        position: 'relative',
    }
}


class CardProfile extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        return (
            <Card style={{padding: 0, overflow: 'visible'}}>
                <Grid container direction={'row'} justify={'space-between'}>
                    <Grid item>
                        <CardMedia
                            id="card-picture"
                            image="http://mon-btsnrc.fr/wp-content/uploads/2017/05/Profil-BTS-NRC-qualit%C3%A9s.jpg"
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
                    <Grid item >
                        <CardActions disableActionSpacing justify={'flex-end'}>
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
                    <Grid container>
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
                </Grid>
            </Card>
        );
    }
}

export default withStyles(styles)(CardProfile);
