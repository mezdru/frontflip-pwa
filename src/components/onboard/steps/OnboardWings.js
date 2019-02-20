import React from 'react'
import { withStyles } from '@material-ui/core';
import { inject, observer } from "mobx-react";
import { observe } from 'mobx';
import SearchField from '../../algolia/SearchField';
import SearchSuggestions from '../../algolia/SearchSuggestions';
import algoliasearch  from 'algoliasearch';
import UserWings from '../../utils/wing/UserWings';

class OnboardWings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      algoliaClient: null,
      algoliaIndex: null,
    };
  }

  componentDidMount() {
    if(this.props.commonStore.algoliaKey)
      this.setState({algoliaClient: algoliasearch(process.env.REACT_APP_ALGOLIA_APPLICATION_ID, this.props.commonStore.algoliaKey)}, () => {
        this.setState({algoliaIndex: this.state.algoliaClient.initIndex('world')});
      });
    else if (this.props.organisationStore.values.organisation._id) 
      this.props.organisationStore.getAlgoliaKey();

    observe(this.props.commonStore, 'algoliaKey', (change) => {
      if(this.props.commonStore.algoliaKey)
        this.setState({algoliaClient: algoliasearch(process.env.REACT_APP_ALGOLIA_APPLICATION_ID, this.props.commonStore.algoliaKey)}, () => {
          this.setState({algoliaIndex: this.state.algoliaClient.initIndex('world')});
        });
      else {
        this.setState({algoliaClient: null});
      }
    });
  }

  handleAddWing = (e, element) => {
    e.preventDefault();
    this.props.recordStore.setRecordTag(element.tag.replace('#', '%23'));
    this.props.recordStore.getRecordByTag()
    .then(hashtagRecord => {
      let record = this.props.recordStore.values.record;
      record.hashtags.push(hashtagRecord);
      this.props.recordStore.setRecord(record);
      this.props.handleSave();
    });
  }

  render() {
    const {record} = this.props.recordStore.values;
    const {algoliaIndex} = this.state;

    console.log(record);

    if(!algoliaIndex) return null;

    return (
      <div>
        This is wings component
        <SearchField index={algoliaIndex} />
        <SearchSuggestions index={algoliaIndex} addToFilters={this.handleAddWing} filters={''} query={''} />
        <UserWings />
      </div>
    );
  }
}

export default inject('commonStore', 'recordStore', 'organisationStore')(
  observer(
    withStyles(null)(OnboardWings)
  )
);
