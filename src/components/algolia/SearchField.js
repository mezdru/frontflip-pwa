import React from 'react';
import { AsyncCreatable } from 'react-select';
import { injectIntl } from 'react-intl';
import { inject, observer } from 'mobx-react';
import './SearchField.css';
import classNames from 'classnames';
import { withTheme } from '@material-ui/core';
import ProfileService from '../../services/profile.service';
import {Option, customStyles, MultiValueContainer, DropdownIndicator} from './SearchFieldElements';

class SearchField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: '',
      selectedOption: this.props.defaultValue,
      placeholder: this.props.intl.formatMessage({ id: 'algolia.search' }),
      locale: this.props.commonStore.getCookie('locale') || this.props.commonStore.locale,
    };

    this.getOptions = this.getOptions.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.noOptionsMessage = this.noOptionsMessage.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.createOptionMessage = this.createOptionMessage.bind(this);
    this.handleCreateOption = this.handleCreateOption.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  // Used to fetch an event: User click on a Wing, so we should add it to the search filters
  componentWillReceiveProps(nextProps) {
    if (nextProps.newFilter.value && nextProps.newFilter.label) {
      if (this.state.selectedOption && !this.state.selectedOption.some(val => val.value === nextProps.newFilter.value)) {
        let newSelectedOption = this.state.selectedOption;
        newSelectedOption.push(nextProps.newFilter);
        this.handleChange(newSelectedOption);
      } else {
        this.handleChange([nextProps.newFilter]);
      }
    }
  }

  // Format an array of options so that they all have a label and a value
  // i18n of options is performed here
  prepareLabels(array) {
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
      arrayOfLabel.push({ label: displayedName, value: hit.tag, labelText: displayedNameText, picturePath: ProfileService.getPicturePath(hit.picture) });
    });
    return arrayOfLabel;
  }

  getTextLabel(hit) {
    if(!hit) return '';
    return (hit.name_translated ? 
      (hit.name_translated[this.state.locale] || hit.name_translated['en-UK']) || hit.name || hit.tag : hit.name || hit.tag);
  }

  getOptionValue = (option) => option.value;
  getOptionLabel = (option) => ProfileService.htmlDecode(option.labelText || option.label);

  // when option is selected
  handleChange(selectedOption) {
    this.scrollToBottom();

    this.props.commonStore.setSearchFilters(selectedOption);
    this.setState({
      selectedOption: selectedOption,
      inputValue: ''
    }, () => {
      this.refineWithSelectedOptions(selectedOption);
      this.props.updateFilters(selectedOption);
    });
  }

  async scrollToBottom() {
    setTimeout(() => {
      let valueContainer = document.querySelector('.autocomplete-search div div:nth-child(1)');
      if(valueContainer){
        valueContainer.scrollTop = valueContainer.scrollHeight;
        if(valueContainer.scrollHeight > 42) {
          valueContainer.style.marginBottom = '8px';
        } else {
          valueContainer.style.marginBottom = '';
        }
      } 
    }, 100);    
  }

  refineWithSelectedOptions(selectedOption) {
    let optionsString = '';
    if (selectedOption && selectedOption.length > 0) selectedOption.forEach(option => { optionsString += option.label + ' '; });
    this.updateOptions(optionsString);
  }

  async getOptions(inputValue) {
    let algoliaResponse = await this.updateOptions(inputValue);
    return this.prepareLabels(algoliaResponse.hits);
  }

  async updateOptions(inputValue) {
    return await this.props.index.search(
      {
        query: inputValue,
        attributesToRetrieve: ['type','name', 'name_translated', 'tag','picture'],
        restrictSearchableAttributes: ['name', 'name_translated', 'tag'],
        highlightPreTag: '<span>',
        highlightPostTag: '</span>',
        hitsPerPage: 5
      }
    );
  }

  // Handle input change (any change)
  handleInputChange(inputValue) {
    if ((!inputValue || inputValue === '') && (!this.state.selectedOption || this.state.selectedOption.length === 0)){
      this.updateOptions(inputValue);
    }
    return inputValue;
  }

  handleCreateOption(option) {
    let arrayOfOption = this.state.selectedOption || [];
    option = option.trim();
    arrayOfOption.push({ label: option, value: option });
    return this.handleChange(arrayOfOption);
  }

  noOptionsMessage(inputValue) {
    if (inputValue.inputValue) return this.props.intl.formatMessage({ id: 'algolia.noOptions' }, { input: inputValue.inputValue });
    return this.props.intl.formatMessage({ id: 'algolia.typeSomething' });
  }

  createOptionMessage = (inputValue) => this.props.intl.formatMessage({ id: 'algolia.createOption' }, { input: inputValue });

  handleSearchClick(props) {
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

  onKeyDown(event, props) {
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
        onChange={this.handleChange}
        onInputChange={this.handleInputChange}
        onCreateOption={this.handleCreateOption}
        components={{ MultiValueContainer, DropdownIndicator, Option }}
        isMulti
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

export default inject('commonStore')(
  observer(
    injectIntl(withTheme()(SearchField))
  )
);
