export const styles = theme => ({
  root: {
    background: theme.palette.primary.dark
  },
  container: {
    backgroundColor: 'white',
    borderRadius: 4,
    overflow: 'hidden',
    boxShadow: '0px 1px 5px 0px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 3px 1px -2px rgba(0,0,0,0.12)',
    maxHeight: 'calc(100vh - 64px)',
    [theme.breakpoints.down('xs')]: {
      maxHeight: 'unset'
    }
    // overflowY: 'auto',
  },
  stepComponentContainer: {
    maxHeight: 'calc(100% - 64px)',
    overflowY: 'auto',
    [theme.breakpoints.down('xs')]: {
      height: 'calc(100vh - 72px)',
      maxHeight: 'unset',
      overflowY: 'auto',
    }
  },
  stepperButton: {
    background: 'none',
    boxShadow: 'none',
    padding: '8px 16px',
    color: 'white',
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.12)',
    },
    '&:first-child()': {
      width: 40,
    },
    '&:disabled': {
      color: theme.palette.primary.hover + '!important'
    }
  },
  stepperButtonHighlighted: {
    background: theme.palette.secondary.main,
    '&:hover': {
      background: theme.palette.secondary.dark,
    },
  },
  loaderFeedback: {
    position: "fixed",
    bottom: 16,
    zIndex: 999,
    left: 0,
    right: 0,
    margin: "auto",
    width: 60,
    textAlign: "center",
    [theme.breakpoints.down('xs')]: {
      left: 16,
      right: 'initial',
      margin: 0
    }
  }
});