import React from 'react';
import SearchField from './SearchField';
import SearchSuggestions from './SearchSuggestions';

class Search extends React.Component {
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

  }

  render() {
    const {autocompleteSuggestions} = this.state;

    return(
      <>
        <SearchField fetchAutocompleteSuggestions={this.fetchAutocompleteSuggestions} />
        <SearchSuggestions autocompleteSuggestions={autocompleteSuggestions} />
      </>
    );
  }
}

export default Search;
