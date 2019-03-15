import React from 'react'
import {inject, observer} from "mobx-react";
import {withStyles, Grid, TextField, InputAdornment, IconButton, Typography} from '@material-ui/core';
import {Clear} from '@material-ui/icons';
import AddContactField from '../../utils/fields/AddContactField';
import ProfileService from "../../../services/profile.service";
import {FormattedMessage} from "react-intl";


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
    console.log('id: ' + infoToBeDeleted)
    
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
    ProfileService.transformLinks(this.props.recordStore.values.record);
    
    return (
      <Grid container style={{height: 'calc(100vh - 72px)', background: '#F2F2F2'}} direction="column">
        <Grid container item xs={12} sm={8} md={6} lg={4} direction="column" spacing={16} style={{flexBasis: '100%', width: '100%'}}>
          <Grid item>
            <Typography variant="h4" style={{textAlign: 'center', padding: 8}}>
              <FormattedMessage id={'onboard.yourContact'}/>
            </Typography>
          </Grid>
            {links && links.map((link, i) => {
              return (
                <Grid item key={i}>
                  <TextField
                    style={{width: '100%'}}
                    label={link.type}
                    type="text"
                    variant={"outlined"}
                    value={link.value}
                    onChange={(e) => this.handleLinksChange(e, link, i)}
                    onBlur={() => this.props.handleSave(['links'])}
                    placeholder={link.type}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" style={{fontSize: 24}}>
                          <i className={"fa fa-" + link.icon}/>
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
            <Grid item style={{width: '100%'}}>
              <AddContactField parent={this} handleSave={this.props.handleSave} addLink={this.addLink}/>
            </Grid>
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
