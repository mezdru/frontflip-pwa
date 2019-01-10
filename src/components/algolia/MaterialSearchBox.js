import React, {Component} from 'react';
import PropTypes from 'prop-types';
import AsyncSelect from 'react-select/lib/Async';
import commonStore from '../../stores/common.store';
import { connectAutoComplete } from 'react-instantsearch-dom';
import {FormattedMessage, injectIntl} from 'react-intl';
import {inject, observer} from 'mobx-react';
import './MaterialSearchBox.css';

class SearchableSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: '',
      selectedOption: this.props.defaultValue,
      placeholder: this.props.intl.formatMessage({id: 'algolia.search'}),
      locale: this.props.commonStore.getCookie('locale') || this.props.commonStore.locale
    };
    this.getOptions = this.getOptions.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.noOptionsMessage = this.noOptionsMessage.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  prepareLabels(array) {
    let arrayOfLabel = [];
    array.forEach(hit => {
      let displayedName;
      if(hit.type === 'hashtag'){
        displayedName = (hit.name_translated ? (hit.name_translated[this.state.locale] || hit.name_translated['en-UK']) || hit.name || hit.tag : hit.name || hit.tag );
      }else if(hit.type === 'person'){
        displayedName = hit.name || hit.tag;
      }
      arrayOfLabel.push({label: displayedName, value: hit.tag});
    });
    return arrayOfLabel;
  }

  getOptionValue = (option) => option.value;
  getOptionLabel = (option) => option.label;

  // when option is selected
  handleChange(selectedOption) {
    this.setState({
      selectedOption: selectedOption
    }, () => {
      this.refineWithSelectedOptions(selectedOption);
      this.props.updateFilters(selectedOption);
    });
  }

  refineWithSelectedOptions(selectedOption) {
    let optionsString= '';
    if(selectedOption && selectedOption.length > 0) selectedOption.forEach(option => {optionsString += option.label + ' ';});    
    this.props.refine(optionsString);
  }

  async getOptions(inputValue) {
    await this.props.refine(inputValue);
    return this.prepareLabels(this.props.hits);
  }

  // Handle input change (any change)
  handleInputChange(inputValue) {
    if((!inputValue || inputValue === '') && (!this.state.selectedOption || this.state.selectedOption.length === 0)) this.props.refine();
    return inputValue;
  }

  noOptionsMessage(inputValue) {
    if(inputValue.inputValue) return this.props.intl.formatMessage({id: 'algolia.noOptions'}, {input: inputValue.inputValue});
    return this.props.intl.formatMessage({id: 'algolia.typeSomething'});
  }

  render() {
    const { defaultOptions } = this.props;
    const { selectedOption, placeholder } = this.state;

    const customStyles = {
      control: (base, state) => ({
        ...base,
        // match with the menu
        borderRadius: '30px',
        boxSizing: 'content-box',
        // Overwrittes the different states of border
        border: state.isFocused ? "2px solid #dd362e" : "1px solid black",
        // borderColor: state.isFocused ? "#dd362e" : "black",
        // Removes weird border around container
        boxShadow: state.isFocused ? null : null,
        "&:hover": {
          // Overwrittes the different states of border
          borderColor: state.isFocused ? "#dd362e" : "black"
        },
        padding: '10px 8px 10px 8px',
        fontSize: '16px'
      }),
      menu: base => ({
        ...base,
        // override border radius to match the box
        borderRadius: '30px',
        overflow:'hidden',
        hyphens: "auto",
        textAlign: "center",
        // prevent menu to scroll y
        wordWrap: "break-word"
      }),
      menuList: base => ({
        ...base,
        padding: 0
      }),
      input: base => ({
        ...base,
        padding: 0
      }),
    };

    return (
      <AsyncSelect
        styles={customStyles}
        className='autocomplete-search'
        value={selectedOption}
        noOptionsMessage={this.noOptionsMessage}
        getOptionValue={this.getOptionValue}
        getOptionLabel={this.getOptionLabel}
        defaultOptions={defaultOptions}
        loadOptions={this.getOptions}
        placeholder={placeholder}
        onChange={this.handleChange}
        onInputChange={this.handleInputChange} 
        isMulti
      />
    );
  }
}

const MaterialSearchBox = connectAutoComplete(SearchableSelect);
export default inject('commonStore')(
  injectIntl(observer(
      (MaterialSearchBox)
  ))
);
