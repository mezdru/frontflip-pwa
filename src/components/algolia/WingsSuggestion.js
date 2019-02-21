import React from 'react'
import { withStyles, Chip } from '@material-ui/core';
import { inject, observer } from "mobx-react";
import classNames from 'classnames';

import Wings from '../utils/wing/Wing';
import ProfileService from '../../services/profile.service';
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
    };
  }

  componentDidMount() {
    this.loadBank(null)
    .then(() => {
      this.updateSuggestions(null);
    });
  }

  updateSuggestions = (filters) => {
    return new Promise((resolve, reject) => {
      this.loadMostCommonSuggestions(filters)
      .then(() => {
        this.populateSuggestion();
        let query = this.formatHashtagsQuery();
        if(query)
          this.loadBank(query)
          .then(() => {
            this.populateSuggestion();
            resolve();
          });
        else
          resolve();
      });
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

  loadMostCommonSuggestions = (lastSelection) => {
    return new Promise((resolve, reject) => {
      this.props.index.searchForFacetValues({
        facetName: 'hashtags.tag',
        query: '',
        facetQuery: '',
        filters: '',
        facetFilters: (lastSelection ? ['hashtags.tag:'+lastSelection.tag] : []),
      }, (err, res) => {
        if(!err) {
          let suggestions = this.state.suggestions;
          res.facetHits.forEach(suggestion => {
            suggestion.tag = suggestion.value;
            if(!suggestions.some(hashtag => hashtag.tag === suggestion.tag)) {
              suggestions.push(suggestion);
            }
          });
          
          this.setState({suggestions: suggestions}, resolve());
        }
      });
    });
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
