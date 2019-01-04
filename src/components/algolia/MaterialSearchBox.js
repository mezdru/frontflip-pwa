import React, {Component} from 'react';
import PropTypes from 'prop-types';
import AsyncSelect from 'react-select/lib/Async';
import commonStore from '../../stores/common.store';
import { connectAutoComplete } from 'react-instantsearch-dom';

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
      searchApiUrl: props.searchApiUrl,
      limit: props.limit,
      selectedOption: this.props.defaultValue,
      actionOnSelectedOption: props.actionOnSelectedOption
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
        displayedName = (hit.name_translated ? (hit.name_translated[commonStore.locale] || hit.name_translated['en-UK']) : hit.name );
      }else {
        displayedName = hit.name;
      }
      arrayOfLabel.push({label: displayedName, value: hit.tag});
    });
    return arrayOfLabel;
  }

  getOptionValue = (option) => option.value;

  getOptionLabel = (option) => option.label;

  handleChange(selectedOption) {
    this.setState({
      selectedOption: selectedOption
    });
    // this is for update action on selectedOption
    this.state.actionOnSelectedOption(selectedOption.value);
  }

  async getOptions(inputValue) {
    if (!inputValue) {
      return [];
    }
    await this.props.refine(inputValue);

    return this.prepareLabels(this.props.hits);
  }

  handleInputChange(inputValue) {
    this.setState({ inputValue });
    return inputValue;
  }

  noOptionsMessage(inputValue) {
    if (this.props.hits.length) return null;
    if (!inputValue) {
      return 'No results';
    }

    return 'No more options'
  }

  render() {
    const { defaultOptions, placeholder } = this.props;
    const { selectedOption } = this.state;
    return (
      <AsyncSelect
        cacheOptions
        value={selectedOption}
        noOptionsMessage={this.noOptionsMessage}
        getOptionValue={this.getOptionValue}
        getOptionLabel={this.getOptionLabel}
        defaultOptions={defaultOptions}
        loadOptions={this.getOptions}
        placeholder={placeholder}
        onChange={this.handleChange}
      />
    );
  }
}

const MaterialSearchBox = connectAutoComplete(SearchableSelect);
export default MaterialSearchBox;