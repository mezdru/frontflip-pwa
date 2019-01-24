import React from 'react';
import {Grid, withStyles} from '@material-ui/core';
import Banner from '../../components/utils/banner/Banner';
import Logo from '../../components/utils/logo/Logo';
import Auth from '../../components/auth/Auth';
import Header from '../../components/header/Header';

const styles = {
    logo: {
        width: '6rem',
        height: '6rem',
        boxShadow: '0 5px 15px -1px darkgrey, 0 0 0 5px transparent',
        bottom: '3rem',
        marginBottom: '-6rem',
        zIndex:2,
    }
};

class AuthPage extends React.Component {

    render() {
        const {classes, initialTab} = this.props;
        
        return (
            <div>
                <Header />
                <main>
                    <Grid container direction={"column"} justify={"space-around"} alignItems={"center"}>
                        <Grid container item alignItems={"stretch"}>
                            <Banner/>
                        </Grid>
                        <Grid container item justify={"center"}>
                            <Logo type={'organisation'} alt="org-logo" className={classes.logo}/>
                        </Grid>
                        <Grid container item xs={12} sm={6} lg={4}>
                            <Auth initialTab={initialTab || 0} />
                        </Grid>
                    </Grid>
                </main>
            </div>
        )
    }
}

export default 
        withStyles(styles, {withTheme: true})(
            AuthPage
        );
