import React from 'react'
import { withStyles, Chip } from '@material-ui/core';
import { inject, observer } from "mobx-react";
import classNames from 'classnames';

import Wings from '../utils/wing/Wing';
import ProfileService from '../../services/profile.service';
import AlgoliaService from '../../services/algolia.service';
import defaultHashtagPicture from '../../resources/images/placeholder_hashtag.png';

const styles = theme => ({
  suggestionsContainer: {
    textAlign: 'left',
    overflow: 'hidden',
    margin: '8px 0px',
    marginLeft: '-8px',
    overflowX: 'scroll',
  },
  suggestionList: {
    whiteSpace: 'nowrap',
    padding: 0,
    listStyleType: 'none',
    '& li ': {
      display: 'inline-block',
    }
  },
  suggestion: {
    margin: 8,
    color: theme.palette.secondary.dark,
    opacity: 0,
    animation: 'easeIn .6s',
    animationFillMode: 'forwards',
  },
  '@keyframes easeIn': {
    from: { opacity: 0 },
    to: { opacity: 1 }
  },
});

class WingsSuggestions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      suggestions: [],
      bank: [],
      algoliaService: new AlgoliaService(this.props.commonStore.algoliaKey)
    };
  }

  componentDidMount() {
    this.loadBank(null)
    .then(() => {
      this.initAllSuggestions();
    });
  }

  initAllSuggestions = async () => {
    await this.fetchSuggestions(null, false, 10);
    await this.fetchSuggestions(null, true, 20);
    this.populateSuggestion();
    let query = this.formatHashtagsQuery();
    if(query)
      this.loadBank(query)
      .then(() => {
        this.populateSuggestion();
      });
  }

  fetchSuggestions = (lastSelection, privateOnly, nbHitToAdd) => {
    return this.state.algoliaService.fetchFacetValues(lastSelection, privateOnly)
    .then(content => {
      let newSuggestions = [];
      let suggestions = this.state.suggestions;
      content.facetHits = this.cleanAlgoliaSuggestions(content.facetHits);

      for(let i = 0; i < nbHitToAdd; i++) {
        if(content.facetHits.length === 0) break;

        let index = (i === 0 ? 0 : Math.floor(Math.random() * Math.floor(content.facetHits.length)));
        let suggestionToAdd = content.facetHits.splice(index, 1)[0];
        let knownIndex = suggestions.findIndex(hashtag => hashtag && (hashtag.tag === suggestionToAdd.value));

        if( knownIndex > -1 && i > 0){
          i--;
          continue;
        } else if(i === 0 && knownIndex > -1) {
          suggestions.splice(0,0,suggestions.splice(knownIndex,1)[0]);
          continue;
        }

        suggestionToAdd.tag = suggestionToAdd.value;
        newSuggestions.push(suggestionToAdd);
      }
      this.setState({suggestions: suggestions.concat(newSuggestions)});
    }).catch((e) => {console.log(e)});
  }

  cleanAlgoliaSuggestions = (suggestions) => {
    let suggestionsToReturn = suggestions;
    suggestions.forEach(suggestion => {
      if(this.props.recordStore.values.record.hashtags.findIndex(hashtag => hashtag.tag === suggestion.value) > -1) {
        let index = suggestionsToReturn.findIndex(sugInRet => sugInRet.value === suggestion.value);
        if(index > -1) suggestionsToReturn.splice(index, 1);
      }
    });
    return suggestionsToReturn;
  } 

  updateSuggestions = async (filters) => {
    await this.fetchSuggestions(null, false, 1);
    await this.fetchSuggestions(null, true, 2);
    await this.fetchSuggestions(filters, false, 2);
    await this.fetchSuggestions(filters, true, 2);
    this.populateSuggestion();
    let query = this.formatHashtagsQuery();
    if(query)
      this.loadBank(query)
      .then(() => {
        this.populateSuggestion();
      });
  }

  getData = (tag) => this.state.bank.find(bankElt => bankElt.tag === tag);

  populateSuggestion = () => {
    let suggestions = this.state.suggestions;
    this.state.suggestions.map((suggestion, i) => {
      suggestions[i] = this.getData(suggestion.tag) || suggestion;
    });
    this.setState({suggestions: suggestions});
  }

  loadBank = (filters) => {
    return new Promise((resolve, reject) => {
      if(!filters && this.props.commonStore.getLocalStorage('wingsBank', true)) {
        this.setState({bank : this.props.commonStore.getLocalStorage('wingsBank', true)}, resolve());
      } else {
        this.props.index.search({
          filters: (filters ? 'type:hashtag AND ' + filters : 'type:hashtag'),
          hitsPerPage: 10
        }, (err, content) => {
          this.addToLocalStorage(content.hits);
          this.setState({bank: content.hits}, resolve());
        });
      }
    });
  }

  addToLocalStorage = (hits) => {
    let currentBank = this.props.commonStore.getLocalStorage('wingsBank', true) || [];
    hits.forEach(hit => {
      if(!currentBank.some(bankElt => bankElt.tag === hit.tag))
        currentBank.push(hit);
    });
    this.props.commonStore.setLocalStorage('wingsBank', currentBank, true);
  }

  loadFamilySuggestions = async (lastSelection) => {
  }

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

  scrollToRight() {
    setTimeout(() => {
      let valueContainer = document.querySelector('.scrollX');
      if(valueContainer){
        valueContainer.scrollTo(valueContainer.scrollWidth, 0);
      } 
    }, 500);    
  }

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
