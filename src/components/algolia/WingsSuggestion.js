import React from 'react'
import { withStyles } from '@material-ui/core';
import { inject, observer } from "mobx-react";
import classNames from 'classnames';

import Wings from '../utils/wing/Wing';
import ProfileService from '../../services/profile.service';
import AlgoliaService from '../../services/algolia.service';
import defaultHashtagPicture from '../../resources/images/placeholder_hashtag.png';
import {styles} from './WingsSuggestion.css';

class WingsSuggestions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      suggestions: [],
      bank: []
    };
  }

  componentDidMount() {
    this.syncBank(null)
    .then(() => {
      this.initSuggestions();
    });
  }

  /**
   * @description Init Wings suggestions with most common Wings
   */
  initSuggestions = async () => {
    await this.fetchSuggestions(null, false, 10);
    await this.fetchSuggestions(null, true, 20);
    this.populateSuggestionsData();
    let query = this.formatHashtagsQuery();
    if(query)
      this.syncBank(query)
      .then(() => {
        this.populateSuggestionsData();
      });
  }

  /**
   * @description Fetch suggestions and add them to suggestions list thanks to Algolia
   */
  fetchSuggestions = (lastSelection, privateOnly, nbHitToAdd) => {
    return AlgoliaService.fetchFacetValues(lastSelection, privateOnly)
    .then(content => {
      let newSuggestions = [];
      let suggestions = this.state.suggestions;
      content.facetHits = this.removeUserWings(content.facetHits);

      for(let i = 0; i < nbHitToAdd; i++) {
        if(content.facetHits.length === 0) break;

        let index = (i === 0 ? 0 : Math.floor(Math.random() * Math.floor(content.facetHits.length)));
        let suggestionToAdd = content.facetHits.splice(index, 1)[0];
        let knownIndex = suggestions.findIndex(hashtag => hashtag && (hashtag.tag === suggestionToAdd.value));

        if( knownIndex > -1 && i > 0){
          i--;
          continue;
        } else if(i === 0 && knownIndex > -1) {
          // elt known index is an important suggestion, we put it at the start of the array
          suggestions.splice(0,0,suggestions.splice(knownIndex,1)[0]);
          continue;
        }

        suggestionToAdd.tag = suggestionToAdd.value;
        newSuggestions.push(suggestionToAdd);
      }
      this.setState({suggestions: suggestions.concat(newSuggestions)});
    }).catch((e) => {console.log(e)});
  }

  /**
   * @description Remove user Wings for Wings suggestions
   */
  removeUserWings = (suggestions) => {
    let suggestionsToReturn = suggestions;
    suggestions.forEach(suggestion => {
      if(this.props.recordStore.values.record.hashtags.findIndex(hashtag => hashtag.tag === suggestion.value) > -1) {
        let index = suggestionsToReturn.findIndex(sugInRet => sugInRet.value === suggestion.value);
        if(index > -1) suggestionsToReturn.splice(index, 1);
      }
    });
    return suggestionsToReturn;
  } 

  /**
   * @description Fetch and add new suggestions after user choose a Wing
   */
  updateSuggestions = async (filters) => {
    await this.fetchSuggestions(null, false, 1);
    await this.fetchSuggestions(null, true, 2);
    await this.fetchSuggestions(filters, false, 2);
    await this.fetchSuggestions(filters, true, 2);
    this.populateSuggestionsData();
    let query = this.formatHashtagsQuery();
    if(query)
      this.syncBank(query)
      .then(() => {
        this.populateSuggestionsData();
      });
  }

  /**
   * @description Get complete Wing data by tag thanks to current Wings bank
   */
  getData = (tag) => this.state.bank.find(bankElt => bankElt.tag === tag);

  /**
   * @description Populate all suggestions data thanks to current Wings bank
   */
  populateSuggestionsData = () => {
    let suggestions = this.state.suggestions;
    this.state.suggestions.map((suggestion, i) => {
      suggestions[i] = this.getData(suggestion.tag) || suggestion;
    });
    this.setState({suggestions: suggestions});
  }

  /**
   * @description Sync wings bank with current state bank
   */
  syncBank = (filters) => AlgoliaService.loadBank(filters).then(this.setState({bank : this.props.commonStore.getLocalStorage('wingsBank', true)}));

  /**
   * @description Format query to fetch missing Wings data with Algolia
   */
  formatHashtagsQuery = () => {
    let query = '';
    this.state.suggestions.forEach(suggestion => {
      if(!suggestion.objectID)
        query += (query !== '' ? ' OR' : '') + ' tag:'+suggestion.tag;
    });
    return query;
  }

  handleSelectSuggestion = (e, element) => {
    this.updateSuggestions(element);
    this.props.handleAddWing(e, element);
  }

  shouldDisplaySuggestion = (tag) => (!this.props.recordStore.values.record.hashtags.some(hashtag => hashtag.tag === tag));

  getDisplayedName = (hit) => (hit.name_translated ? (hit.name_translated[this.state.locale] || hit.name_translated['en-UK']) || hit.name || hit.tag : hit.name || hit.tag);

  renderWing = (classes, hit, i) => {
    return (
      <li key={i} className={classes.suggestion} style={{animationDelay: (i*0.05) +'s'}}>
        <Wings  src={ProfileService.getPicturePath(hit.picture) || defaultHashtagPicture}
          label={ProfileService.htmlDecode(this.getDisplayedName(hit))}
          onClick={(e) => this.handleSelectSuggestion(e, { name: hit.name || hit.tag, tag: hit.tag })} />
      </li>
    );
  }

  render() {
    const {classes} = this.props;
    const {suggestions} = this.state;

    return (
      <div className={classes.suggestionsContainer} >
        <ul className={classNames(classes.suggestionList, "scrollX")}>
          {suggestions && suggestions.map((hit, i) => {
            return (hit && this.shouldDisplaySuggestion(hit.tag) && i%2 === 0) ? this.renderWing(classes, hit, i) : null;
          })}
        </ul>

        <ul className={classNames(classes.suggestionList, "scrollX")}>
          {suggestions.map((hit, i) => {
            return (hit && this.shouldDisplaySuggestion(hit.tag) && i%2 === 1) ? this.renderWing(classes, hit, i) : null;
          })}
        </ul>
      </div>
    );
  }
}

export default inject('commonStore', 'recordStore', 'organisationStore')(
  observer(
    withStyles(styles)(WingsSuggestions)
  )
);
