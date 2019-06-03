import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { withStyles } from '@material-ui/core';

const locales = {
  'fr': 'Français',
  'en': 'English'
};

const styles = {
  root: {
    marginRight: 24,
    backgroundColor: 'white',
    paddingRight: 8,
    paddingLeft: 8,
    borderRadius: 5,
  }
};

const LocaleSelector = React.memo(({ currentLocale, handleChange, ...props }) => {
  return (
    <Select
      value={currentLocale}
      onChange={handleChange}
      className={props.classes.root}
    >
      <MenuItem value={'en'}>{locales['en']}</MenuItem>
      <MenuItem value={'fr'}>{locales['fr']}</MenuItem>
    </Select>
  );
});

export default withStyles(styles)(LocaleSelector);
