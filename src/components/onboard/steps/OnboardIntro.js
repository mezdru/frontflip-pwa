import React from 'react'
import { withStyles } from '@material-ui/core';
import { inject, observer } from "mobx-react";
import { TextField, Grid } from '@material-ui/core'
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
    const {record} = this.props.recordStore.values;

    return (
      // <Grid container direction={"column"} justify={"space-around"} alignItems={"center"}>
        <Grid container item xs={12} sm={6} lg={4} direction="column" spacing={16}>
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
              onBlur={this.props.handleSave}
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
              onBlur={this.props.handleSave}
              error={record.intro.length > 256}
              helperText={(record.intro.length > 256) ? '256 characters max' : ''}
              required
            />
          </Grid>
        </Grid>
      // </Grid>
    );
  }
}

export default inject('commonStore', 'recordStore')(
  observer(
    withStyles(null)(OnboardIntro)
  )
);
