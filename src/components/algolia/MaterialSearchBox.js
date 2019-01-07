import React, {Component} from 'react';
import PropTypes from 'prop-types';
import AsyncSelect from 'react-select/lib/Async';
import commonStore from '../../stores/common.store';
import { connectAutoComplete } from 'react-instantsearch-dom';
import './MaterialSearchBox.css';

const propTypes = {
  searchApiUrl: PropTypes.string.isRequired,
  limit: PropTypes.number,
  defaultValue: PropTypes.object,
  actionOnSelectedOption: PropTypes.func
};

const defaultProps = {
  limit: 25,
  defaultValue: null
};

class SearchableSelect extends Component {
  static propTypes = propTypes;
  static defaultProps = defaultProps;
  constructor(props) {
    super(props);
    this.state = {
      inputValue: '',
      limit: props.limit,
      selectedOption: this.props.defaultValue
      // actionOnSelectedOption: props.actionOnSelectedOption
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
        displayedName = (hit.name_translated ? (hit.name_translated[commonStore.locale] || hit.name_translated['en-UK']) || hit.name || hit.tag : hit.name || hit.tag );
      }else if(hit.type === 'person'){
        displayedName = hit.name || hit.tag;
      }
      arrayOfLabel.push({label: displayedName, value: hit.tag});
    });
    console.log('number of options returned : ' + arrayOfLabel.length);
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
    });
  }

  refineWithSelectedOptions(selectedOption) {
    let optionsString= '';
    if(selectedOption && selectedOption.length > 0){
      selectedOption.forEach(option => {
        optionsString += option.label + ' ';
      });
    }    
    this.props.refine(optionsString);
  }

  async getOptions(inputValue) {
    await this.props.refine(inputValue);
    console.log('number of options : ' + this.props.hits.length);
    return this.prepareLabels(this.props.hits);
  }

  // Handle input change (any change)
  handleInputChange(inputValue) {
    if((!inputValue || inputValue === '') && (!this.state.selectedOption || this.state.selectedOption.length === 0)){
      this.props.refine();
    } 
    return inputValue;
  }

  noOptionsMessage(inputValue) {
    return 'No results' + (inputValue.inputValue ? ' for: ' + inputValue.inputValue : '');
  }

  render() {
    const { defaultOptions, placeholder } = this.props;
    const { selectedOption } = this.state;
    return (
      <AsyncSelect
        className='hide-options'
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
export default MaterialSearchBox;