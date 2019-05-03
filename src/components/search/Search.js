import React from 'react';
import SearchField from './SearchField';
import SearchSuggestions from './SearchSuggestions';

class Search extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <>
        <SearchField />
        <SearchSuggestions />
      </>
    );
  }
}

export default Search;
