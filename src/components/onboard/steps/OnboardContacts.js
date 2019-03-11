import React from 'react'
import {inject, observer} from "mobx-react";
import {withStyles, Grid, TextField, InputAdornment, IconButton} from '@material-ui/core';
import {Clear} from '@material-ui/icons';
import AddContactField from '../../utils/fields/AddContactField';


class OnboardContacts extends React.Component {
  constructor(props) {
    super(props);
    this.setInfo();
  }
  
  handleChange = (e, field) => {
    let record = this.props.recordStore.values.record;
    record[field] = e.target.value;
    this.props.recordStore.setRecord(record);
    this.forceUpdate(); // why component do not update auto like Login fields ?
  }
  
  deleteInfo = (infoToBeDeleted) => {
    this.props.recordStore.values.record.links = this.props.recordStore.values.record.links.filter(item => {
      return item._id !== infoToBeDeleted
    })
    this.forceUpdate();
  }
  
  getLinkByType = (typeWanted) => {
    return (this.props.recordStore.values.record.links.find(link => link.type === typeWanted));
  }
  
  setInfo = () => {
    let types = ['linkedin', 'email', 'phone']
    for (let type of types) {
      if (!this.getLinkByType(type)) {
        this.props.recordStore.values.record.links.push({"_id":"new_"+(new Date()).getMilliseconds(),"type":type,"value":""})
      }
    }
  };
  
  render() {
    const data = this.props.recordStore.values.record.links;
    
    console.log('data: ' + JSON.stringify(this.props.recordStore.values.record.links))
    
    return (
      <Grid container item xs={12} sm={6} lg={4} direction="column" spacing={16}>
        <Grid item>
          <AddContactField style={{position: 'relative'}} parent={this}/>
        </Grid>
        {data.map((info, i) => {
            return (
              <Grid item key={i}>
                <TextField
                  label={info.type}
                  type="text"
                  fullWidth
                  variant={"outlined"}
                  value={info.value}
                  onChange={(e) => this.handleChange(e, 'intro')}
                  onBlur={this.props.handleSave}
                  placeholder={info.type}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        {info.type === 'email' ? <i className="fa fa-envelope"/> : <i className={`fa fa-${info.type}`}/>}
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <IconButton position="end" onClick={() => {
                        this.deleteInfo(info._id)
                      }}>
                        <Clear fontSize="default"/>
                      </IconButton>
                    )
                  }}
                />
              </Grid>
            )
        })}
      </Grid>
    );
  }
}

export default inject('commonStore', 'recordStore')(
  observer(
    withStyles(null)(OnboardContacts)
  )
);
