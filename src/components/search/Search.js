import React from 'react';
import { inject, observer } from "mobx-react";
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

export default inject('commonStore')(
  observer(
    Search
  )
);
