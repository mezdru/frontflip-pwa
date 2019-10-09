import React, { Suspense } from 'react'
import { withStyles, CircularProgress } from '@material-ui/core';
import { inject, observer } from "mobx-react";
import { injectIntl } from 'react-intl';
import ProfileService from '../../../services/profile.service';
import defaultPicture from '../../../resources/images/placeholder_person.png';
import './uploadcare_customize.css';

const Uploader = React.lazy(() => import('../uploadcare/Uploader'));

const styles = theme => ({
  pictureContainer: {
    position: 'relative',
    margin: '0px 16px',
    textAlign: 'center',
    [theme.breakpoints.down('xs')] : {
      margin: 8,
    },
  },
  picture: {
    position: 'relative',
    borderRadius: '50%',
    width:250,
    height:250,
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
    this._ismounted = true;
  }

  handleChange = (file) => {
    if(!this._ismounted) return;
    if(!file) {
      let record = (this.props.edit ? this.props.recordStore.currentUrlRecord : this.props.recordStore.currentUserRecord);
      record.picture = {
        url: null
      };
      this.setState({pictureUrl: null, loading: false});
      this.props.handleSave(['picture']);
    } else {
      this.setState({loading: true});
    }
  }

  componentWillUnmount() {
    this._ismounted = false;
  }

  handleUploadComplete = (file) => {
    if(!this._ismounted) return;
    let record = (this.props.edit ? this.props.recordStore.currentUrlRecord : this.props.recordStore.currentUserRecord);
    record.picture = {
      url: file.cdnUrl
    };
    this.setState({pictureUrl: file.cdnUrl, loading: false});
    this.props.handleSave(['picture']);
  }

  handleResetPicture = (e) => {
    this.forceUpdate();
  }

  render() {
    const {pictureUrl, loading} = this.state;
    const {classes} = this.props;
    let record = (this.props.edit ? this.props.recordStore.currentUrlRecord : this.props.recordStore.currentUserRecord);

    return (
      <div>

          <div className={classes.pictureContainer} style={this.props.style} >
            { (loading && !pictureUrl) && (
              <CircularProgress color='secondary' className={classes.picture} size={300} />
            )}
            {(!loading || pictureUrl) && (
              <img src={ProfileService.getPicturePathResized({url: pictureUrl}, 'person', '250x250') || defaultPicture} alt="" className={classes.picture} />
            )}
          </div>

          <Suspense fallback={<CircularProgress color='secondary' />}>
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
          </Suspense>

      </div>
    );
  }
}

export default inject('commonStore', 'recordStore')(
  observer(
    injectIntl(withStyles(styles)(PictureField))
  )
);
