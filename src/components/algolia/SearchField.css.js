import { withStyles, withTheme } from "@material-ui/core";

const searchFieldStyle = theme => ({
  control: (base, state) => ({
    ...base,
    borderRadius: '30px',
    boxSizing: 'border-box',
    border: state.isFocused ? "2px solid #dd362e" : "1px solid #dd362e",
    boxShadow: state.isFocused ? null : null,
    "&:hover": {
      borderColor: state.isFocused ? "#dd362e" : "#dd362e",
      boxSizing: 'border-box'
    },
    padding: '3px 16px',
    minHeight: 54,
    fontSize: 16
  }),
  menu: base => ({
    ...base,
    borderRadius: '30px',
    overflow: 'hidden',
    hyphens: "auto",
    textAlign: "center",
    // prevent menu to scroll y
    wordWrap: "break-word",

  }),
  menuList: base => ({
    ...base,
    padding: 0,
  }),
  input: base => ({
    ...base,
    padding: 0,
    marginLeft: 8,
  }),
  multiValue: base => ({
    ...base,
    background: theme.palette.primary.main,
  }),
  placeholder: base => ({
    ...base,
    marginLeft: 8,
  }),
  valueContainer: (provided, state) => ({
    ...provided,
    padding: '0 !important',
    margin: 0,
    marginLeft: -8,
    overflow: 'auto',
    maxHeight: 42,
    '&:last-child': {
      marginBottom: 8,
    },
  }),
});

export default withTheme()(searchFieldStyle);