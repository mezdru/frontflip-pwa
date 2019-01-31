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
                height: 72
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
                height: 72,
            }
        },
        MuiChip: {
            root: {
                padding: '6px 12px',
                fontWeight: '600',
                margin: 8,
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
            img: {
                height: 'auto',
            }
        },
        MuiButton: {
            root: {
                borderRadius: 30,
                height: "56px",
                fontWeight: "600",
            },
            text: {
                color: "darkgrey",
                ['&:hover']: {
                    color: 'black',
                }
            }
        },
        MuiIconButton: {
            root: {
                padding: '8px!important',
                color: '#DDE9EB',
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
                fontWeight: '600',
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
                marginLeft: 0,
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
                overflow: 'hidden',
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
            fontFamily: '"Open sans"',
        },
    }
});
