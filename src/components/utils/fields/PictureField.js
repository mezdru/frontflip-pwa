import React from 'react'
import { withStyles, Button, CircularProgress } from '@material-ui/core';
import { inject, observer } from "mobx-react";
import { injectIntl } from 'react-intl';

import Uploader from '../uploadcare/Uploader';
import defaultPicture from '../../../resources/images/placeholder_person.png';
import './uploadcare_customize.css';

const styles = theme => ({
  pictureContainer: {
    position: 'relative',
    margin: '8px 16px',
    textAlign: 'center',
  },
  picture: {
    position: 'relative',
    borderRadius: '50%',
    width:300,
    height:300,
    border: '8px solid white',
    zIndex: 2,
  },
  pictureAlt: {
    position: 'absolute',
    top:'50%',
    transform:'translateY(-50%)',
    left:0,
    right:0,
    margin:'auto',
    width: 250
  },
});

class PictureField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      pictureUrl: null,
    };
  }

  handleChange = (file) => {
    if(!file) {
      let record = this.props.recordStore.values.record;
      record.picture = {
        url: null
      };
      this.props.recordStore.setRecord(record);
      this.setState({pictureUrl: null, loading: false});
      this.props.handleSave();
    } else {
      this.setState({loading: true});
    }
  }

  handleUploadComplete = (file) => {
    let record = this.props.recordStore.values.record;
    record.picture = {
      url: file.cdnUrl
    };
    this.props.recordStore.setRecord(record);
    this.setState({pictureUrl: file.cdnUrl, loading: false});
    this.props.handleSave();
  }

  handleResetPicture = (e) => {
    this.forceUpdate();
  }

  render() {
    const {record} = this.props.recordStore.values;
    const {pictureUrl, loading} = this.state;
    const {classes} = this.props;

    return (
      <div>

          <div className={classes.pictureContainer}>
            {loading && (
              <CircularProgress color='primary' className={classes.picture} size={300} />
            )}
            {!loading && (
              <p className={classes.pictureAlt} >
                Please wait for your picture preview.
              </p>
            )}
            {!loading && (
              <img src={pictureUrl || defaultPicture} alt="" className={classes.picture} />
            )}
          </div>

          <Uploader
            id='file'
            name='file'
            data-tabs='file camera url'
            data-crop="180x180 upscale" 
            data-image-shrink="1280x1280"
            onChange={this.handleChange}
            value={pictureUrl || (record.picture ? record.picture.url : null)}
            onUploadComplete={this.handleUploadComplete} 
            data-images-only />
      </div>
    );
  }
}

export default inject('commonStore', 'recordStore')(
  observer(
    injectIntl(withStyles(styles)(PictureField))
  )
);
