import {createMuiTheme} from '@material-ui/core/styles';

export const palette = {
    primary: {
        light: '#c69a96',
        main: '#FF0018',
        dark: '#9c001d',
        contrastText: '#ffffff',
    },
    secondary: {
        light: '#b6cce2',
        main: '#466180',
        dark: '#293643',
        contrastText: '#070d14',
    },
};

export default createMuiTheme({
    palette: palette,
    typography: {
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
        MuiAppBar: {
            root: {
                height: 80
            }
        },
        MuiGrid: {
            "spacing-xs-16": {
                width: "auto",
                margin: "auto",
            },
        },
        MuiDrawer: {
            root: {
                height: 80,
            }
        },
        MuiChip: {
            root: {
                padding: '6px 12px',
                fontWeight: 'bold',
                margin: 8,
                boxShadow: '0 2px 2px -1px darkgrey, 0 0 0 5px transparent',
                ['&:hover']: {
                    boxShadow: '0 5px 15px -1px darkgrey, 0 0 0 5px transparent',
                },
            },
            colorPrimary: {
                backgroundColor: palette.primary.main,
                ['&:hover']: {
                    backgroundColor: palette.primary.dark,
                },
            },
            colorSecondary: {
                color:'white',
                backgroundColor: palette.secondary.main,
                ['&:hover']: {
                    color:'white',
                    backgroundColor: palette.secondary.dark
                },
            }
        },
        MuiAvatar: {
            root: {
                // width: '6rem',
                // height: '6rem',
                // boxShadow: '0 5px 15px -1px darkgrey, 0 0 0 5px transparent',
                backgroundColor: 'white',
            },
            img: {
                height: 'auto',
            }
        },
        MuiButton: {
            root: {
                borderRadius: 30,
                height: "56px",
            },
            text: {
                color: "darkgrey",
                ['&:hover']: {
                    backgroundColor: "transparent",
                    color: palette.primary.main
                }
            }
        },
        MuiIconButton: {
            root: {
                padding: '8px!important',
                color: palette.secondary.light,
            }
        },
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
        MuiTab: {
            root: {
                fontSize: '0.875rem!important',
                fontWeight: '400',
                ['&:hover']: {
                    color: palette.primary.main
                },
            },
        },
        MuiCard: {
            root: {
                padding: 0,
                borderRadius: 20,
                margin: 15,
            }
        },
        MuiCardActions: {
            root: {
                padding: '0 8px!important',
                display: 'flex',
            }
        },
        MuiCardHeader: {
            root: {
                width: '100%',
                backgroundColor: palette.secondary.light,
                paddingRight: '16px!important',
                paddingLeft: '16px!important',
            },
            content: {
                display: 'inline-grid',
                textAlign: 'left',
                resize: 'horizontal',
            },
        },
        MuiCardContent: {
            root: {
                marginTop: 20,
                paddingLeft: '8px!important',
                padding: '16px!important',
                whiteSpace: 'nowrap',
                overflowX: 'scroll',
            }
        },
        MuiPaper: {
            root: {
                padding: '16px'
            }
        },
        MuiTypography: {
            root: {
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
            },
            h6: {
                display: 'block',
                padding: 8,
                fontFamily: '"Open sans"',
            },
            h5: {
                color: palette.secondary.contrastText,
                fontWeight: '700',
                fontFamily: '"Open sans"',
            },
            subheading: {
                color: palette.secondary.contrastText,
                fontWeight: '500',
                fontFamily: '"Open sans"',
            }
        },
    },
    props: {
        MuiButton: {
            variant: "contained"
        },
        MuiInput: {
            margin: "none"
        }
    },
    global: {
        body: {
            fontFamily: '"Open sans',
        },
    }
});
