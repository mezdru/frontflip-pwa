import React, {PureComponent} from 'react';
import SearchField from './SearchField';
import SearchSuggestions from './SearchSuggestions';
import AlgoliaService from '../../services/algolia.service';
import OnboardSuggestions from './OnboardSuggestions';

class Search extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      autocompleteSuggestions: [],
      userQuery: ''
    }
  }

  /**
   * @description Fetch current suggestions related to the user input.
   */
  fetchAutocompleteSuggestions = (input) => {
    AlgoliaService.fetchOptions(input, false, false)
    .then(options => {
      this.setState({autocompleteSuggestions: options.hits});
    });
  }

  updateUserQuery = (userQuery) => {
    this.setState({userQuery: userQuery});
  }

  render() {
    const {autocompleteSuggestions, userQuery} = this.state;
    const {onSelect, mode, max, wingsFamily} = this.props;
    
    return(
      <>
        <SearchField 
          fetchAutocompleteSuggestions={this.fetchAutocompleteSuggestions} 
          updateUserQuery={this.updateUserQuery} 
        />
        {mode !== 'onboard' ? (
          <SearchSuggestions autocompleteSuggestions={autocompleteSuggestions} />
        ): (
          <OnboardSuggestions userQuery={userQuery} max={max} onSelect={onSelect} wingsFamily={wingsFamily} />
        )}
      </>
    );
  }
}

export default Search;
