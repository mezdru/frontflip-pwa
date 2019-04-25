import React from 'react'
import { withStyles, CircularProgress } from '@material-ui/core';
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
    [theme.breakpoints.down('xs')] : {
      margin: 8,
    },
  },
  picture: {
    position: 'relative',
    borderRadius: '50%',
    width:300,
    height:300,
    [theme.breakpoints.down('xs')] : {
      width: 180,
      height: 180,
    },
    border: '8px solid white',
    background: 'white',
    zIndex: 2,
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

  componentDidMount() {
    console.log('picture field')
    this._ismounted = true;
  }

  handleChange = (file) => {
    if(!this._ismounted) return;
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

  componentWillUnmount() {
    this._ismounted = false;
  }

  handleUploadComplete = (file) => {
    if(!this._ismounted) return;
    let record = this.props.recordStore.values.record;
    record.picture = {
      url: file.cdnUrl
    };
    this.props.recordStore.setRecord(record);
    this.setState({pictureUrl: file.cdnUrl, loading: false});
    this.props.handleSave(['picture']);
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

          <div className={classes.pictureContainer} style={this.props.style} >
            { (loading && !pictureUrl) && (
              <CircularProgress color='secondary' className={classes.picture} size={300} />
            )}
            {(!loading || pictureUrl) && (
              <img src={pictureUrl || defaultPicture} alt="" className={classes.picture} />
            )}
          </div>

          <Uploader
            style={{maxWidth: '100%'}}
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
