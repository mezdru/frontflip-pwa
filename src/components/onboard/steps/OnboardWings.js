import React from 'react'
import { withStyles } from '@material-ui/core';
import { inject, observer } from "mobx-react";
import { observe } from 'mobx';
import SearchField from '../../algolia/SearchField';
import algoliasearch  from 'algoliasearch';
import UserWings from '../../utils/wing/UserWings';
import WingsSuggestion from '../../algolia/WingsSuggestion';

class OnboardWings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      algoliaClient: null,
      algoliaIndex: null,
      lastSelection: null,
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
    return this.props.recordStore.getRecordByTag()
    .then(hashtagRecord => {
      let record = this.props.recordStore.values.record;
      record.hashtags.push(hashtagRecord);
      this.props.recordStore.setRecord(record);
      this.props.handleSave();
    }).catch(() => {});
  }

  handleRemoveWing = (e, tag) => {
    e.preventDefault();
    let record = this.props.recordStore.values.record;
    let newHashtags = record.hashtags.filter(hashtag => hashtag.tag !== tag);
    record.hashtags = newHashtags;
    this.props.recordStore.setRecord(record);
    this.props.handleSave();
  }

  render() {
    const {record} = this.props.recordStore.values;
    const {algoliaIndex} = this.state;

    if(!algoliaIndex) return null;

    return (
      <div>
        <div style={{background: '#f2f2f2', boxShadow: ''}}>
          This is wings component
          <SearchField index={algoliaIndex} />
          <WingsSuggestion index={algoliaIndex} handleAddWing={this.handleAddWing} />
        </div>
        <UserWings handleRemoveWing={this.handleRemoveWing} />
      </div>
    );
  }
}

export default inject('commonStore', 'recordStore', 'organisationStore')(
  observer(
    withStyles(null)(OnboardWings)
  )
);
