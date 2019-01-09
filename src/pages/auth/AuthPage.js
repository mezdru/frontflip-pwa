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
            banner: null,
            logo: null
        };
    }
    
    componentDidMount() {
        this.setState({
            banner:
                (this.props.organisationStore.values.organisation.cover ? this.props.organisationStore.values.organisation.cover.url : bannerImg)
        });
        this.setState({
            logo:
                (this.props.organisationStore.values.organisation.logo ? this.props.organisationStore.values.organisation.logo.url :
                 'https://pbs.twimg.com/profile_images/981455890342694912/fXaclV2Y_400x400.jpg') });
        
        observe(this.props.organisationStore.values, 'organisation', (change) => {
            let org = this.props.organisationStore.values.organisation;
            this.setState({banner: (org.cover && org.cover.url ? org.cover.url : bannerImg)});
            this.setState({logo: (org.logo && org.logo.url ? org.logo.url : 'https://pbs.twimg.com/profile_images/981455890342694912/fXaclV2Y_400x400.jpg')});
        });
    }
    
    render() {
        const {banner, logo} = this.state;
        const {classes} = this.props;
        
        return (
            <Grid container direction={"column"} justify={"space-around"} alignItems={"center"}>
                <Grid container item alignItems={"stretch"}>
                    <Banner src={banner}/>
                </Grid>
                <Grid container item justify={"center"}>
                    <Logo src={logo} alt="org-logo" className={classes.logo}/>
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
