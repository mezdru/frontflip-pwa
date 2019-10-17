import {createMuiTheme} from '@material-ui/core/styles';

export const palette = {
  secondary: {
    light: '#EFA3A0',
    main: '#FF0018',
    dark: '#BA0012',
  },
  primary: {
    main: '#e4e5ec',
    dark: '#2b2d3c',
    hover: '#aaacbe',
    contrastText: '#fff',
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
      "Poppins",
      "sans-serif"
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
    MuiTooltip: {
      popper: {
        zIndex: 9999999999,
        marginTop: -8
      }
    },
    MuiTypography: {
      root: {
        color: palette.primary.dark
      },
      h1: {
        fontSize: '2rem',
        fontWeight: 600,
      },
      h2: {
        fontSize: '1.3rem',
        fontWeight: 500,
      },
      h3: {
        fontSize: '1.2rem',
        fontWeight: 500,
      },
      h4: {
        fontWeight: '400',
      },
      h5: {
        fontWeight: '700',
      },
      h6: {
        padding: 8,
      },
      body1: {
        fontWeight: '500',
        fontSize: '1rem',
      },
      body2: {
        fontSize: '.85rem',
        color: '#555555'
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
        height: "56px",
        fontWeight: "600",
        transition: 'all 250ms',
        padding: '8px 24px',
      },
      contained: {
        '&:hover': {
          backgroundColor: palette.secondary.dark,
          color: 'white',
        }
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
        color: '#aaacbe',
        padding: 8,
      }
    },
    MuiChip: {
      root: {
        padding: '6px 12px',
        fontWeight: '600',
        margin: '16px 8px 4px 8px',
        fontSize: '0.9125rem',
      },
      label: {
        '& div': {
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
        color: palette.primary.dark,
        backgroundColor: 'white',
        '&:hover': {
          color: palette.primary.dark,
          backgroundColor: palette.primary.hover +' !important',
        },
      },
      colorSecondary: {
        color: 'white',
        backgroundColor: palette.primary.dark,
        '&:hover': {
          backgroundColor: palette.primary.hover +' !important'
        },
      },
    },
    MuiBackdrop: {
      root: {
        filter: 'brightness(0) invert(1)',
      },
    },
    //Cards
    MuiCard: {
      root: {
        padding: 0,
        borderRadius: 4,
        margin: 15,
        marginLeft: 0,
        boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
        transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
        '&:hover': {
          boxShadow: '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)',
        },
        backgroundImage: 'linear-gradient(to bottom, #2b2d3c, #292a38, #262733, #24242f, #21212b)',
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
        // padding: '0 0 8px 8px!important',
        padding: 0,
        whiteSpace: 'nowrap',
        scrollbarWidth: 'none',
      }
    },
    MuiCardHeader: {
      root: {
        width: '100%',
        backgroundColor: "transparent",
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
        height: 64,
        maxWidth: '100vw',
        left: '0 !important',
      }
    },
    MuiDrawer: {
      root: {
        height: 64,
      }
    },
    MuiPaper: {
      root: {
        padding: '16px'
      }
    },
    MuiDialog: {
      paper: {
        margin: 16
      }
    },
    //Inputs
    MuiOutlinedInput: {
      root: {
        backgroundColor: 'white',
        borderRadius: 4,
      },
      input: {
        fontSize: 'large',
        color:palette.primary.dark,
      },
      adornedEnd: {
        paddingRight: 8,
      }
    },
    MuiInputLabel: {
      shrink: {
        fontWeight: '600',
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
    MuiMobileStepper: {
      dot: {
        backgroundColor: palette.primary.main,
        margin: 8,
      },
      dotActive: {
        transform: 'scale(1.5)',
        backgroundColor: palette.secondary.main
      }
    }
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
