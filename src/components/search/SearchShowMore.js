import React from 'react';
import { withStyles, Grid, CircularProgress, Button } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';

const styles = theme => ({
  cardMobileView: {
    [theme.breakpoints.down('xs')]: {
      margin: '16px!important',
    },
  },
});

function SearchShowMore({loadInProgress, handleShowMore, ...props }) {
  return (
    <Grid item xs={12} sm={8} md={6} lg={4} className={props.classes.cardMobileView} container justify={"center"} alignContent={"center"}>
      {loadInProgress && (
        <CircularProgress color="secondary" />
      )}
      {!loadInProgress && (
        <Button onClick={(e) => handleShowMore(e)}><FormattedMessage id="search.showMore" /></Button>
      )}
    </Grid>
  );
}


export default withStyles(styles)(SearchShowMore)
