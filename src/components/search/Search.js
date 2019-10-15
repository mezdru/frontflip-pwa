import React, {PureComponent} from 'react';
import SearchField from './SearchField';
import SearchSuggestions from './SearchSuggestions';
import AlgoliaService from '../../services/algolia.service';
import OnboardSuggestions from './OnboardSuggestions';

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
    const {onSelect, mode, max, wingsFamily, edit} = this.props;
    return(
      <>
        <SearchField 
          fetchAutocompleteSuggestions={this.fetchAutocompleteSuggestions} 
          mode={mode} handleCreateWing={this.props.handleCreateWing}
        />
        {mode !== 'onboard' ? (
          <SearchSuggestions autocompleteSuggestions={autocompleteSuggestions} />
        ): (
          <OnboardSuggestions max={max} onSelect={onSelect} wingsFamily={wingsFamily} handleCreateWing={this.props.handleCreateWing} edit={edit} />
        )}
      </>
    );
  }
}

export default Search;
