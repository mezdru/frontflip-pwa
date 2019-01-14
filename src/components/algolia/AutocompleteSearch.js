import { CircularProgress, withStyles, Grid } from "@material-ui/core";
import React, { Component } from 'react';
import {inject, observer} from "mobx-react";
import { InstantSearch, Hits, Configure } from "react-instantsearch-dom";
import MaterialSearchBox from "./MaterialSearchBox";
import { observe, autorun } from 'mobx';

const styles = theme => ({
    hitList: {
        position: 'absolute',
        top: 166,
        [theme.breakpoints.up('md')]: {
            top: 350,
        },
        width: '100%',
        '& ul': {
            listStyleType: 'none',
            padding:0,
            marginTop: '32px',
            marginBottom: '32px',
        },
        '& ul li': {
            marginBottom: '32px'
        },
        '& ul li > div:first-child' : {
            position: 'relative',
            left: '0',
            right: '0',
            margin: 'auto'
        }
    },
    fullWidth: {
        width: '100%'
    },
    searchBar: {
        position: 'sticky',
        top: 147,
        transition: 'top .8s',
        transform: 'translateY(-50%)',
        [theme.breakpoints.up('md')]: {
            // top: 239,
            top:0,
        },
        left: 0,
        right: 0,
        margin: 'auto',
        zIndex: 4
    },
    whiteBackground: {
        background: 'white'
    }
});

class AutocompleteSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            algoliaKey: null,
            filters: 'type:person',
            refresh: false,
            newFilter: {},
            searchBarTop: null
        }
        this.updateFilters = this.updateFilters.bind(this);
        this.addToFilters = this.addToFilters.bind(this);
        this.onScroll = this.onScroll.bind(this);
    }

    componentDidMount() {

        window.addEventListener('scroll', this.onScroll, false);

        observe(this.props.organisationStore.values, 'organisation', (change) => {
            if(this.props.organisationStore.values.organisation._id){
                this.props.organisationStore.getAlgoliaKey()
                .then((algoliaKey) => {
                    this.setState({algoliaKey: algoliaKey});
                }).catch((err) => {
                    // window.location.href = UrlService.createUrl(window.location.host, '/', undefined);
                });
            }
        });
    }
    
    onScroll() {
        // if (window.scrollY > 0) {
        //     this.setState({
        //         searchBarTop: 95
        //     });
        // }else if(window.scrollY === 0) {
        //     this.setState({
        //         searchBarTop: null
        //     });
        // }
    }

    updateFilters(selectedOptions) {
        let newFilters = 'type:person';
        selectedOptions.forEach(option => {
            if(option.value.charAt(0) === '#'){
                newFilters += ' AND hashtags.tag:'+option.value;
            }else if(option.value.charAt(0) === '@'){
                newFilters += ' AND tag:'+option.value;
            }
        });
        this.setState({filters: newFilters, newFilter: {}});
    }

    addToFilters(e, element) {
        e.preventDefault();
        this.setState({newFilter: {label: element.name, value: element.tag}});
    }

    render() {
        const {locale} = this.props.commonStore;
        const {algoliaKey, filters, newFilter, searchBarTop} = this.state;
        const { HitComponent, classes, resultsType } = this.props;

        if(algoliaKey) {
            return(
                <div className={classes.fullWidth}>
                    {/* Search bar */}
                    <InstantSearch  appId={process.env.REACT_APP_ALGOLIA_APPLICATION_ID} 
                                    indexName={process.env.REACT_APP_ALGOLIA_INDEX} 
                                    apiKey={algoliaKey} >
                <Grid container item className={classes.searchBar} xs={12} sm={6} alignItems={'center'} >
                        <MaterialSearchBox updateFilters={this.updateFilters} newFilter={newFilter}/>
                </Grid>
                
                    </InstantSearch>

                    {/* Search results */}
                    {resultsType === 'person' && (
                        <InstantSearch  appId={process.env.REACT_APP_ALGOLIA_APPLICATION_ID} 
                                        indexName={process.env.REACT_APP_ALGOLIA_INDEX} 
                                        apiKey={algoliaKey}>
                            <Configure filters={filters} />
                            {HitComponent &&  (
                                <Hits 
                                    hitComponent={hit => <HitComponent hit={hit.hit} addToFilters={this.addToFilters} />}
                                    className={classes.hitList}/>
                            )}
                            { !HitComponent && (
                                <Hits className={classes.hitList}/>
                            )}
                        </InstantSearch>
                    )}


                </div>
            )
        }else{
            return(
                <CircularProgress color="primary"/>
            )
        }


    }
}

export default inject('commonStore', 'organisationStore')(
    observer(
        withStyles(styles)(AutocompleteSearch)
        )
);
