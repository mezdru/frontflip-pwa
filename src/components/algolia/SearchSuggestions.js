import React, {Component} from 'react';
import { connectMenu } from 'react-instantsearch-dom';
import {injectIntl} from 'react-intl';
import {inject, observer} from 'mobx-react';
import './AutoCompleteSearchField.css';
import classNames from 'classnames';
import {withStyles,Chip} from '@material-ui/core'

const style = theme => ({
    suggestionsContainer: {
        textAlign: 'center',
    }
});

class SearchSuggestionsComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }


  render() {
    const { items, attribute, classes } = this.props;

    return (
      <div className={classes.suggestionsContainer} >
        {items.map((item, i) => {
            return <Chip key={i} label={ '('+item.count + ') - ' + item.label} onClick={(e) => this.props.addToFilters(e, {name: item.label, tag: item.value})} />;
        })}
      </div>
    );
  }
}

const SearchSuggestions = connectMenu(SearchSuggestionsComponent);
export default inject('commonStore')(
  injectIntl(observer(
    withStyles(style, {withTheme: true})(SearchSuggestions)
  ))
);
