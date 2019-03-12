import React from 'react';
import { AsyncCreatable } from 'react-select';
import { injectIntl } from 'react-intl';
import { inject, observer } from 'mobx-react';
import './SearchField.css';
import classNames from 'classnames';
import { withTheme } from '@material-ui/core';
import ProfileService from '../../services/profile.service';
import {Option, customStyles, MultiValueContainer, DropdownIndicator} from './SearchFieldElements';
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
      placeholder: this.props.intl.formatMessage({ id: 'algolia.search' }),
      locale: this.props.commonStore.getCookie('locale') || this.props.commonStore.locale,
      observer: () => {}
    };
  }

  // Used to fetch an event: User click on a Wing, so we should add it to the search filters
  componentWillReceiveProps(nextProps) {
    if(this.props.hashtagOnly) return;
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
  componentDidMount() {
    AlgoliaService.setAlgoliaKey(this.props.commonStore.algoliaKey);

    this.setState({observer: observe(this.props.commonStore, 'algoliaKey', (change) => {
      AlgoliaService.setAlgoliaKey(this.props.commonStore.algoliaKey);
    })});
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
  handleChange = (selectedOption) => {
    this.scrollToBottom();
    
    if(this.props.hashtagOnly) {
      this.setState({inputValue: '', selectedOption: null}, () => {if(selectedOption) this.props.handleAddWing(null, {tag: selectedOption.value || selectedOption.tag})});
    } else {
      this.props.commonStore.setSearchFilters(selectedOption);
      this.setState({
        selectedOption: selectedOption,
        inputValue: ''
      }, () => {
        this.refineWithSelectedOptions(selectedOption);
        this.props.updateFilters(selectedOption);
      });
    }

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

  // Handle input change (any change)
  handleInputChange = (inputValue) => {
    if ((!inputValue || inputValue === '') && (!this.state.selectedOption || this.state.selectedOption.length === 0)){
      this.updateOptions(inputValue);
    }
    return inputValue;
  }

  handleCreateOption = async (option) => {
    if (!this.props.hashtagOnly) {
      let arrayOfOption = this.state.selectedOption || [];
      option = option.trim();
      arrayOfOption.push({ label: option, value: option });
      return this.handleChange(arrayOfOption);
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
        return this.handleChange(recordSaved);
      }).catch((e) => console.log(e));
    }
  }

  noOptionsMessage = (inputValue) => {
    if (inputValue.inputValue) return this.props.intl.formatMessage({ id: 'algolia.noOptions' }, { input: inputValue.inputValue });
    return this.props.intl.formatMessage({ id: 'algolia.typeSomething' });
  }

  createOptionMessage = (inputValue) => this.props.intl.formatMessage({ id: 'algolia.createOption' }, { input: inputValue });

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
        onChange={this.handleChange}
        onInputChange={this.handleInputChange}
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

export default inject('commonStore', 'recordStore')(
  observer(
    injectIntl(withTheme()(SearchField))
  )
);
