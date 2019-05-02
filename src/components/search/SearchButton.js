import React from 'react';
import { inject, observer } from "mobx-react";
import { withStyles } from '@material-ui/core';
import { observe } from 'mobx';


const styles = theme => ({
  searchBox: {
    position: 'relative',
    top: '50%',
    transform: 'translateY(-50%)',
    left:0,
    right:0,
    margin: 'auto',
    backgroundColor: 'white',
    borderRadius: 5,
    width: 250,
    padding: 16,
    textAlign: 'center'
  }
});

class SearchButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      observer: () => {},
    }
  }

  componentDidMount() {
    this.setState({observer: observe(this.props.commonStore, 'searchResultsCount', (change) => {
      this.forceUpdate();
    })});
  }


  render() {
    const {classes} = this.props;
    const {searchResultsCount} = this.props.commonStore;

    return(
      <>
        <div className={classes.searchBox}>
        {searchResultsCount} persons found !
        </div>
      </>
    );
  }
}

export default inject('commonStore')(
  observer(
    withStyles(styles)(SearchButton)
  )
);
