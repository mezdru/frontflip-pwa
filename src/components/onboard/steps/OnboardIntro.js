import React from 'react'
import { withStyles } from '@material-ui/core';
import { inject, observer } from "mobx-react";
import { TextField, Grid, Typography } from '@material-ui/core'
import PictureField from '../../utils/fields/PictureField';

class OnboardIntro extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  handleChange = (e, field) => {
    let record = this.props.recordStore.values.record;
    record[field] = e.target.value;
    this.props.recordStore.setRecord(record);
    this.forceUpdate(); // why component do not update auto like Login fields ?
  }

  render() {
    const { record } = this.props.recordStore.values;

    return (
      <Grid container style={{ height: 'calc(100vh - 72px)', background: '#F2F2F2' }} direction="column">
        <Grid container item xs={12} sm={8} md={6} lg={4} spacing={16} direction="column" style={{flexBasis: '100%'}} >
          <Grid item>
            <Typography variant="h4" style={{textAlign: 'center'}} >Who are you?</Typography>
          </Grid>
          <Grid item>
            <PictureField handleSave={this.props.handleSave} />
          </Grid>
          <Grid item>
            <TextField
              label="First and last name"
              type="text"
              fullWidth
              variant={"outlined"}
              value={record.name}
              onChange={(e) => this.handleChange(e, 'name')}
              onBlur={(e) => {this.props.handleSave(['name'])}}
              error={record.name.length > 64}
              helperText={(record.name.length > 64) ? '64 characters max' : ''}
              required
            />
          </Grid>
          <Grid item>
            <TextField
              label="Role at {org name}"
              type="text"
              fullWidth
              variant={"outlined"}
              value={record.intro}
              onChange={(e) => this.handleChange(e, 'intro')}
              onBlur={(e) => this.props.handleSave(['intro'])}
              error={record.intro.length > 256}
              helperText={(record.intro.length > 256) ? '256 characters max' : ''}
              required
            />
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default inject('commonStore', 'recordStore')(
  observer(
    withStyles(null)(OnboardIntro)
  )
);
