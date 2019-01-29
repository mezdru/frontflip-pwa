import React, {Component} from 'react';
import { AsyncCreatable } from 'react-select';
import { connectAutoComplete } from 'react-instantsearch-dom';
import {injectIntl} from 'react-intl';
import {inject, observer} from 'mobx-react';
import './AutoCompleteSearchField.css';
import classNames from 'classnames';
import {withStyles,Chip} from '@material-ui/core'

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
    this.createOptionMessage = this.createOptionMessage.bind(this);
    this.handleCreateOption = this.handleCreateOption.bind(this);
  }

  // Used to fetch an event: User click on a Wing, so we should add it to the search filters
  componentWillReceiveProps(nextProps) {
    if(nextProps.newFilter.value && nextProps.newFilter.label){
      if(this.state.selectedOption && !this.state.selectedOption.some(val => val.value === nextProps.newFilter.value)){
        let newSelectedOption = this.state.selectedOption;
        newSelectedOption.push(nextProps.newFilter);
        this.handleChange(newSelectedOption);
      }else{
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
  getOptionLabel = (option) => this.htmlDecode(option.label);

  // when option is selected
  handleChange(selectedOption) {
    this.props.commonStore.setSearchFilters(selectedOption);
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

  handleCreateOption(option) {
    let arrayOfOption = this.state.selectedOption || [];
    option = option.trim();
    arrayOfOption.push({label: option, value: option});
    return this.handleChange(arrayOfOption);
  }

  noOptionsMessage(inputValue) {
    if(inputValue.inputValue) return this.props.intl.formatMessage({id: 'algolia.noOptions'}, {input: inputValue.inputValue});
    return this.props.intl.formatMessage({id: 'algolia.typeSomething'});
  }

  createOptionMessage(inputValue) {
    return this.props.intl.formatMessage({id: 'algolia.createOption'}, {input: inputValue});
  }

  htmlDecode = function(input){
    var e = document.createElement('textarea');
    e.innerHTML = input;
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
  }

  render() {
    const { defaultOptions, intl, theme } = this.props;
    const { selectedOption, placeholder } = this.state;


    const MultiValueContainer = (props) => {
      return (
        <Chip label={props.children} color="primary" onClick={props.onClick} className={'editableChip'}/>
      );
    };

    const customStyles = {
      control: (base, state) => ({
        ...base,
        // match with the menu
        borderRadius: '30px',
        boxSizing: 'content-box',
        // Overwrittes the different states of border
        border: state.isFocused ? "2px solid #dd362e" : "2px solid black",
        // Removes weird border around container
        boxShadow: state.isFocused ? null : null,
        "&:hover": {
          // Overwrittes the different states of border
          borderColor: state.isFocused ? "#dd362e" : "black",
          boxSizing: 'content-box'
        },
        padding: '3px 8px 3px 8px',
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
      multiValue: base => ({
        ...base,
        background: theme.palette.primary.main,
      }),
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
        onChange={this.handleChange}
        onInputChange={this.handleInputChange} 
        onCreateOption={this.handleCreateOption}
        components={{MultiValueContainer}}
        isMulti
      />
    );
  }
}

const AutoCompleteSearchField = connectAutoComplete(SearchableSelect);
export default inject('commonStore')(
  injectIntl(observer(
    withStyles(null, {withTheme: true})(AutoCompleteSearchField)
  ))
);
