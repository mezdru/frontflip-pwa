export const styles = theme => ({
  contactItem: {
    height: 60,
    background: 'rgba(242,242,242, .4)', //theme.palette.background.default with opacity = 0.7
    transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
    width: 90,
    borderRadius: 4,
    margin: 8,
    overflow: 'hidden',
    padding: 8,
    textAlign: 'center',
    cursor: 'pointer',
    position: 'relative',
    '&:hover': {
      boxShadow: '0px 1px 5px 0px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 3px 1px -2px rgba(0,0,0,0.12)',
      background: 'rgba(242,242,242, 1)'
    },
    [theme.breakpoints.down('xs')]: {
      width: 80
    }
  },
  contactIcon: {
    position: 'relative',
    left:0,
    right:0,
    margin: 'auto',
    fontSize: '24px !important',
  },
  contactName: {
    bottom: 8,
    position: 'absolute',
    fontSize: '0.642857rem', // same as placeholder in mini mode
    left: 0,
    right: 0,
    margin: 'auto',
    overflow: 'hidden',
    maxWidth: 'calc(100% - 16px)',
    textOverflow: 'ellipsis',
    fontWeight: 600, // same as placeholder in mini mode
    color: 'rgba(0,0,0,0.54)' // same as placeholder in mini mode
  },
  contactImg: {
    width: 24,
    height: 24,
    borderRadius: 4
  },
  tooltip: {
    marginBottom: 8,
    marginLeft: 16
  },
  addButton: {
    backgroundColor: 'white',
    boxShadow: '0px 1px 5px 0px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 3px 1px -2px rgba(0,0,0,0.12)'
  },
  paper: {
    boxSizing: 'border-box',
    boxShadow: '0 0 0 2038px rgba(0,0,0,.5)',
  },
});