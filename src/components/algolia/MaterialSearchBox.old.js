import { TextField, CircularProgress } from "@material-ui/core";
import React, { Component } from 'react';
import { connectAutoComplete } from 'react-instantsearch-dom';
import commonStore from '../../stores/common.store';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import { Clear } from "@material-ui/icons";
import Select from 'react-select';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import MenuItem from '@material-ui/core/MenuItem';
import CancelIcon from '@material-ui/icons/Cancel';
import Typography from '@material-ui/core/Typography';
import classNames from 'classnames';
import { emphasize } from '@material-ui/core/styles/colorManipulator';  
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: 250,
  },
  input: {
    display: 'flex',
    padding: 0,
  },
  valueContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flex: 1,
    alignItems: 'center',
    overflow: 'hidden',
  },
  chip: {
    margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`,
  },
  chipFocused: {
    backgroundColor: emphasize(
      theme.palette.type === 'light' ? theme.palette.grey[300] : theme.palette.grey[700],
      0.08,
    ),
  },
  noOptionsMessage: {
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
  },
  singleValue: {
    fontSize: 16,
  },
  placeholder: {
    position: 'absolute',
    left: 2,
    fontSize: 16,
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0,
  },
  divider: {
    height: theme.spacing.unit * 2,
  },
});

let prepareLabels = (array) => {
  let arrayOfLabel = [];
  array.forEach(hit => {
    let displayedName;
    if(hit.type === 'hashtag'){
      displayedName = (hit.name_translated ? (hit.name_translated[commonStore.locale] || hit.name_translated['en-UK']) : hit.name );
    }else {
      displayedName = hit.name;
    }
    arrayOfLabel.push({label: displayedName, value: hit.tag});
  });
  return arrayOfLabel;
}

const MySearchBox4 = ({ hits, currentRefinement, refine}) => (
<Select
            textFieldProps={{
              label: 'Label',
              InputLabelProps: {
                shrink: true,
              },
            }}
            options={prepareLabels(hits)}
            // components={components}
            value={currentRefinement}
            onChange={e => refine(e.target.value)}
            placeholder="Select multiple countries"
            isMulti
          />
);

const MySearchBox3 = ({ hits, currentRefinement, refine }) => (
    <ul>
      <li>
        <TextField
                error
                label="Search"
                type="search"
                fullWidth
                variant={"outlined"}
                value={currentRefinement}
                onChange={e => refine(e.target.value)}
                InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton aria-label="Toggle password visibility" onClick={e => refine('')}>
                            <Clear/>
                        </IconButton>
                      </InputAdornment>
                    ),
                }}
        />
      </li>
      {hits.map(hit => {
          let displayedName = (hit.name_translated ? (hit.name_translated[commonStore.locale] || hit.name_translated['en-UK']) : hit.name );
          if(hit.type === 'hashtag'){
              return (<li key={hit.objectID} onClick={e => refine(displayedName)}>{displayedName}</li>);
          }
      })}
    </ul>
  );

const MySearchBox2 = ({currentRefinement, refine}) =>
    <TextField
            error
            label="Search"
            type="search"
            fullWidth
            variant={"outlined"}
            value={currentRefinement}
            onChange={e => refine(e.target.value)}
    />;


    class MySearchBox extends React.Component {
      state = {
        single: null,
        multi: null,
        defaultHits: []
      };
    
      handleChange = name => value => {
        console.log('change');
        this.setState({
          [name]: value,
        });
        if(value.length > 0){
          this.props.refine(value[0].label);
        }else{
          this.props.refine(null);
        }        
      };
    
      render() {
        let { classes, theme, hits, currentRefinement, refine } = this.props;
        let {defaultHits} = this.state;

        if(defaultHits.length === 0) defaultHits = prepareLabels(hits); 
        console.log(defaultHits);
      
    
        const selectStyles = {
          input: base => ({
            ...base,
            color: theme.palette.text.primary,
            '& input': {
              font: 'inherit',
            },
          }),
        };
    
        return (
              <Select
                classes={classes}
                styles={selectStyles}
                textFieldProps={{
                  label: 'Label',
                  InputLabelProps: {
                    shrink: true,
                  },
                }}
                value={this.state.multi}
                options={defaultHits}
                onChange={this.handleChange('multi')}
                filterOptions={(options)=>{return options;}}
                loadOptions={this.handleChange('multi')}
                placeholder="Select multiple countries"
                isMulti
              />
        );
      }
    }
    
    MySearchBox.propTypes = {
      classes: PropTypes.object.isRequired,
      theme: PropTypes.object.isRequired,
    };

// `ConnectedSearchBox` renders a `<MySearchBox>` widget that is connected to
// the <InstantSearch> state, providing it with `currentRefinement` and `refine` props for
// reading and manipulating the current query of the search.
const MaterialSearchBox = connectAutoComplete(MySearchBox);
export default withStyles(styles, { withTheme: true })(MaterialSearchBox);
