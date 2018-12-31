import React from 'react';
import {Avatar, Grid, withStyles} from '@material-ui/core';
import Banner from '../../components/utils/banner/Banner';
import Auth from '../../components/auth/Auth';
import bannerImg from '../../resources/images/fly_away.jpg'

const styles = {
    avatar: {
        bottom: '3rem',
        marginBottom: '-6rem'
    }
};

const AuthPage = ({...props}) => {
    return (
        <Grid container direction={"column"} justify={"space-around"} alignItems={"center"}>
            <Grid container item alignItems={"stretch"}>
                <Banner src={bannerImg} style={{boxShadow: 'inset 0px 65px 65px -30px #FFF'}}/>
            </Grid>
            <Grid container item justify={"center"}>
                <Avatar src="https://pbs.twimg.com/profile_images/981455890342694912/fXaclV2Y_400x400.jpg" alt="org-logo" className={props.classes.avatar}/>
            </Grid>
            <Grid container item xs={12} sm={6} lg={4}>
                <Auth/>
            </Grid>
        </Grid>
    )
};

export default withStyles(styles)(AuthPage);
