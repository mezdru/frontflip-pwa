import React from 'react'
import { withStyles, Button, Hidden, Typography } from '@material-ui/core';
import { inject, observer } from "mobx-react";
import classNames from 'classnames';
import { observe } from 'mobx';
import Wings from '../utils/wing/Wing';
import ProfileService from '../../services/profile.service';
import AlgoliaService from '../../services/algolia.service';
import defaultHashtagPicture from '../../resources/images/placeholder_hashtag.png';
import { styles } from './WingsSuggestion.css.js';
import { ArrowLeft, ArrowRight } from '@material-ui/icons';
import './WingsSuggestion.css';

let interval;
let interval2;

class WingsSuggestions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      suggestions: [],
      bank: [],
      renderComponent: false,
      shouldUpdate: false,
      observer: ()=> {}
    };
  }

  componentDidMount() {
    AlgoliaService.setAlgoliaKey(this.props.commonStore.algoliaKey);
    this.syncBank(null)
      .then(() => {
        this.initSuggestions()
          .then(() => { this.setState({ renderComponent: true }) })
      });

    this.setState({observer: observe(this.props.commonStore, 'algoliaKey', (change) => {
      AlgoliaService.setAlgoliaKey(this.props.commonStore.algoliaKey);
      this.syncBank(null)
        .then(() => {
          this.initSuggestions()
            .then(() => { this.setState({ renderComponent: true }) })
        });
    })});
  }

  componentWillUnmount() {
    this.state.observer();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({suggestions: []}, () => {
      this.syncBank(null)
      .then(() => {
        this.initSuggestions(nextProps.wingsFamily)
          .then(() => {})
      });
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log(nextState);
    if ( (nextState.shouldUpdate || (!this.state.renderComponent && nextState.renderComponent)) && !nextState.animationInProgress ) {
      this.setState({shouldUpdate: false});
      return true;
    }
    return false;
  }


  /**
   * @description Init Wings suggestions with most common Wings
   */
  initSuggestions = async (wingsFamily) => {
    if(!wingsFamily) {
      await this.fetchSuggestions(null, false, 5);
      await this.fetchSuggestions(null, true, 10);
      this.populateSuggestionsData();
      let query = this.formatHashtagsQuery();
      if (query)
        this.syncBank(query)
          .then(() => {
            this.populateSuggestionsData();
            this.setState({shouldUpdate: true});
          });
      else this.setState({shouldUpdate: true});
    } else {
      await this.fetchWingsFamily(wingsFamily);
    }

  }

  fetchWingsFamily = (wingsFamily) => {
    return AlgoliaService.fetchHits('type:hashtag AND hashtags.tag:'+wingsFamily, null, null, null)
    .then(content => {
      if(content) {
        this.setState({suggestions: content.hits});
      }
    }).catch();
  }

  /**
   * @description Fetch suggestions and add them to suggestions list thanks to Algolia
   */
  fetchSuggestions = (lastSelection, privateOnly, nbHitToAdd, startIndex) => {
    return AlgoliaService.fetchFacetValues(lastSelection, privateOnly, 'type:person', null)
      .then(content => {
        let suggestions = this.state.suggestions;
        content.facetHits = this.removeUserWings(content.facetHits);

        for (let i = 0; i < nbHitToAdd; i++) {
          if (content.facetHits.length === 0) break;

          let index = (i === 0 ? 0 : Math.floor(Math.random() * Math.floor(content.facetHits.length)));
          let suggestionToAdd = content.facetHits.splice(index, 1)[0];
          let knownIndex = suggestions.findIndex(hashtag => hashtag && (hashtag.tag === suggestionToAdd.value));

          if (knownIndex > -1 && (i > 0 || startIndex)) {
            i--;
            continue;
          } else if (i === 0 && knownIndex > -1 && !startIndex) {
            // elt known index is an important suggestion, we put it at the start of the array
            suggestions.splice(0, 0, suggestions.splice(knownIndex, 1)[0]);
            continue;
          }

          suggestionToAdd.tag = suggestionToAdd.value;
          suggestionToAdd.new = true;
          if(!startIndex) suggestions.push(suggestionToAdd);
          else suggestions.splice(startIndex, 0, suggestionToAdd);
        }
        this.setState({ suggestions: suggestions });
      }).catch((e) => { console.log(e) });
  }

  /**
   * @description Remove user Wings for Wings suggestions
   */
  removeUserWings = (suggestions) => {
    let suggestionsToReturn = suggestions;
    suggestions.forEach(suggestion => {
      try {
        if (this.props.recordStore.values.record.hashtags.findIndex(hashtag => hashtag.tag === suggestion.value) > -1) {
          let index = suggestionsToReturn.findIndex(sugInRet => sugInRet.value === suggestion.value);
          if (index > -1) suggestionsToReturn.splice(index, 1);
        }
      } catch (e) {
        return;
      }
    });
    return suggestionsToReturn;
  }

  /**
   * @description Fetch and add new suggestions after user choose a Wing
   * @param filters Record object selected
   * @param index Index of the object in the suggestions displayed list
   */
  updateSuggestions = async (filters, index) => {
    if(this.props.wingsFamily) return;
    await this.fetchSuggestions(null, false, 1, index);
    await this.fetchSuggestions(null, true, 2, index);
    await this.fetchSuggestions(filters, false, 2, index);
    await this.fetchSuggestions(filters, true, 2, index);
    this.populateSuggestionsData();
    let query = this.formatHashtagsQuery();
    if (query)
      this.syncBank(query)
        .then(() => {
          this.populateSuggestionsData();
          this.setState({shouldUpdate: true});
        });
    else this.setState({shouldUpdate: true});
  }

  /**
   * @description Get complete Wing data by tag thanks to current Wings bank
   */
  getData = (tag) => {
    if (this.state.bank)
      return this.state.bank.find(bankElt => bankElt.tag === tag);
    else
      return null;
  }

  /**
   * @description Populate all suggestions data thanks to current Wings bank
   */
  populateSuggestionsData = () => {
    let suggestions = this.state.suggestions;
    // eslint-disable-next-line
    this.state.suggestions.map((suggestion, i) => {
      suggestions[i] = this.getData(suggestion.tag) || suggestion;
    });
    this.setState({suggestions: suggestions});
  }

  /**
   * @description Sync wings bank with current state bank
   */
  syncBank = (filters) => AlgoliaService.loadBank(filters).then(() => {this.setState({bank: this.props.commonStore.getLocalStorage('wingsBank', true)})});

  /**
   * @description Format query to fetch missing Wings data with Algolia
   */
  formatHashtagsQuery = () => {
    let query = '';
    this.state.suggestions.forEach(suggestion => {
      if (!suggestion.objectID)
        query += (query !== '' ? ' OR' : '') + ' tag:' + suggestion.tag;
    });
    return query;
  }

  handleSelectSuggestion = (e, element, index) => {
    e.currentTarget.style.opacity = 0;
    e.currentTarget.style.background = this.props.theme.palette.secondary.dark;
    this.setState({animationInProgress: true}, () => {
      setTimeout(() => {this.setState({animationInProgress: false})}, 300);
    })
    this.props.handleAddWing(e, element).then(this.updateSuggestions(element, index));
  }

  shouldDisplaySuggestion = (tag) => (!this.props.recordStore.values.record.hashtags.some(hashtag => hashtag.tag === tag));

  getDisplayedName = (hit) => (hit.name_translated ? (hit.name_translated[this.state.locale] || hit.name_translated['en-UK']) || hit.name || hit.tag : hit.name || hit.tag);

  renderWing = (classes, hit, i) => {
    return (
      <li key={i} className={classes.suggestion} style={{animationDelay: (i*0.05) +'s'}}>
        <Wings  src={ProfileService.getPicturePath(hit.picture) || defaultHashtagPicture}
          label={ProfileService.htmlDecode(this.getDisplayedName(hit))}
          onClick={(e) => this.handleSelectSuggestion(e, { name: hit.name || hit.tag, tag: hit.tag }, i)}
          className={'suggestionWing'} />
      </li>
    );
  }

  renderWingsList = (suggestions, classes, isEven) => {
    return (
      <ul className={classNames(classes.suggestionList, "scrollX")}>
      {suggestions && suggestions.map((hit, i) => {
        return (hit && this.shouldDisplaySuggestion(hit.tag) && i%2 === (isEven ? 0 : 1)) ? this.renderWing(classes, hit, i) : null;
      })}
    </ul>
    );
  }



  scrollRight = () => {
    interval = window.setInterval(function() {
      window.document.getElementsByClassName('scrollable')[0].scrollLeft += 2;
    }, 5);
  }

  scrollLeft = () => {
    interval2 = window.setInterval(function() {
      window.document.getElementsByClassName('scrollable')[0].scrollLeft -= 2;
    }, 5);
  }

  scrollStop =() => {
    clearInterval(interval);
    clearInterval(interval2);
  }

  render() {
    const { classes } = this.props;
    const { suggestions, renderComponent } = this.state;

    if (!renderComponent) return null;

    return (
      <div>
        <Typography variant="h6" style={{padding: 16}} >Wings suggestions:</Typography>

        <div style={{position:'relative'}}>
        <Hidden smDown>
          <Button className={classNames(classes.scrollLeft, classes.scrollButton)} onMouseDown={this.scrollLeft} onMouseUp={this.scrollStop} variant="outlined">
            <ArrowLeft fontSize="inherit" />
          </Button>
          <Button className={classNames(classes.scrollRight, classes.scrollButton)} onMouseDown={this.scrollRight} onMouseUp={this.scrollStop} variant="outlined">
            <ArrowRight fontSize="inherit" />
          </Button>
        </Hidden>
        <div className={classes.transparentGradientBoxLeft}></div>
        <div className={classNames(classes.suggestionsContainer, 'scrollable')} >
          {this.renderWingsList(suggestions, classes, true)}
          {this.renderWingsList(suggestions, classes, false)}
        </div>
        <div className={classes.transparentGradientBoxRight}></div>
      </div>
      </div>
    );
  }
}

export default inject('commonStore', 'recordStore', 'organisationStore')(
  observer(
    withStyles(styles, {withTheme: true})(WingsSuggestions)
  )
);
