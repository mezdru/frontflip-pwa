import React, {PureComponent} from 'react';
import SearchField from './SearchField';
import SearchSuggestions from './SearchSuggestions';
import AlgoliaService from '../../services/algolia.service';

class Search extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      autocompleteSuggestions: []
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

  render() {
    const {autocompleteSuggestions} = this.state;
    const {onSelect, mode} = this.props;

    return(
      <>
        <SearchField fetchAutocompleteSuggestions={this.fetchAutocompleteSuggestions} />
        <SearchSuggestions autocompleteSuggestions={autocompleteSuggestions} onSelect={onSelect} mode={mode} />
      </>
    );
  }
}

export default Search;
