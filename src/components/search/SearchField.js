import React, { PureComponent } from 'react';
import { injectIntl } from 'react-intl';
import { inject, observer } from 'mobx-react';
import { withTheme, withStyles } from '@material-ui/core';
import { observe } from 'mobx';
import { Clear } from '@material-ui/icons';
import IconButton from '@material-ui/core/IconButton';

import './SearchFieldStyle.css';
import ProfileService from '../../services/profile.service';
import Wings from '../utils/wing/Wings';
import withSearchManagement from '../../hoc/SearchManagement.hoc';
import { styles } from './SearchField.css';


class SearchField extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      searchFilters: this.props.commonStore.getSearchFilters() || []
    };
  }

  componentDidMount() {
    this.unsubscribeSearchFilters = observe(this.props.commonStore, 'searchFilters', (change) => {
      var currentSearchFilters = this.props.commonStore.getSearchFilters();
      this.props.searchStore.setUserQuery(currentSearchFilters.length > 0 ? ' ' : '');
      this.setState({ searchFilters: currentSearchFilters }, this.scrollToRight);
    });

    this.unsubscribeUserQuery = observe(this.props.searchStore.values, 'userQuery', (change) => {this.forceUpdate()});
  }

  componentWillUnmount() {
    this.unsubscribeSearchFilters();
    this.unsubscribeUserQuery();
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
      if (organisation.intro && organisation.intro[this.props.commonStore.locale] && organisation.intro[this.props.commonStore.locale] !== '') {
        return organisation.intro[this.props.commonStore.locale];
      }
      return this.props.intl.formatMessage({ id: 'algolia.search' }, { orgName: this.props.organisationStore.values.organisation.name });
    }
  }

  handleEnter = (e) => {
    if (e.key === 'Enter') {
      var value = e.target.value.trim();
      this.props.searchStore.setUserQuery('');
      if (this.props.mode !== 'onboard') {
        if (value) {
          this.props.addFilter({ name: value, tag: value });
        }
      } else {
        if (value) {
          this.props.handleCreateWing({ name: value });
        }
      }
      e.target.value = '';
    }
  }

  handleInputChange = (inputValue) => {
    this.props.searchStore.setUserQuery(inputValue);
    if (this.props.mode !== 'onboard')
      this.props.fetchAutocompleteSuggestions(inputValue);
  }

  reset = () => {
    this.props.searchStore.reset();
    this.props.resetFilters();
    this.forceUpdate();
  }

  render() {
    const { classes } = this.props;
    let { userQuery } = this.props.searchStore.values;
    const { searchFilters } = this.state;

    return (
      <div className={classes.searchContainer} id="search-container">

        <div className={classes.searchFiltersContainer} id="search-filters-container">
          {searchFilters && searchFilters.length > 0 && searchFilters.map((filter, index) => {
            let displayedName = ProfileService.getWingDisplayedName(filter, this.props.commonStore.locale);
            return (
              <Wings
                label={ProfileService.htmlDecode(displayedName)} key={index}
                onDelete={(e) => { this.props.removeFilter(filter) }}
                mode="highlight"
                className={'highlighted'} />
            );
          })}

          <input
            type='text' name="searchInput"
            className={classes.searchInput}
            value={userQuery}
            placeholder={this.getSearchFieldPlaceholder()}
            onKeyDown={this.handleEnter}
            onChange={(e) => { this.handleInputChange(e.target.value) }}
            autoComplete="off"
          />
        </div>



        {(userQuery || (searchFilters && searchFilters.length > 0)) && (
          <IconButton className={classes.searchClear} onClick={this.reset} >
            <Clear fontSize='inherit' />
          </IconButton>
        )}

      </div>
    );
  }
}

SearchField = withSearchManagement(SearchField);

export default inject('commonStore', 'recordStore', 'organisationStore', 'searchStore')(
  observer(
    injectIntl(withTheme()(withStyles(styles, { withTheme: true })(SearchField)))
  )
);
