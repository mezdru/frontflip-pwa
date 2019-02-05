import React, { Component } from 'react';
import { AsyncCreatable, components } from 'react-select';
import { connectAutoComplete } from 'react-instantsearch-dom';
import { injectIntl } from 'react-intl';
import { inject, observer } from 'mobx-react';
import './AutoCompleteSearchField.css';
import classNames from 'classnames';
import { withStyles, Chip } from '@material-ui/core';
import {Search} from '@material-ui/icons';

class SearchableSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: '',
      selectedOption: this.props.defaultValue,
      placeholder: this.props.intl.formatMessage({ id: 'algolia.search' }),
      locale: this.props.commonStore.getCookie('locale') || this.props.commonStore.locale,
      inputValue: ''
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
      if (hit.type === 'hashtag') {
        displayedName = (hit.name_translated ? (hit.name_translated[this.state.locale] || hit.name_translated['en-UK']) || hit.name || hit.tag : hit.name || hit.tag);
      } else if (hit.type === 'person') {
        displayedName = hit.name || hit.tag;
      }
      arrayOfLabel.push({ label: displayedName, value: hit.tag });
    });
    return arrayOfLabel;
  }

  getOptionValue = (option) => option.value;
  getOptionLabel = (option) => this.htmlDecode(option.label);

  // when option is selected
  handleChange(selectedOption) {
    this.props.commonStore.setSearchFilters(selectedOption);
    this.setState({
      selectedOption: selectedOption,
      inputValue: ''
    }, () => {
      this.refineWithSelectedOptions(selectedOption);
      this.props.updateFilters(selectedOption);
    });
  }

  refineWithSelectedOptions(selectedOption) {
    let optionsString = '';
    if (selectedOption && selectedOption.length > 0) selectedOption.forEach(option => { optionsString += option.label + ' '; });
    this.props.refine(optionsString);
  }

  async getOptions(inputValue) {
    await this.props.refine(inputValue);
    return this.prepareLabels(this.props.hits);
  }

  // Handle input change (any change)
  handleInputChange(inputValue) {
    if ((!inputValue || inputValue === '') && (!this.state.selectedOption || this.state.selectedOption.length === 0)) this.props.refine();
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

  createOptionMessage(inputValue) {
    return this.props.intl.formatMessage({ id: 'algolia.createOption' }, { input: inputValue });
  }

  htmlDecode = function (input) {
    var e = document.createElement('textarea');
    e.innerHTML = input;
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
  }

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
    }
}


  render() {
    const { defaultOptions, intl, theme } = this.props;
    const { selectedOption, placeholder, inputValue } = this.state;


    const MultiValueContainer = (props) => {
      return (
        <Chip label={props.children} color="secondary" onClick={props.onClick} className={'editableChip'} />
      );
    };

    const DropdownIndicator = (props) => {
      return (
        <components.DropdownIndicator {...props}>
          <Search onClick={(e) => {this.handleSearchClick(props)}} />
        </components.DropdownIndicator>
      );
    };
    

    const customStyles = {
      control: (base, state) => ({
        ...base,
        borderRadius: '30px',
        boxSizing: 'content-box',
        border: state.isFocused ? "1px solid #dd362e" : "1px solid grey",
        boxShadow: state.isFocused ? null : null,
        "&:hover": {
          borderColor: state.isFocused ? "#dd362e" : "black",
          boxSizing: 'content-box'
        },
        padding: '3px 16px',
        minHeight: 46,
        fontSize: 16
      }),
      menu: base => ({
        ...base,
        borderRadius: '30px',
        overflow: 'hidden',
        hyphens: "auto",
        textAlign: "center",
        // prevent menu to scroll y
        wordWrap: "break-word",

      }),
      menuList: base => ({
        ...base,
        padding: 0,
      }),
      input: base => ({
        ...base,
        padding: 0,
      }),
      multiValue: base => ({
        ...base,
        background: theme.palette.primary.main,
      }),
      valueContainer: (provided, state) => ({
        ...provided,
        padding: 0,
        margin: 0,
        overflow: 'auto',
        maxHeight: 42
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
        components={{ MultiValueContainer, DropdownIndicator }}
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

const AutoCompleteSearchField = connectAutoComplete(SearchableSelect);
export default inject('commonStore')(
  injectIntl(observer(
    withStyles(null, { withTheme: true })(AutoCompleteSearchField)
  ))
);
