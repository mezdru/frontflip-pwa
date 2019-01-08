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
        // beautify the word cut by adding a dash see https://caniuse.com/#search=hyphens for the compatibility
        hyphens: "auto",
        // kill the gap
        // marginTop: 0,
        textAlign: "center",
        // prevent menu to scroll y
        wordWrap: "break-word"
      }),
      menuList: base => ({
        ...base,
        // kill the white space on first and last option
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
export default MaterialSearchBox;