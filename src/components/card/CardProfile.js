import React from 'react';
import {Card, CardContent, CardMedia, Grid, Typography, withStyles} from '@material-ui/core';
import {inject, observer} from 'mobx-react';

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

        this.state = {
            locale: this.props.commonStore.getCookie('locale') || this.props.commonStore.locale
        }
    }
    
    render() {
        const {hit, addToFilters} = this.props;

        return (
            <Grid item xs={10} justify={'center'}>
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
                                    {hit.name || hit.tag}
                                </Typography>
                                <Typography component="p">
                                    {hit.intro}
                                </Typography>
                            </CardContent>
                        </Grid>
                        <Grid container>
                            <CardContent className={this.props.classes.wingsContainer}>
                                <Grid container className={this.props.classes.wings}>
                                    {hit.hashtags.map((hashtag, i) => {
                                        let displayedName = (hashtag.name_translated ? (hashtag.name_translated[this.state.locale] || hashtag.name_translated['en-UK']) || hashtag.name || hashtag.tag : hashtag.name || hit.tag )
                                        return (<Wings src="https://twemoji.maxcdn.com/2/svg/1f985.svg" label={displayedName} onClick={(e) => addToFilters(e, {name: displayedName, tag: hashtag.tag})} />) 
                                    })}
                                </Grid>
                            </CardContent>
                        </Grid>
                    </Grid>
                </Card>
            </Grid>
        );
    }
}
export default inject('commonStore')(
    observer(
        withStyles(styles)(CardProfile)
    )
);
