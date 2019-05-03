import React from 'react';
import { AsyncCreatable } from 'react-select';
import { injectIntl } from 'react-intl';
import { inject, observer } from 'mobx-react';
import '../algolia/SearchField.css';
import classNames from 'classnames';
import { withTheme } from '@material-ui/core';
import ProfileService from '../../services/profile.service';
import {Option, customStyles, MultiValueContainer} from '../algolia/SearchFieldElements';
import AlgoliaService from '../../services/algolia.service';
import { observe } from 'mobx';
import {Search} from '@material-ui/icons';
import { components } from 'react-select';
import theme from '../../theme';

class SearchField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: '',
      selectedOption: this.props.defaultValue,
      placeholder: this.getSearchFieldPlaceholder(),
      locale: this.props.commonStore.getCookie('locale') || this.props.commonStore.locale,
      observer: () => {}
    };
  }

  getSearchFieldPlaceholder = () => {
    if(this.props.hashtagOnly) {
      return this.props.intl.formatMessage({id: 'algolia.onboard'});
    } else {
      return this.props.intl.formatMessage({id: 'algolia.search'}, {orgName: this.props.organisationStore.values.organisation.name});
    }
  }

  componentDidMount() {
    AlgoliaService.setAlgoliaKey(this.props.commonStore.algoliaKey);

    this.setState({observer: observe(this.props.commonStore, 'algoliaKey', (change) => {
      AlgoliaService.setAlgoliaKey(this.props.commonStore.algoliaKey);
    })});

    observe(this.props.commonStore, 'searchFilters', (change) => {

      let currentFilters = this.props.commonStore.getSearchFilters();

      currentFilters.forEach(filter => {
        if (this.state.selectedOption && !this.state.selectedOption.some(val => val.value === filter.value)) {
          let newSelectedOption = this.state.selectedOption;
          newSelectedOption.push(filter);
          this.handleChange(newSelectedOption, false);
        } else if(!this.state.selectedOption){
          this.handleChange([filter], false);
        }
      });
    });
  }

  componentWillUnmount() {
    this.state.observer();
  }

  // Format an array of options so that they all have a label and a value
  // i18n of options is performed here
  prepareLabels = (array) => {
    let arrayOfLabel = [];
    array.forEach(hit => {
      let displayedName;
      let displayedNameText;
      if (hit.type === 'hashtag') {
        displayedNameText = this.getTextLabel(hit);
        if(hit._highlightResult && hit._highlightResult.name_translated && hit._highlightResult.name_translated[this.state.locale]&& hit._highlightResult.name_translated[this.state.locale].value) {
          displayedName = hit._highlightResult.name_translated[this.state.locale].value;
        } else if(hit._highlightResult && hit._highlightResult.name && hit._highlightResult.name.value) {
          displayedName = hit._highlightResult.name.value;
        } else if(hit._highlightResult && hit._highlightResult.tag && hit._highlightResult.tag.value){
          displayedName = hit._highlightResult.tag.value;
        } else {
          displayedName = this.getTextLabel(hit);
        }
      } else if (hit.type === 'person') {
        displayedNameText = hit.name || hit.tag;
        if(hit._highlightResult && hit._highlightResult.name && hit._highlightResult.name.value) {
          displayedName = hit._highlightResult.name.value
        } else {
          displayedName = hit.name || hit.tag;
        }
      }
      arrayOfLabel.push({ label: displayedName, value: hit.tag, labelText: displayedNameText, picturePath: ProfileService.getPicturePath(hit.picture, 'hashtag') });
    });
    return arrayOfLabel;
  }

  getTextLabel = (hit) => {
    if(!hit) return '';
    return (hit.name_translated ? 
      (hit.name_translated[this.state.locale] || hit.name_translated['en-UK']) || hit.name || hit.tag : hit.name || hit.tag);
  }

  getOptionValue = (option) => option.value;
  getOptionLabel = (option) => ProfileService.htmlDecode(option.labelText || option.label);

  // when option is selected
  handleChange = (selectedOption, shouldUpdateSearchFilters) => {
    this.scrollToBottom();
  
      this.setState({
        selectedOption: selectedOption,
        inputValue: ''
      }, () => {
        this.refineWithSelectedOptions(selectedOption);
        if(shouldUpdateSearchFilters) this.props.commonStore.setSearchFilters(selectedOption);
      });
  }

  // rename scrollToRight
  async scrollToBottom() {
    setTimeout(() => {
      let valueContainer = document.querySelector('.autocomplete-search div div:nth-child(1)');
      if(valueContainer){
        valueContainer.scrollLeft = valueContainer.scrollWidth;
      } 
    }, 100);    
  }

  refineWithSelectedOptions = (selectedOption) => {
    let optionsString = '';
    if (selectedOption && selectedOption.length > 0) selectedOption.forEach(option => { optionsString += option.label + ' '; });
    this.updateOptions(optionsString);
  }

  getOptions = async (inputValue) => {
    let algoliaResponse = await this.updateOptions(inputValue);
    return this.prepareLabels(algoliaResponse.hits);
  }

  updateOptions = async (inputValue) => {
    return await AlgoliaService.fetchOptions(inputValue, this.props.hashtagOnly, this.props.wingsFamily);
  }

  handleCreateOption = async (option) => {
    if (!this.props.hashtagOnly) {
      let arrayOfOption = this.state.selectedOption || [];
      option = option.trim();
      arrayOfOption.push({ label: option, value: option });
      return this.handleChange(arrayOfOption, true);
    } else {
      let newRecord = {
        name: option,
        type: 'hashtag'
      }
      if(this.props.wingsFamily){
        let wingsFamilyRecord;
        this.props.recordStore.setRecordTag(this.props.wingsFamily);
        wingsFamilyRecord = await this.props.recordStore.getRecordByTag();
        newRecord.hashtags = [wingsFamilyRecord];
      }
      return this.props.recordStore.postRecord(newRecord)
      .then(recordSaved => {
        return this.handleChange(recordSaved, true);
      }).catch((e) => console.log(e));
    }
  }

  noOptionsMessage = (inputValue) => {
    if (inputValue.inputValue) return this.props.intl.formatMessage({ id: 'algolia.noOptions' }, { input: inputValue.inputValue });
    return this.props.intl.formatMessage({ id: 'algolia.typeSomething' });
  }

  createOptionMessage = (inputValue) => {
    if(this.props.hashtagOnly) 
      return this.props.intl.formatMessage({ id: 'algolia.createWing' }, { input: inputValue });
    else
      return this.props.intl.formatMessage({ id: 'algolia.createOption' }, { input: inputValue });
  }

  handleSearchClick = (props) => {
    if(props.selectProps.inputValue.trim() !== '') {
      this.handleCreateOption(props.selectProps.inputValue);
    }
  }

  onInputChange = (inputValue, { action }) => {
    switch (action) {
      case 'input-change':
        this.setState({ inputValue });
        return;
      case 'menu-close':
        let menuIsOpen = undefined;
        if (this.state.inputValue) {
          menuIsOpen = true;
        }
        this.setState({
          menuIsOpen
        });
        return;
      default:
        return;
    }
  }

  onKeyDown = (event) => {
    switch (event.keyCode) {
        case 13: // ENTER
            event.preventDefault();
            this.handleSearchClick({selectProps: {inputValue: this.state.inputValue}});
            break;
        default:
          return;
    }
  }

  render() {
    const { defaultOptions} = this.props;
    const { selectedOption, placeholder, inputValue } = this.state;

    const DropdownIndicator = (props) => {
      return (
        <components.DropdownIndicator {...props}>
          <Search onClick={() => {this.handleSearchClick(props)}} style={{color: theme.palette.primary.main}} />
        </components.DropdownIndicator>
      );
    };

    return (
      <AsyncCreatable
        formatCreateLabel={this.createOptionMessage}
        styles={customStyles}
        className={classNames('autocomplete-search', this.props.className)}
        value={selectedOption}
        noOptionsMessage={this.noOptionsMessage}
        getOptionValue={this.getOptionValue}
        getOptionLabel={this.getOptionLabel}
        defaultOptions={defaultOptions}
        loadOptions={this.getOptions}
        placeholder={placeholder}
        onChange={(option) => this.handleChange(option, true)}
        onCreateOption={this.handleCreateOption}
        components={{ MultiValueContainer, DropdownIndicator, Option }}
        isMulti={!this.props.hashtagOnly}
        onSelectResetsInput={true}
        onBlurResetsInput={true}
        onCloseResetsInput={false}
        arrowRenderer={() => null}
        clearRenderer={() => null}
        inputValue={inputValue}
        onInputChange={this.onInputChange}
        onKeyDown={this.onKeyDown}
      />
    );
  }
}

export default inject('commonStore', 'recordStore', 'organisationStore')(
  observer(
    injectIntl(withTheme()(SearchField))
  )
);
