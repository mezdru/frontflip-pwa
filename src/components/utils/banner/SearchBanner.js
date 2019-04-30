import React from 'react';
import { observe } from 'mobx';
import { inject, observer } from "mobx-react";
import defaultBanner from '../../../resources/images/fly_away.jpg';
import { withStyles } from '@material-ui/core';

const styles = theme => ({
});

class SearchBanner extends React.Component {

  constructor(props) {
    super(props);
  }

  /**
   * @description Collapse suggestion part of search
   */
  collapseSuggestion = () => {

  }

  /**
   * @description Extend suggestion part of search
   */
  extendSuggestion = () => {

  }

  render() {

    return (
      <>

      </>
    )
  }
}

export default inject('organisationStore')(
  observer(
    withStyles(styles, { withTheme: true })(SearchBanner)
  )
);