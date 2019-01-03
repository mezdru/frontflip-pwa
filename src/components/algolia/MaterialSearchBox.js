import { TextField, CircularProgress } from "@material-ui/core";
import React, { Component } from 'react';
import { connectAutoComplete } from 'react-instantsearch-dom';
import commonStore from '../../stores/common.store';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import { Clear } from "@material-ui/icons";

const MySearchBox = ({ hits, currentRefinement, refine }) => (
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
          console.log(displayedName);
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

// `ConnectedSearchBox` renders a `<MySearchBox>` widget that is connected to
// the <InstantSearch> state, providing it with `currentRefinement` and `refine` props for
// reading and manipulating the current query of the search.
const MaterialSearchBox = connectAutoComplete(MySearchBox);
export default MaterialSearchBox;