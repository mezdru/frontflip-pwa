import React from 'react';
import {Card, CardActions, CardContent, CardMedia, Grid, IconButton, Typography, withStyles} from '@material-ui/core';
import {ArrowBack, ArrowForward, GpsFixedSharp, Mail} from '@material-ui/icons';

import Wings from '../utils/wing/Wing';
import RootRef from "@material-ui/core/RootRef";

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
        paddingBottom: 5,
        overflow: 'hidden',
        borderRadius: 30
    },
    wings: {
        display: 'inline-block',
        color: 'white',
        position: 'relative',
    }
};

class CardProfileTest extends React.Component {
    constructor(props) {
        super(props);
        this.scroller = React.createRef();
    }
    
    wingsPrev = () => {
        this.scroller.current.scrollLeft -= 200;
    };
    
    wingsNext = () => {
        this.scroller.current.scrollLeft += 200;
    };
    
    render() {
        const {hit} = this.props;
        if(hit.type === 'person'){
            return (
                <Card style={{padding: 0, overflow: 'visible'}}>
                    <Grid container justify={'space-between'}>
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
                                    {hit.name || hit.tag}
                                </Typography>
                                <Typography component="p">
                                    {hit.intro}
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
        
                        <Grid container direction={"row"} style={{
                            left: '-9.7%',
                            width: '125%',
                            position: 'relative'
                        }}>
                            <IconButton color="secondary" onClick={this.wingsPrev}>
                                <ArrowBack/>
                            </IconButton>
                            <RootRef rootRef={this.scroller}>
                                <CardContent className={this.props.classes.wingsContainer} style={{width: '80%'}}>
                                    <Grid container className={this.props.classes.wings}>
                                        {hit.hashtags.map((hashtag, i) => {     
                                            return (<Wings src="https://twemoji.maxcdn.com/2/svg/1f985.svg" label={hashtag.name}/>) 
                                        })}
                                    </Grid>
                                </CardContent>
                            </RootRef>
                            <IconButton color="secondary" onClick={this.wingsNext}>
                                <ArrowForward/>
                            </IconButton>
                        </Grid>
                    </Grid>
                </Card>
            );
        }else{
            return <span></span>;
        }

    }
}

export default withStyles(styles)(CardProfileTest);
