import React from 'react'
import { withStyles } from '@material-ui/core';
import { inject, observer } from "mobx-react";
import { TextField, Grid, Typography } from '@material-ui/core'
import PictureField from '../../utils/fields/PictureField';
import {FormattedMessage} from "react-intl";
import { injectIntl } from 'react-intl';

const Entities = require('html-entities').XmlEntities;
const entities = new Entities();

class OnboardIntro extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    console.log('construct intro')
  }

  handleChange = (e, field) => {
    let record = this.props.recordStore.values.record;
    record[field] = e.target.value;
    this.props.recordStore.setRecord(record);
    this.forceUpdate(); // why component do not update auto like Login fields ?
  }

  render() {
    const { record } = this.props.recordStore.values;

    record.intro = entities.decode(record.intro);
    record.name = entities.decode(record.name);

    return (
      <Grid container style={{ height: 'calc(100vh - 73px)', background: this.props.theme.palette.primary.main }} direction="column">
        <Grid container item xs={12} sm={8} md={6} lg={4} spacing={16} direction="column" style={{flexBasis: '100%', width: '100%'}} >
          <Grid item style={{maxWidth: '100%'}}>
            <Typography variant="h4" style={{textAlign: 'center', padding: 8, color:this.props.theme.palette.primary.dark}} >
              <FormattedMessage id={'onboard.whoAreYou'}/>
            </Typography>
          </Grid>
          <Grid item style={{maxWidth: '100%'}}>
            <PictureField handleSave={this.props.handleSave} />
          </Grid>
          <Grid item style={{maxWidth: '100%'}}>
            <TextField
              label={this.props.intl.formatMessage({ id: 'onboard.intro.name' }, {organisationName: this.props.organisationStore.values.organisation.name})}
              type="text"
              fullWidth
              variant={"outlined"}
              value={record.name}
              onChange={(e) => this.handleChange(e, 'name')}
              onBlur={(e) => {this.props.handleSave(['name'])}}
              error={(record.name && (record.name.length > 64)) === true}
              helperText={(record.name && record.name.length > 64) ? '64 characters max' : ''}
              required
            />
          </Grid>
          <Grid item style={{maxWidth: '100%'}}>
            <TextField
              label={this.props.intl.formatMessage({ id: 'onboard.intro.intro' }, {organisationName: this.props.organisationStore.values.organisation.name})}
              type="text"
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
      </Grid>
    );
  }
}

export default inject('commonStore', 'recordStore', 'organisationStore')(
  observer(
    injectIntl(withStyles(null, {withTheme: true})(OnboardIntro))
  )
);
