import React from 'react'
import { withStyles } from '@material-ui/core';
import { inject, observer } from "mobx-react";
import { TextField, Grid, Typography } from '@material-ui/core'
import PictureField from '../../utils/fields/PictureField';
import { FormattedMessage } from "react-intl";
import { injectIntl } from 'react-intl';
import GeocodingField from '../../utils/fields/GeocodingField';

const Entities = require('html-entities').XmlEntities;
const entities = new Entities();

const styles = theme => ({
  root: {
    flexBasis: '100%',
    width: '100%',
    minHeight: '100%',
    background: theme.palette.primary.main,
    padding: 24,
    overflow: 'auto'
  },
  field: {
    minWidth: '100% !important',
    minHeight: 250
  }
});

class OnboardGeo extends React.Component {

  handleChange = (e, field) => {
    let record = (this.props.edit ? this.props.recordStore.currentUrlRecord : this.props.recordStore.currentUserRecord);
    record[field] = e.target.value;
    this.forceUpdate(); // why component do not update auto like Login fields ?
  }

  render() {
    const { classes } = this.props;
    let record = (this.props.edit ? this.props.recordStore.currentUrlRecord : this.props.recordStore.currentUserRecord);

    return (
        <Grid container item xs={12} spacing={16} direction="column" className={classes.root} >
          
          <Grid item >
            <Typography variant="h4" style={{ textAlign: 'center', color: this.props.theme.palette.primary.dark }} >
              <FormattedMessage id={'onboard.description.title'} />
            </Typography>
          </Grid>

          <Grid item className={classes.field}>
            <GeocodingField />
          </Grid>

        </Grid>
    );
  }
}

export default inject('commonStore', 'recordStore', 'orgStore')(
  observer(
    injectIntl(withStyles(styles, { withTheme: true })(OnboardGeo))
  )
);
