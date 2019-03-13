import React from 'react'
import {inject, observer} from "mobx-react";
import {withStyles, Grid, TextField, InputAdornment, IconButton} from '@material-ui/core';
import {Clear} from '@material-ui/icons';
import AddContactField from '../../utils/fields/AddContactField';


class OnboardContacts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      links: this.props.recordStore.values.record.links || []
    }
  }

  componentDidMount() {
    this.setDefaultLinks();
  }
  
  handleLinksChange = (e, link, index) => {
    link.value = e.target.value;

    let links = this.state.links;
    links[index].value = e.target.value;
    this.props.recordStore.values.record.links = links;
    this.setState({links});
  }
  
  deleteLink = (infoToBeDeleted) => {
    this.props.recordStore.values.record.links = this.props.recordStore.values.record.links.filter(item => {
      return item._id !== infoToBeDeleted
    })
    this.setState({links: this.props.recordStore.values.record.links});
    this.props.handleSave(['links']);
  }
  
  addLink = (link) => {
    this.props.recordStore.values.record.links.push(link);
    this.setState({links: this.props.recordStore.values.record.links});
  } 

  getLinkByType = (typeWanted) => {
    return (this.props.recordStore.values.record.links.find(link => link.type === typeWanted));
  }
  
  setDefaultLinks = () => {
    let types = ['email', 'phone', 'linkedin'];
    let links = this.state.links;
    for (let type of types) {
      if (!this.getLinkByType(type)) {
        links.push({"type": type, "value": ""});
      }
    }
    this.setState({links});
  };
  
  render() {
    const {links} = this.state;
    
    return (
      <Grid container item xs={12} sm={6} lg={4} direction="column" spacing={16}>
        {links && links.map((link, i) => {
          return (
            <Grid container item key={i}>
              <TextField
                label={link.type}
                fullWidth
                type="text"
                variant={"outlined"}
                value={link.value}
                onChange={(e) => this.handleLinksChange(e, link, i)}
                onBlur={(e) => this.props.handleSave(['links'])}
                placeholder={link.type}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {link.type === 'email' ? <i className="fa fa-envelope"/> : <i className={`fa fa-${link.type}`}/>}
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <IconButton position="end" onClick={() => {
                      this.deleteLink(link._id)
                    }}>
                      <Clear fontSize="default"/>
                    </IconButton>
                  )
                }}
              />
            </Grid>
          )
        })}
        <Grid item>
          <AddContactField style={{position: 'relative'}} parent={this} handleSave={this.props.handleSave} addLink={this.addLink} />
        </Grid>
      </Grid>
    );
  }
}

export default inject('commonStore', 'recordStore')(
  observer(
    withStyles(null)(OnboardContacts)
  )
);
