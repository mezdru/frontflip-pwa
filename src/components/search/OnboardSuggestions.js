import React from 'react';
import { Grid, withStyles } from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import Wings from '../utils/wing/Wings';
import ProfileService from '../../services/profile.service';
import SuggestionsService from '../../services/suggestions.service';
import { injectIntl } from "react-intl";
import { observe } from 'mobx';
import { getUnique } from '../../services/utils.service';

const styles = theme => ({
  title: {
    marginTop: 16,
    width: '100%'
  },
  suggestion: {
    display: 'inline-flex',
    opacity: 0,
    animation: 'easeIn 300ms',
    animationFillMode: 'forwards'
  },
  '@keyframes easeIn': {
    from: { opacity: 0 },
    to: { opacity: 1 }
  },
  suggestionsContainer: {
    height: 151,
    marginBottom: 26,
    [theme.breakpoints.down('xs')]: {
      marginBottom: 10,
    },
    marginLeft: -8,
    overflow: 'hidden'
  }
});

class OnboardSuggestions extends React.Component {

  state = {
    suggestions: [],
    lastSelected: {}
  }

  componentDidMount() {
    this.fetchSuggestions(null, this.props.wingsFamily);
    let record = (this.props.edit ? this.props.recordStore.currentUrlRecord : this.props.recordStore.currentUserRecord);

    this.unsubscribeUserQuery = observe(this.props.searchStore.values, 'userQuery', () => {this.fetchSuggestions(null, this.props.wingsFamily)});
    this.unsubscribeUserRecord = observe(record, (change) => {
      if(change.name === 'hashtags' && change.oldValue.length > change.newValue.length) {
        let lastRemoved = change.oldValue[change.oldValue.length - 1];
        this.fetchSuggestions(lastRemoved, this.props.wingsFamily, true);
      }
    });
  }
  
  componentWillUnmount() {
    this.isUnmount = true;
    this.unsubscribeUserQuery();
    this.unsubscribeUserRecord();
  }

  fetchSuggestions = async (lastSelected, wingsFamily, includeLastSelected) => {
    if(lastSelected && lastSelected.tag) this.fetchSuggestionsAfterSelectInProgress = false;
    if(this.fetchSuggestionsAfterSelectInProgress) return;
    let suggestions = await SuggestionsService.getSuggestions(lastSelected, this.props.searchStore.values.userQuery || '', wingsFamily );
    if(lastSelected && !includeLastSelected) suggestions = suggestions.filter(suggestion => suggestion.tag !== lastSelected.tag);
    if(this.isUnmount) return;
    this.setState({suggestions: getUnique(suggestions, "tag"), lastSelected: (includeLastSelected ? {} : this.state.lastSelected)});
  }

  shouldDisplaySuggestion = (suggestion) => {
    let record = (this.props.edit ? this.props.recordStore.currentUrlRecord : this.props.recordStore.currentUserRecord);
    return (
      (!record.hashtags.find(wing => wing.tag === (suggestion.tag || suggestion.value))) &&
      (suggestion.tag !== this.state.lastSelected.tag)
    );
  }

  shouldComponentUpdate(nextProps, nextState) {
    return  (JSON.stringify(this.state.suggestions) !== JSON.stringify(nextState.suggestions)) || 
            (JSON.stringify(nextProps.wingsFamily) !== JSON.stringify(this.props.wingsFamily)) ||
            (this.state.suggestions.length === 0 && nextState.suggestions.length === 0)
  }

  componentWillReceiveProps(nextProps) {
    this.fetchSuggestions(null, nextProps.wingsFamily);
  }

  handleSelectSuggestion = (suggestion) => {
    this.fetchSuggestionsAfterSelectInProgress = true;
    this.setState({ lastSelected: suggestion }, () => {
      this.props.searchStore.setUserQuery('');
      this.fetchSuggestions(suggestion, this.props.wingsFamily);
      this.props.onSelect(suggestion);
    });
  }

  handleCreateWing = () => {
    this.props.handleCreateWing({name: this.props.searchStore.values.userQuery});
    this.props.searchStore.setUserQuery('');
  }

  render() {
    const { classes, max } = this.props;
    const { userQuery } = this.props.searchStore.values;
    const { locale } = this.props.commonStore;
    const { suggestions } = this.state;
    let suggestionsDisplayed = 0;

    return (
      <Grid container item xs={12} >
        <Grid item className={classes.suggestionsContainer}>
          {userQuery && (
            <Wings
              label={this.props.intl.formatHTMLMessage({id: "onboard.createWing"}, {wingName: userQuery})}
              mode="button"
              onClick={this.handleCreateWing}
            />
          )}
          {suggestions.map((suggestion, index) => {
            if (!this.shouldDisplaySuggestion(suggestion)) return null;
            if (max && suggestionsDisplayed >= max) return null;
            suggestionsDisplayed++;

            return (
              <div
                style={{ animationDelay: ((suggestionsDisplayed - 1) * 0.05) + 's' }}
                className={classes.suggestion}
                key={Math.random()} 
              >
                <Wings
                  label={ProfileService.getWingDisplayedName(suggestion, locale)}
                  src={ProfileService.getPicturePath(suggestion.picture)}
                  onClick={() => this.handleSelectSuggestion(suggestion)}
                  mode="suggestion"
                />
              </div>
            );
          })}
        </Grid>

      </Grid>
    )
  }
}

export default inject('commonStore', 'recordStore', 'searchStore')(
  observer(withStyles(styles)( injectIntl(OnboardSuggestions)))
);
