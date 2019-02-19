import React from 'react'
import { withStyles } from '@material-ui/core';
import { inject, observer } from "mobx-react";
import { TextField } from '@material-ui/core'

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
      <div>
        This is intro component
        <TextField
          label="Name"
          type="text"
          fullWidth
          variant={"outlined"}
          value={record.name}
          onChange={(e) => this.handleChange(e, 'name')}
          onBlur={this.props.handleSave}
          required
        />
        <TextField
          label="Intro"
          type="text"
          fullWidth
          variant={"outlined"}
          value={record.intro}
          onChange={(e) => this.handleChange(e, 'intro')}
          onBlur={this.props.handleSave}
          required
        />
      </div>
    );
  }
}

export default inject('commonStore', 'recordStore')(
  observer(
    withStyles(null)(OnboardIntro)
  )
);
