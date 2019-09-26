import React from 'react';
import { Grid, Typography, withStyles } from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import Wings from '../utils/wing/Wings';
import ProfileService from '../../services/profile.service';
import SuggestionsService from '../../services/suggestions.service';

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
    marginBottom: 10,
    overflow: 'hidden'
  }
});

class OnboardSuggestions extends React.Component {

  state = {
    suggestions: [],
    lastSelected: {}
  }

  componentDidMount() {
    this.fetchSuggestions();
  }

  fetchSuggestions = (lastSelected, query) => {
    SuggestionsService.getOnboardSuggestions(lastSelected, query)
      .then(suggestions => {
        this.setState({ suggestions: suggestions });
      });
  }

  shouldDisplaySuggestion = (suggestion) => {
    let recordWings = this.props.recordStore.values.record.hashtags;
    return (
      (recordWings.find(wing => wing.tag === (suggestion.tag || suggestion.value)) === undefined) &&
      (suggestion.tag !== this.state.lastSelected.tag)
    );
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (JSON.stringify(this.state.suggestions) !== JSON.stringify(nextState.suggestions));
  }

  componentWillReceiveProps(nextProps) {
    this.fetchSuggestions(null, nextProps.userQuery);
  }

  handleSelectSuggestion = (suggestion) => {
    this.setState({ lastSelected: suggestion }, () => {
      this.fetchSuggestions(suggestion);
      this.props.onSelect(suggestion);
    });
  }

  render() {
    const { classes, max } = this.props;
    const { locale } = this.props.commonStore;
    const { suggestions } = this.state;
    let suggestionsDisplayed = 0;

    return (
      <Grid container item xs={12} >
        <Typography variant="body2" className={classes.title}>
          Suggestions
        </Typography>

        <Grid item className={classes.suggestionsContainer}>
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
                  mode="highlight"
                />
              </div>
            );
          })}
        </Grid>

      </Grid>
    )
  }
}

export default inject('commonStore', 'recordStore')(
  observer(withStyles(styles)(OnboardSuggestions))
);
