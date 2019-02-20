import React from 'react'
import { withStyles, LinearProgress, Button } from '@material-ui/core';
import { inject, observer } from "mobx-react";
import Uploader from '../uploadcare/Uploader';

class PictureField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  handleChange = (file) => {
    if(!file) {
      let record = this.props.recordStore.values.record;
      record.picture = {
        url: null
      };
      this.props.recordStore.setRecord(record);
    }
    this.props.handleSave();
  }

  handleUploadComplete = (file) => {
    let record = this.props.recordStore.values.record;
    record.picture = {
      url: file.cdnUrl
    };
    this.props.recordStore.setRecord(record);
    this.setState({pictureUrl: file.cdnUrl});
    this.props.handleSave();
  }

  handleResetPicture = (e) => {
    this.forceUpdate();
  }

  render() {
    const {record} = this.props.recordStore.values;
    const {pictureUrl} = this.state;

    return (
      <div>
          <label htmlFor='file'>Your picture:</label>{' '}
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

            {pictureUrl && (
              <div>
                <img src={pictureUrl} alt="Your picture" width={80} height={80} />
              </div>
            )}
      </div>
    );
  }
}

export default inject('commonStore', 'recordStore')(
  observer(
    withStyles(null)(PictureField)
  )
);
