import React from 'react'
import {Grid, withStyles} from '@material-ui/core';
import Banner from '../components/utils/banner/Banner';
import Card from '../components/card/CardProfile';
import AutocompleteSearch from '../components/algolia/AutocompleteSearch';
import {inject, observer} from "mobx-react";

const styles = {
    stickyComponent: {
        // position: "sticky",
        // top: 3,
        zIndex: 2,
    },
    searchBanner: {
        position: 'absolute',
        transition: 'opacity 0.8s',
        filter: 'blur(1px)'
    }
};

class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bannerOpacity: 1,
        };
    }
    
    componentDidMount = () => {
        window.addEventListener('scroll', this.onScroll, false);

        if(this.props.match.params.organisationTag && this.props.match.params.organisationTag !== this.props.organisationStore.values.orgTag) {
            this.props.organisationStore.setOrgTag(this.props.match.params.organisationTag);
            this.props.organisationStore.getOrganisationForPublic();
        }
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
                bannerOpacity: 1
            });
        }
    };
    
    render() {
        
        return (
            <Grid container direction={'column'} alignItems={'center'}>
                <Grid container item alignItems={"stretch"} className={this.props.classes.searchBanner} style={{opacity: this.state.bannerOpacity}}>
                    <Banner />
                </Grid>
                <AutocompleteSearch HitComponent={Card} resultsType={'person'}/>
            </Grid>
        );
    }
}

export default inject('commonStore', 'organisationStore')(
    observer(
        withStyles(styles)(Search)
    )
);
