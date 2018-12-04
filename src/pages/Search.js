import React from 'react'

import {Grid} from '@material-ui/core';
import SearchField from '../components/algolia/SearchField';
import Card from '../components/card/CardProfile'

export class Search extends React.Component {
    
    render() {
        return (
            <div>
                <Grid container direction={'column'} alignItems={'center'}>
                    <SearchField/>
                    <Card/>
                </Grid>
            </div>
        );
    }
}
