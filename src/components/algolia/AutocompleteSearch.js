import { TextField, CircularProgress, withStyles } from "@material-ui/core";
import React, { Component } from 'react';
import {FormattedMessage} from 'react-intl';
import {inject, observer} from "mobx-react";
import { InstantSearch, Hits, Configure } from "react-instantsearch-dom";
import MaterialSearchBox from "./MaterialSearchBox";
import UrlService from '../../services/url.service';
import { observe } from 'mobx';

const styles = {
    hitList: {
        width: '100%',
        '& ul': {
            listStyleType: 'none',
            padding:0
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
    }
};

class AutocompleteSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            algoliaKey: null,
            filters: 'type:person',
            refresh: false
        }
        this.updateFilters = this.updateFilters.bind(this);
    }

    componentDidMount() {
        // Observe organisation value, if populated, we can try to fetch Algolia Api key.
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

    updateFilters(selectedOptions) {
        let newFilters = 'type:person';
        selectedOptions.forEach(option => {
            if(option.value.charAt(0) === '#'){
                newFilters += ' AND hashtags.tag:'+option.value;
            }else if(option.value.charAt(0) === '@'){
                newFilters += ' AND tag:'+option.value;
            }
        });
        this.setState({filters: newFilters});
    }

    render() {
        const {locale} = this.props.commonStore;
        const {algoliaKey, filters} = this.state;
        const { hitComponent, classes, resultsType } = this.props;

        if(algoliaKey) {
            return(
                <div className={classes.fullWidth}>
                    {/* Search bar */}
                    <InstantSearch appId={process.env.REACT_APP_ALGOLIA_APPLICATION_ID} 
                                    indexName={process.env.REACT_APP_ALGOLIA_INDEX} 
                                    apiKey={algoliaKey} >
                        <MaterialSearchBox updateFilters={this.updateFilters}/>
                    </InstantSearch>

                    {/* Search results */}
                    {resultsType === 'person' && (
                        <InstantSearch  appId={process.env.REACT_APP_ALGOLIA_APPLICATION_ID} 
                                        indexName={process.env.REACT_APP_ALGOLIA_INDEX} 
                                        apiKey={algoliaKey}>
                            <Configure filters={filters} />
                            {hitComponent &&  (
                                <Hits hitComponent={hitComponent} className={classes.hitList}/>
                            )}
                            { !hitComponent && (
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
