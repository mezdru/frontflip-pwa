import React from 'react'
import {Grid, withStyles} from '@material-ui/core';
import Banner from '../components/utils/banner/Banner';
import Card from '../components/card/CardProfile';
import MainAlgoliaSearch from '../components/algolia/MainAlgoliaSearch';
import {inject, observer} from "mobx-react";
import Header from '../components/header/Header';
import {Redirect} from "react-router-dom";

const styles = {
    searchBanner: {
        position: 'absolute',
        opacity: 0.8,
        filter: 'blur(.5px)'
    }
};

class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirectTo: null,
            locale: this.props.commonStore.getCookie('locale') || this.props.commonStore.locale,
            profileTag: (this.props.match && this.props.match.params && this.props.match.params.profileTag) ? this.props.match.params.profileTag : null
        };
    }
    
    render() {
        const {redirectTo, profileTag} = this.state;

        if(redirectTo) return (<Redirect to={redirectTo} />);
        
        return (
            <div>
                <Header />
                <main>
                    <Grid container direction={'column'} alignItems={'center'}>
                        <Grid container item alignItems={"stretch"} className={this.props.classes.searchBanner}>
                            <Banner />
                        </Grid>
                        {!profileTag &&(
                            <MainAlgoliaSearch HitComponent={Card} resultsType={'person'}/>
                        )}
                        {profileTag &&(
                            <MainAlgoliaSearch HitComponent={Card} resultsType={'profile'} profileTag={profileTag} />
                        )}
                    </Grid>
                </main>
            </div>
        );
    }
}

export default inject('commonStore', 'organisationStore', 'authStore', 'recordStore', 'userStore')(
    observer(
        withStyles(styles)(Search)
    )
);
