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
        transition: 'opacity 0.8s',
        filter: 'blur(.5px)'
    }
};

class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bannerOpacity: 0.8,
            redirectTo: null,
            locale: this.props.commonStore.getCookie('locale') || this.props.commonStore.locale,
            profileTag: (this.props.match && this.props.match.params && this.props.match.params.profileTag) ? this.props.match.params.profileTag : null
        };
    }
    
    componentDidMount = () => {
        this.props.commonStore.setSearchFilters([]);
        window.addEventListener('scroll', this.onScroll, false);   
    };
    
    componentWillUnmount = () => {
        window.removeEventListener('scroll', this.onScroll, false);
    };
    
    onScroll = () => {
        if (window.scrollY > 65) {
            this.setState({
                bannerOpacity: 0
            });
        } else {
            this.setState({
                bannerOpacity: 0.8
            });
        }
    };
    
    render() {
        const {redirectTo, profileTag} = this.state;

        if(redirectTo) return (<Redirect to={redirectTo} />);
        
        return (
            <div>
                <Header />
                <main>
                    <Grid container direction={'column'} alignItems={'center'}>
                        <Grid container item alignItems={"stretch"} className={this.props.classes.searchBanner} style={{opacity: this.state.bannerOpacity}}>
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
