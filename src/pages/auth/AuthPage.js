import React from 'react';
import {Grid, withStyles} from '@material-ui/core';
import Banner from '../../components/utils/banner/Banner';
import Logo from '../../components/utils/logo/Logo';
import Auth from '../../components/auth/Auth';
import bannerImg from '../../resources/images/fly_away.jpg';
import {inject, observer} from "mobx-react";
import {observe} from 'mobx';

const styles = {
    logo: {
        bottom: '3rem',
        marginBottom: '-6rem',
    }
};

class AuthPage extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            banner: null
        };
    }
    
    componentDidMount() {
        this.setState({
            banner:
                (this.props.organisationStore.values.organisation.cover ? this.props.organisationStore.values.organisation.cover.url : bannerImg)
        });

        observe(this.props.organisationStore.values, 'organisation', (change) => {
            let org = this.props.organisationStore.values.organisation;
            this.setState({banner: (org.cover && org.cover.url ? org.cover.url : bannerImg)});
        });
    }
    
    render() {
        const {banner} = this.state;
        const {classes} = this.props;
        
        return (
            <Grid container direction={"column"} justify={"space-around"} alignItems={"center"}>
                <Grid container item alignItems={"stretch"}>
                    <Banner/>
                </Grid>
                <Grid container item justify={"center"}>
                    <Logo type={'organisation'} alt="org-logo" className={classes.logo}/>
                </Grid>
                <Grid container item xs={12} sm={6} lg={4}>
                    <Auth/>
                </Grid>
            </Grid>
        )
    }
}

export default inject('organisationStore')(
    observer(
        withStyles(styles, {withTheme: true})(
            AuthPage
        )
    )
);
