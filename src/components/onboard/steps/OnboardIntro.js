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
    height: '100%',
    background: theme.palette.primary.main,
    padding: 24
  },
  field: {
    minWidth: '100% !important'
  }
});

class OnboardIntro extends React.Component {

  handleChange = (e, field) => {
    let record = (this.props.edit ? this.props.recordStore.currentUrlRecord : this.props.recordStore.currentUserRecord);
    record[field] = e.target.value;
    this.forceUpdate(); // why component do not update auto like Login fields ?
  }

  render() {
    const { classes } = this.props;
    let record = (this.props.edit ? this.props.recordStore.currentUrlRecord : this.props.recordStore.currentUserRecord);


    record.intro = entities.decode(record.intro);
    record.name = entities.decode(record.name);

    return (
        <Grid container item xs={12} spacing={16} direction="column" className={classes.root} >
          
          <Grid item >
            <Typography variant="h4" style={{ textAlign: 'center', color: this.props.theme.palette.primary.dark }} >
              <FormattedMessage id={'onboard.whoAreYou'} />
            </Typography>
          </Grid>

          <Grid item >
            <PictureField handleSave={this.props.handleSave} edit={this.props.edit} />
          </Grid>

          <Grid item className={classes.field}>
            <TextField
              label={this.props.intl.formatMessage({ id: 'onboard.intro.name' }, { organisationName: this.props.orgStore.currentOrganisation.name })}
              type="text"
              className={classes.field}
              fullWidth
              variant={"outlined"}
              value={record.name}
              onChange={(e) => this.handleChange(e, 'name')}
              onBlur={(e) => { this.props.handleSave(['name']) }}
              error={(record.name && (record.name.length > 64)) === true}
              helperText={(record.name && record.name.length > 64) ? '64 characters max' : ''}
              required
            />
          </Grid>

          <Grid item className={classes.field} >
            <TextField
              label={this.props.intl.formatMessage({ id: 'onboard.intro.intro' }, { organisationName: this.props.orgStore.currentOrganisation.name })}
              type="text"
              className={classes.field}
              fullWidth
              variant={"outlined"}
              value={record.intro}
              onChange={(e) => this.handleChange(e, 'intro')}
              onBlur={(e) => this.props.handleSave(['intro'])}
              error={(record.intro && (record.intro.length > 256)) === true}
              helperText={(record.intro && record.intro.length > 256) ? '256 characters max' : ''}
              required
            />
          </Grid>

        </Grid>
    );
  }
}

export default inject('commonStore', 'recordStore', 'orgStore')(
  observer(
    injectIntl(withStyles(styles, { withTheme: true })(OnboardIntro))
  )
);
