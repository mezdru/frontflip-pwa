import React, {PureComponent} from 'react';
import { injectIntl } from 'react-intl';
import { inject, observer } from 'mobx-react';
import { withTheme, withStyles } from '@material-ui/core';
import { observe } from 'mobx';
import { Clear } from '@material-ui/icons';
import IconButton from '@material-ui/core/IconButton';

import '../algolia/SearchField.css';
import ProfileService from '../../services/profile.service';
import Wing from '../utils/wing/Wing';
import withSearchManagement from '../../hoc/SearchManagement.hoc';
import { styles } from './SearchField.css';


class SearchField extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      searchInput: '',
      searchFilters: this.props.commonStore.getSearchFilters() || [],
      observer: () => { }
    };
  }

  componentDidMount() {
    this.setState({
      observer: observe(this.props.commonStore, 'searchFilters', (change) => {
        var currentSearchFilters = this.props.commonStore.getSearchFilters();
        this.setState({ searchFilters: currentSearchFilters, searchInput: (currentSearchFilters.length > 0 ? ' ' : '') }, () => {
          this.scrollToRight();
        });
      })
    });
  }

  componentWillUnmount() {
    this.state.observer();
  }

  async scrollToRight() {
    setTimeout(() => {
      let valueContainer = document.getElementById('search-filters-container');
      if (valueContainer) {
        valueContainer.scrollLeft = valueContainer.scrollWidth;
      }
    }, 100);
  }

  getSearchFieldPlaceholder = () => {
    if (this.props.hashtagOnly) {
      return this.props.intl.formatMessage({ id: 'algolia.onboard' });
    } else {
      let organisation = this.props.organisationStore.values.organisation;
      if(organisation.intro && organisation.intro[this.props.commonStore.locale] && organisation.intro[this.props.commonStore.locale] !== '') {
        return organisation.intro[this.props.commonStore.locale];
      }
      return this.props.intl.formatMessage({ id: 'algolia.search' }, { orgName: this.props.organisationStore.values.organisation.name });
    }
  }

  handleEnter = (e) => {
    if (e.key === 'Enter') {
      var value = e.target.value.trim();
      if(value) {
        this.props.addFilter({ name: value, tag: value });
        this.setState({ searchInput: ' ' });
      }
    }
  }

  handleInputChange = (inputValue) => {
    this.setState({ searchInput: inputValue });
    this.props.fetchAutocompleteSuggestions(inputValue);
  }

  render() {
    const { classes } = this.props;
    const { searchInput, searchFilters } = this.state;

    return (
      <div className={classes.searchContainer} id="search-container">

        <div className={classes.searchFiltersContainer} id="search-filters-container">
          {searchFilters && searchFilters.length > 0 && searchFilters.map((filter, index) => {
            let displayedName = ProfileService.getWingDisplayedName(filter, this.props.commonStore.locale);
            return (
              <Wing
                label={ProfileService.htmlDecode(displayedName)} key={index}
                onDelete={(e) => { this.props.removeFilter(filter) }}
                className={'highlighted'} />
            );
          })}

          <input
            type='text' name="searchInput"
            className={classes.searchInput}
            value={searchInput}
            placeholder={this.getSearchFieldPlaceholder()}
            onKeyDown={this.handleEnter}
            onChange={(e) => { this.handleInputChange(e.target.value) }}
            autoComplete="off"
          />
        </div>



        {(searchInput || (searchFilters && searchFilters.length > 0)) && (
          <IconButton className={classes.searchClear} onClick={this.props.resetFilters} >
            <Clear fontSize='inherit' />
          </IconButton>
        )}

      </div>
    );
  }
}

SearchField = withSearchManagement(SearchField);

export default inject('commonStore', 'recordStore', 'organisationStore')(
  observer(
    injectIntl(withTheme()(withStyles(styles, { withTheme: true })(SearchField)))
  )
);
