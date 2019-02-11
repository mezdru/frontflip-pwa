import {createMuiTheme} from '@material-ui/core/styles';

export const palette = {
  primary: {
    light: '#EFA3A0',
    main: '#DD362E',
    dark: '#A12B22',
    contrastText: '#fff',
  },
  secondary: {
    light: '#DDE9EB',
    main: '#A3C4C9',
    dark: '#789094',
    contrastText: '#0D0221',
  },
  background: {
    default: '#f2f2f2',
  }
};

export default createMuiTheme({
  palette: palette,
  typography: {
    useNextVariants: true,
    fontSize: 12,
    fontFamily: [
      '"Open sans"',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
  overrides: {
    // General styles
    MuiGrid: {
      "spacing-xs-16": {
        width: "auto",
        margin: "auto",
      },
    },
    MuiTypography: {
      root: {
        overflow: 'hidden',
      },
      h6: {
        display: 'block',
        padding: 8,
      },
      h5: {
        color: palette.secondary.contrastText,
        fontWeight: '700',
      },
      h4: {
        color: palette.secondary.contrastText,
        fontWeight: '400',
      },
      body1: {
        color: palette.secondary.contrastText,
        fontWeight: '400',
      },
      body2: {
        fontWeight: '600',
      }
    },
    // Avatar
    MuiAvatar: {
      img: {
        height: 'auto',
      }
    },
    //Buttons
    MuiButton: {
      root: {
        borderRadius: 30,
        height: "56px",
        fontWeight: "600",
        transition: 'all 250ms',
        padding: '8px 24px',
      },
      text: {
        color: "darkgrey",
        '&:hover': {
          color: 'black',
        }
      }
    },
    MuiIconButton: {
      root: {
        color: '#DDE9EB',
        padding: 8,
      }
    },
    MuiChip: {
      root: {
        padding: '6px 12px',
        fontWeight: '600',
        margin: '16px 8px 4px 8px',
        fontSize: '0.8125rem',
      },
      label: {
        '& div': {
          color: 'white',
          fontSize: '0.8125rem',
        },
        '& div:nth-child(2)': {
          cursor: 'pointer',
          height: 22,
          width: 22,
          borderRadius: '50%'
        }
      },
      colorPrimary: {
        backgroundColor: palette.primary.main,
        '&:hover': {
          backgroundColor: palette.primary.dark,
        },
      },
      colorSecondary: {
        color: 'white',
        backgroundColor: palette.secondary.main,
        '&:hover': {
          color: 'white',
          backgroundColor: palette.secondary.dark
        },
      }
    },
    //Cards
    MuiCard: {
      root: {
        padding: 0,
        borderRadius: 20,
        margin: 15,
        marginLeft: 0,
      }
    },
    MuiCardActions: {
      root: {
        padding: '0 8px!important',
        display: 'flex',
      }
    },
    MuiCardContent: {
      root: {
        padding: '0 0 16px 8px!important',
        whiteSpace: 'nowrap',
        overflowX: 'scroll',
      }
    },
    MuiCardHeader: {
      root: {
        width: '100%',
        backgroundColor: palette.secondary.light,
      },
      content: {
        display: 'inline-grid',
        textAlign: 'left',
        resize: 'horizontal',
      },
    },
    //Header
    MuiAppBar: {
      root: {
        height: 72,
        maxWidth: '100vw',
        left: '0 !important',
      }
    },
    MuiDrawer: {
      root: {
        height: 72,
      }
    },
    MuiPaper: {
      root: {
        padding: '16px'
      }
    },
    //Inputs
    MuiOutlinedInput: {
      root: {
        backgroundColor: 'white',
        borderRadius: 30,
        [`& fieldset`]: {
          borderRadius: 30
        },
      },
      input: {
        borderRadius: 30,
      }
    },
    //List
    MuiList: {
      padding: {
        paddingTop: 0,
        paddingBottom: 0,
      }
    },
    MuiListItem: {
      root: {
        paddingTop: 8,
        paddingBottom: 8,
      },
    },
    // Tabs
    MuiTab: {
      root: {
        fontSize: '0.875rem!important',
        fontWeight: '600',
        '&:hover': {
          color: palette.primary.main
        },
      },
      labelContainer: {
        padding: '0px!important', // nous permet d'avoir nos espacement de 16px à chaques view
      }
    },
  },
  // Props
    props: {
      MuiButton: {
        variant: "contained",
      },
      MuiInput: {
        margin: "none"
      }
    },
  });
