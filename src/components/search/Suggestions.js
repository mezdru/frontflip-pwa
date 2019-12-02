import React from 'react';
import PropTypes from 'prop-types';
import Wings from '../utils/wing/Wings';
import { withStyles, Chip, Hidden, IconButton } from '@material-ui/core';
import AlgoliaService from '../../services/algolia.service';
import { inject, observer } from 'mobx-react';
import { observe } from 'mobx';
import withSearchManagement from '../../hoc/SearchManagement.hoc';
import SuggestionsService from '../../services/suggestions.service';
import ProfileService from '../../services/profile.service';
import { ArrowLeft, ArrowRight } from '@material-ui/icons';
import withScrollManagement from '../../hoc/ScrollManagement.hoc';
import classNames from 'classnames';
import { getUnique } from '../../services/utils.service';
import undefsafe from 'undefsafe';
import {styles} from './Suggestions.css';

class Suggestions extends React.Component {

  fetchSimpleSuggestions = async (filters, query) => {
    let algoliaRes = await AlgoliaService.fetchFacetValues(null, false, filters, query).catch(e => null);
    if(!algoliaRes) return;

    let resultsHits = await SuggestionsService.upgradeData(algoliaRes.facetHits);
    let resultsHitsFiltered = resultsHits.filter(elt => !this.state.firstWings.some(fWing => fWing.tag === (elt.tag || elt.value)) );
    if(resultsHitsFiltered.length > 15) resultsHits = resultsHitsFiltered;
    resultsHits = SuggestionsService.removeHiddenWings(resultsHits);

    this.props.resetScroll("search-suggestions-container"); // nothing to do here
    this.setState({ facetHits: getUnique(resultsHits.splice(0, 20), "tag"), shouldUpdate: true });
  }

  fetchComplexeSuggestions = async (lastSelected, wingsFamily, includeLastSelected) => {
    if (lastSelected && lastSelected.tag) this.fetchSuggestionsAfterSelectInProgress = false;
    if (this.fetchSuggestionsAfterSelectInProgress) return;
    let suggestions = await SuggestionsService.getSuggestions(lastSelected, this.props.searchStore.values.userQuery || '', wingsFamily);
    if (lastSelected && !includeLastSelected) suggestions = suggestions.filter(suggestion => suggestion.tag !== lastSelected.tag);
    if (this.isUnmount) return;
    this.setState({ suggestions: getUnique(suggestions, "tag"), lastSelected: (includeLastSelected ? {} : this.state.lastSelected) });
  }

  onCreate = () => {
    this.props.onCreate({ name: this.props.searchStore.values.userQuery });
    this.props.searchStore.setUserQuery('');
  }

  render() {
    return (
      <></>
    )
  }

}

Suggestions.propTypes = {
  max: PropTypes.number,
  direction: PropTypes.oneOf(['horizontal', 'vertical']),
  mode: PropTypes.oneOf(['simple', 'complexe']),
  suggestions: PropTypes.array,
  exclude: PropTypes.array,
  onSelect: PropTypes.func,
  onCreate: PropTypes.func
}

export default inject('commonStore', 'recordStore', 'searchStore')(
  observer(withStyles(styles)(injectIntl(Suggestions)))
);
