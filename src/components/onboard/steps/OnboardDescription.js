import React from 'react'
import { withStyles } from '@material-ui/core';
import { inject, observer } from "mobx-react";
import { TextField, Grid, Typography } from '@material-ui/core'
import PictureField from '../../utils/fields/PictureField';
import { FormattedMessage } from "react-intl";
import { injectIntl } from 'react-intl';

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

class OnboardDescription extends React.Component {

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
            <TextField
              label={this.props.intl.formatMessage({ id: 'onboard.description.label' })}
              type="text"
              className={classes.field}
              fullWidth
              rowsMax={20}
              rows={10}
              multiline
              variant={"outlined"}
              value={record.description}
              onChange={(e) => this.handleChange(e, 'description')}
              onBlur={(e) => { this.props.handleSave(['description']) }}
              error={(record.description && (record.description.length > 1200)) === true}
              helperText={(record.description && record.description.length > 1200) ? '1200 characters max' : ''}
            />
          </Grid>

        </Grid>
    );
  }
}

export default inject('commonStore', 'recordStore', 'orgStore')(
  observer(
    injectIntl(withStyles(styles, { withTheme: true })(OnboardDescription))
  )
);
