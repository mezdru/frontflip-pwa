export const styles = theme => ({
  root: {
    background: theme.palette.primary.dark
  },
  container: {
    backgroundColor: 'white',
    borderRadius: 5,
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
  }
});