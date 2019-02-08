import ProfileService from '../../services/profile.service';
import defaultPicture from '../../resources/images/placeholder_person.png';
import withWidth, { isWidthUp, isWidthDown } from '@material-ui/core/withWidth';
import React from 'react';
import './SearchField.css';

export const Option = props => {
  const { innerProps, innerRef } = props;
  console.log(props.data)
  return (
    <div ref={innerRef} {...innerProps} className="custom-option">
      <div className="custom-option-main">
        {props.data.picturePath && (
          <img src={props.data.picturePath || 
            (ProfileService.getProfileType(props.data.value) === 'person' ? 
              (process.env.NODE_ENV === 'production' ? 'https://' : 'http://') +window.location.host + defaultPicture : 
              null) } 
              className="custom-option-img" />
        )}
        <span dangerouslySetInnerHTML={{__html: props.data.label}} className="custom-option-label"></span>
      </div>
      { (props.data.value && ProfileService.getProfileType(props.data.value) && !isWidthDown('xs', props.width)) && (
        <div className="custom-option-secondary">
          {props.data.value}
        </div>
      )}
    </div>
  );
};