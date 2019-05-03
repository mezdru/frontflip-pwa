import React from 'react';
import { AsyncCreatable } from 'react-select';
import { injectIntl } from 'react-intl';
import { inject, observer } from 'mobx-react';
import '../algolia/SearchField.css';
import classNames from 'classnames';
import { withTheme, withStyles } from '@material-ui/core';
import ProfileService from '../../services/profile.service';
import {Option, customStyles, MultiValueContainer} from '../algolia/SearchFieldElements';
import AlgoliaService from '../../services/algolia.service';
import { observe } from 'mobx';
import {Search} from '@material-ui/icons';
import { components } from 'react-select';
import theme from '../../theme';
import Wing from '../utils/wing/Wing';
import withSearchManagement from './SearchManagement.hoc';
import {Clear} from '@material-ui/icons';
import IconButton from '@material-ui/core/IconButton';

const styles = theme => ({
  searchContainer: {
    position: 'relative',
    zIndex: 1199,
    border: '1px solid',
    borderColor: theme.palette.primary.dark,
    borderRadius: 5,
    height: 50,
    background: 'white',
    display: 'flex',
    flexDirection: 'row',
  },
  searchFiltersContainer: {
    display: 'flex',
    maxHeight: 42,
    maxWidth: '80%',
    background: 'transparent',
    '& >div': {
      margin: 8,
    },
    overflowX: 'auto',
    flexWrap: 'nowrap',
    overflowY: 'hidden',
    paddingRight: 8,
    borderRadius: 5,
  },
  searchInput: {
    flex: 'auto',
    background: 'transparent',
    outline: 'none',
    border: 'none',
    height: '100%',
    fontSize: '1.1em',
    paddingLeft: 8,
  },
  searchClear: {
    float: 'right',
    // lineHeight: '70px',
    // paddingRight: 8,
    marginTop: 4,
    marginRight: 4,
    height: 40,
    '& svg': {
      color: theme.palette.primary.dark
    }
  }
});

class SearchField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchInput: '',
      selectedOption: this.props.defaultValue,
      placeholder: this.getSearchFieldPlaceholder(),
      locale: this.props.commonStore.getCookie('locale') || this.props.commonStore.locale,
      searchFilters: [],
      observer: () => {}
    };
  }

  componentDidMount() {
    this.setState({observer: observe(this.props.commonStore, 'searchFilters', (change) => {
      this.setState({searchFilters: this.props.commonStore.getSearchFilters(), searchInput: ''}, () => {
        this.scrollToRight();
      });
    })});
  }

  componentWillUnmount() {
    this.state.observer();
  }

  async scrollToRight() {
    setTimeout(() => {
      let valueContainer = document.getElementById('search-filters-container');
      if(valueContainer){
        valueContainer.scrollLeft = valueContainer.scrollWidth;
      } 
    }, 100);
  }

  getSearchFieldPlaceholder = () => {
    if(this.props.hashtagOnly) {
      return this.props.intl.formatMessage({id: 'algolia.onboard'});
    } else {
      return this.props.intl.formatMessage({id: 'algolia.search'}, {orgName: this.props.organisationStore.values.organisation.name});
    }
  }

  handleEnter = (e) => {
    if(e.key === 'Enter') {
      this.props.addFilter({name: e.target.value, tag: e.target.value});
      this.setState({searchInput: ''});
    }
  }

  handleInputChange = (inputValue) => {
    this.setState({searchInput: inputValue});
    this.props.fetchAutocompleteSuggestions(inputValue);
  }

  handleInputFocus = () => {
    var searchContainer = document.getElementById('search-container');
    searchContainer.style.border = '2px solid';
  }

  handleInputBlur = () => {
    var searchContainer = document.getElementById('search-container');
    searchContainer.style.border = '1px solid';
  }

  render() {
    const { classes, theme} = this.props;
    const { selectedOption, placeholder, searchInput, searchFilters } = this.state;

    return (
      <div className={classes.searchContainer} id="search-container">

        <div className={classes.searchFiltersContainer} id="search-filters-container">
          {searchFilters && searchFilters.length > 0 && searchFilters.map((filter, index) => {
            let displayedName = (filter.name_translated ? 
                                (filter.name_translated[this.state.locale] || filter.name_translated['en-UK']) || filter.name || filter.tag : 
                                filter.name);
            return (
              <Wing
                label={ProfileService.htmlDecode(displayedName)} key={index}
                onDelete={(e) => {this.props.removeFilter(filter)}} />
            );
          })}
        </div>

        <input 
          type='text' name="searchInput" 
          className={classes.searchInput} 
          value={searchInput}
          placeholder={placeholder} 
          onKeyDown={this.handleEnter} 
          onChange={(e) => {this.handleInputChange(e.target.value)}}
          onFocus={this.handleInputFocus} onBlur={this.handleInputBlur}
        />
        
        {(searchInput || (searchFilters && searchFilters.length > 0)) && (
          <IconButton className={classes.searchClear} onClick={this.props.resetFilters} >
            <Clear fontSize='medium' />
          </IconButton>
        )}

      </div>
    );
  }
}

SearchField = withSearchManagement(SearchField);

export default inject('commonStore', 'recordStore', 'organisationStore')(
  observer(
    injectIntl(withTheme()(withStyles(styles, {withTheme: true})(SearchField)))
  )
);
